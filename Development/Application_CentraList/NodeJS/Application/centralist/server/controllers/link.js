/* 
 * File 	: ./server/controllers/link.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the controller used to manage the links in the lists
 * Version  	: 1.0.0
 */

var 	User      = require('../models/user.js'),
	List      = require('../models/list.js'),
	Link      = require('../models/link.js'),
	findError = require('../errors/referential.js'),
	_         = require('underscore'),
	async     = require('async');

function getUsers (req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.6.1.1"));
		}
		
		list.canSeeLinks(s.user, function(err, b){
			if (err) return next(err);
			
			if (b){
				list.userList(function(err, r){
					if (err) return next(err);
					r.reverse();
					res.status(200).json(r);
				});
			}
			else return next(findError("CENTRALIST.6.1.2"));
		});
	});
}

// Registers a user to a list
function regUser(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.6.2.1"));
		}
		
		if (req.body.userId){
			new User(req.body.userId, function(err, user){
				if (err) return next(err);
				if (req.body.userId == null || user.firstName == null){
					return next(findError("CENTRALIST.6.2.2"));
				}
				
				list.isMember(user, function(err, b){
					if (err) return next(err);
					if (b) return next(findError("CENTRALIST.6.2.3"));
					
					list.canEdit(s.user, function(err, b){
						if (err) return next(err);
						list.canJoin(user, function(err, b2){
							if (!((s.user.id.equals(user.id) && b2) || b)) return next(findError("CENTRALIST.6.2.4"));
							if (!list.isValidData(req.body.data)) return next(findError("CENTRALIST.6.2.5"));
							
							list.addUser(user, req.body.data, function(err){
								if(err) return next(err);
								res.sendStatus(201);
							});
						});
					});
				});
			});
		}
		else {
			list.canEdit(s.user, function(err, b){
				if (err) return next(err);
				if (!b) return next(findError("CENTRALIST.6.2.6"));
				if (!list.isValidData(req.body.data)) return next(findError("CENTRALIST.6.2.7"));
				
				var link = new Link();
				link.listId = list.id;
				link.data = req.body.data;
				link.save();
				res.sendStatus(201);
			});
		}
	});
}

function getUserLists(req, res, next){
	var s = req.session;
	
	new User(req.params.id, function(err, user){
		if (err) return next(err);
		if (req.params.id == null || user.firstName == null){
			return next(findError("CENTRALIST.6.3.1"));
		}
		
		user.getLists(function(err, t){
			var a = [];
			if (err) return next(err);
			
			async.each(t, function(list, done){
				if (!list.loaded) return next(findError("CENTRALIST.6.3.2"));
				list.canSee(s.user, function(err, b, list){
					if (err) return next(err);
					if (b){
						a.push(list.obj(true));
					}
					done(err);
				});
			}, function(err){
				if (err) return next(err);
				res.status(200).json(a);
			});
		});
	});
}

function getOne(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (!list.loaded) return next(findError("CENTRALIST.6.4.1"));
		
		list.canSeeLinks(s.user, function(err, b){
			if (!b) return next(findError("CENTRALIST.6.4.2"));
			
			new Link(req.params.lid, function(err, link){
				if (err) return next(err);
				if (!link.loaded) return next(findError("CENTRALIST.6.4.3"));
				if (!link.ofList(list)) return next(findError("CENTRALIST.6.4.4"));
				
				if (link.userId){
					link.getUser(function(err, user){
						if (err) return next(err);
						res.status(200).json(link.obj(true));
					});
				}
				else {
					res.status(200).json(link.obj(true));
				}
			});
		});
	});
}

function update(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return ext(err);
		if (!list.loaded){
			return next(findError("CENTRALIST.6.5.1"));
		}
		if (!list.isValidData(req.body.data)) return next(findError("CENTRALIST.6.5.2"));
		
		new Link(req.params.lid, function(err, link){
			if (err) return next(err);
			if (!link.loaded) return next(findError("CENTRALIST.6.5.3"));
			if (!link.ofList(list)) return next(findError("CENTRALIST.6.5.4"));
			
			list.canEdit(s.user, function(err, b){
				if (err) return next(err);
				
				if (link.userId){
					link.getUser(function(err, user){
						if (err) return next(err);
						if (!((s.user.id.equals(user.id)) || b)) return next(findError("CENTRALIST.6.5.5"));
						
						link.data = req.body.data;
						link.save();
						res.sendStatus(201);
					});
				}
				else {
					if (!b) return next(findError("CENTRALIST.6.5.6"));
					
					link.data = req.body.data;
					link.save();
					res.sendStatus(201);
				}
			});
		});
	});
}

function remove(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (!list.loaded) return next(findError("CENTRALIST.6.6.1"));
		
		new Link(req.params.lid, function(err, link){
			if (err) return next(err);
			if (!link.loaded) return next(findError("CENTRALIST.6.6.2"));
			if (!link.ofList(list)) return next(findError("CENTRALIST.6.6.3"));
			
			list.canEdit(s.user, function(err, b){
				if (err) return next(err);
				
				if (link.userId){
					link.getUser(function(err, user){
						if (err) return next(err);
						if (!((s.user.id.equals(user.id)) || b)) return next(findError("CENTRALIST.6.6.4"));

						link.remove();
						res.sendStatus(200);
					});
				}
				else {
					if (!b) return next(findError("CENTRALIST.6.6.5"));
					
					link.remove();
					res.sendStatus(200);
				}
			});
		});
	});
}


module.exports.link = {
	usersOfList : getUsers,
	add         : regUser,
	listsOfUser : getUserLists,
	getOne      : getOne,
	update      : update,
	remove      : remove
};
