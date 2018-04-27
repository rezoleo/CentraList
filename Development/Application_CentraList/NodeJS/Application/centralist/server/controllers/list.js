/* 
 * File 	: ./server/controllers/list.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the controller used to manage the lists
 * Version  	: 1.0.0
 */

var 	User      = require('../models/user.js'),
	List      = require('../models/list.js'),
	Field     = require('../models/field.js'),
	findError = require('../errors/referential.js'),
	_         = require('underscore'),
	async     = require('async');

/* Retrieve all available lists */
function getLists(req, res, next){
	var s = req.session;
	
	List.getFromDb(function(err, t){
		var a = [];
		if (err) return next(err);
		
		async.each(t, function(list, done){
			list.canSee(s.user, function(err, b, list){
				if (err) return next(err);
				if (b){
					a.push(list.obj(true));
				}
				done();
			});
		}, function(err){
			res.status(200).json(a);
		});
	});
}

function getList(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (req.params.id === null || list.name === null) return next(findError("CENTRALIST.7.1.1"));
		
		list.canSee(s.user, function(err, b){
			if (err) return next(err);
			if (b){
				list.isMod(s.user, function(err, b){
					var o = list.obj(true);
					o.isModerator = b;
					list.isMember(s.user, function(err, b){
						o.isLinked = b;
						res.status(200).json(o);
					});
				});
			}
			else return next(findError("CENTRALIST.7.1.2"));
		});
	});
}

function createList(req, res, next){
	var s = req.session,
		list = null,
		f = null;
	if (req.body.name == null || req.body.fields == null || req.body.type === null || req.body.userFields == null || !List.isValidUserFields(req.body.userFields) || req.body.category == null || req.body.category.type == null)
	{
		return next(findError("CENTRALIST.7.2.1"));
	}
	else
	{
		f = _.map(req.body.fields, function(e){ // never trust user input
			return new Field(e).obj();
		});
		list = new List();
		list.name = req.body.name;
		list.desc = req.body.desc;
		list.fields = f;
		list.userFields = req.body.userFields;
		list.category = _.pick(req.body.category, 'type', 'place', 'date', 'endDate');
		list.type = req.body.type || 0;
		list.creatorId = s.user.id;
		list.save(function(err){
			if (err) return next(err);
			list.addMod(s.user);
			res.status(200).json(list.obj(true));
		});
	}
}

function updateList(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.7.3.1"));
		}
		
		list.canEdit(s.user, function(err, b){
			if (err) return next(err);
			if (b){
				var cat = _.pick(req.body.category, 'type', 'place', 'date', 'endDate');
				
				list.name = req.body.name || list.name;
				list.desc = typeof req.body.desc !== 'undefined' ? req.body.desc : list.desc;
				list.fields = _.map(req.body.fields, function(f){
					return new Field(f).obj();
				});
				list.userFields = List.isValidUserFields(req.body.userFields) ? req.body.userFields : list.userFields;
				list.category = cat.type != null ? cat : list.category;
				list.type = req.body.type != null ? req.body.type : list.type;
				list.save();
				res.status(200).json(list.obj(true));
			}
			else return next(findError("CENTRALIST.7.3.2"));
		});
	});
}

function deleteList(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.7.4.1"));
		}
		
		list.canEdit(s.user, function(err, b){
			if (err) return next(err);
			if (b){
				list.removeBis();
				res.sendStatus(200);
			}
			else return next(findError("CENTRALIST.7.4.2"));
		});
	});
}

function exportList (req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.7.5.1"));
		}
		
		list.canEdit(s.user, function(err, b){
			var r = '';
			if (err) return next(err);
			
			if (b){
				r += _.map(_.filter(_.pairs(list.userFields), function(e){ return e[1]; }), function(e){ return e[0];}).join(';');
				_.each(list.fields, function(f, idx){
					r += ';'+f.label;
				});
				r += '\r\n';
				list.userList(function(err, t){
					if (err) return next(err);
					
					async.map(t, function(u, done){
						new User(u.userId,function(err, user){
							var temp = [];
							_.each(_.pairs(list.userFields), function(t){
								if (t[1]) temp.push(u.data['user_'+t[0]] || user[t[0]]);
							});
							_.each(list.fields, function(f, idx){
								temp.push(u.data[f.name]);
							});
							done(null, temp.join(';')+'\r\n');
						});
					}, function(err, t2){
						if (err) return next(err);
						
						r += t2.join('');
						var filename = list.name+'.csv';
						res.attachment(filename);
						res.status(200).send(r);
					});
				});
			}
			else return next(findError("CENTRALIST.7.5.2"));
		})
	});
}

function getStats(req, res, next){
	var s = req.session;
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if(req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.7.6.1"));
		}
		list.isMod(s.user, function(err, b){
			if (err) return next(err);

			if(b){
				list.userList(function(err, t){
					if (err) return next(err);

					if (t.length > 0){
						var datas = _.pluck(t, 'data'),
              fields = _.pluck(list.fields, 'name'),
							r = {};

						for (var i = 0; i<fields.length; i++){
							r[fields[i]] = _.object(_.map(_.pairs(_.groupBy(datas, fields[i])), function(e){
								return [e[0], e[1].length];
							}));
						}

						return res.status(200).json(r);
					}
					else return res.status(200).send({});
				});
			}
			else return next(findError("CENTRALIST.7.6.2"));
		});
	});
}


module.exports.list = {
	getAll : getLists,
	getOne : getList,
	create : createList,
	update : updateList,
	delete : deleteList,
	export : exportList,
	stats  : getStats
};
