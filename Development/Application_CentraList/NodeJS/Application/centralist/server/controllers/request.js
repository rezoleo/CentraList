/* 
 * File 	: ./server/controllers/request.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the controller used to manage the requests of the lists
 * Version  	: 1.0.0
 */

var	User      = require('../models/user.js'),
	List      = require('../models/list.js'),
	findError = require('../errors/referential.js'),
	u         = require('../utils/utils.js'),
	_         = require('underscore');

function reqsOfUser(req, res, next){
	var s = req.session;
	
	new User(req.params.id, function(err, user){
		if(err) return next(err);
		if(req.params.id == null || user.firstName == null){
			return next(findError("CENTRALIST.10.1.1"));
		}
		
		if(s.user.isAdmin || s.user.id.equals(user.id)){
			user.getRequests(function(err, t){
				if(err) return next(err);
				
				res.status(200).json(t);
			});
		}
		else return next(findError("CENTRALIST.10.1.2"));
	});
}

function reqsOfList(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if(err) return next(err);
		if(req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.10.2.1"));
		}
		
		list.canEdit(s.user, function(err, b){
			if(err) return next(err);
			if(b){
				list.getRequests(function(err, t){
					if(err) return next(err);
					
					res.status(200).json(t);
				});
			}
			else return next(findError("CENTRALIST.10.2.2"));
		});
	});
}

function addRequest(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if(err) return next(err);
		if(req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.10.3.1"));
		}
		
		new User(req.body.userId, function(err, user){
			if(err) return next(err);
			if(req.body.userId == null || user.firstName == null){
				return next(findError("CENTRALIST.10.3.2"));
			}
			
			list.canRequest(user, function(err, b){
				if(!b){
					if(s.user.id.equals(user.id))
					{
						if(list.isValidData(req.body.data)){
							list.getRequests(function(err, t){
								if(err) return next(err);
								t = _.filter(t, function(r){
									return r.userId == user.id.toHexString();
								});
								if(t.length == 0){
									list.addRequest(user, req.body.data);
									res.sendStatus(200);
								}
								else return next(findError("CENTRALIST.10.3.3"));
							});
						}
						else return next(findError("CENTRALIST.10.3.4"));
					}
					else return next(findError("CENTRALIST.10.3.5"));
				}
				else return next(findError("CENTRALIST.10.3.6"));
			});
		});
	});
}

function oneRequest(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if(err) return next(err);
		if(req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.10.4.1"));
		}
		
		list.getRequest(req.params.rid, function(err, request){
			if(err) return next(err);
			
			if(request){
				list.canEdit(s.user, function(err, b){
					if(b || s.user.id.equals(new u.ObjectID(request.userId.toString()))){
						res.status(200).json(request);
					}
					else return next(findError("CENTRALIST.10.4.2"));
				});
			}
			else return next(findError("CENTRALIST.10.4.3"));
		});
	});
}

function changeRequest(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if(err) return next(err);
		if(req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.10.5.1"));
		}
		if(!list.isValidData(req.body.data)) return next(findError("CENTRALIST.10.5.2"));
		
		list.getRequest(req.params.rid, function(err, request){
			if(err) return next(err);
			
			if(request){
				list.canEdit(s.user, function(err, b){
					if(err) return next(err);
					if(b || s.user.id.equals(new u.ObjectID(request.userId.toString()))){
						list.changeRequest(request._id, req.body.data);
						res.sendStatus(200);
					}
					else return next(findError("CENTRALIST.10.5.3"));
				});
			}
			else return next(findError("CENTRALIST.10.5.4"));
		});
	});
}

function declineRequest(req, res, next){
var s = req.session;
	
	new List(req.params.id, function(err, list){
		if(err) return next(err);
		if(req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.10.6.1"));
		}
		
		list.getRequest(req.params.rid, function(err, request){
			if(err) return next(err);
			
			if(request){
				list.canEdit(s.user, function(err, b){
					if(err) return next(err);
					if(b || s.user.id.equals(new u.ObjectID(request.userId.toString()))){
						list.declineRequest(request._id);
						res.sendStatus(200);
					}
					else return next(findError("CENTRALIST.10.6.2"));
				});
			}
			else return next(findError("CENTRALIST.10.6.3"));
		});
	});
}

function acceptRequest(req, res, next){
	var s = req.session;
		
		new List(req.params.id, function(err, list){
			if(err) return next(err);
			if(req.params.id == null || list.name == null){
				return next(findError("CENTRALIST.10.7.1"));
			}
			
			list.getRequest(req.params.rid, function(err, request){
				if(err) return next(err);
				
				if(request){
					list.canEdit(s.user, function(err, b){
						if(err) return next(err);
						if(b){
							list.acceptRequest(request._id);
							res.sendStatus(200);
						}
						else return next(findError("CENTRALIST.10.7.2"));
					});
				}
				else return next(findError("CENTRALIST.10.7.3"));
			});
		});
	}


module.exports.reqs = {
	user    : reqsOfUser,
	list    : reqsOfList,
	add     : addRequest,
	getOne  : oneRequest,
	update  : changeRequest,
	decline : declineRequest,
	accept  : acceptRequest
};
