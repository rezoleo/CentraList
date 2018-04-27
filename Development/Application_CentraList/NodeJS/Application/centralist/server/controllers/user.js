/* 
 * File 	: ./server/controllers/user.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the controller used to manage the users
 * Version  	: 1.0.0
 */

var 	User      = require('../models/user.js'),
	findError = require('../errors/referential.js'),
	_         = require('underscore'),
	u         = require('../utils/utils.js'),
	async     = require('async');

function getUserInfos(req, res, next){
	var s = req.session;
	new User(req.params.id, function(err, user){
		if (err) return next(err);
		
		if (user.loaded){
			res.status(200).json(_.omit(user.obj(true), 'pass', 'isAdmin', 'created', 'updated'));
		}
		else next(findError("CENTRALIST.11.1.1"));
	});
}

function addUser(req, res, next){
	var user = new User();
  // force CAS login
  req.body.login = req.session.cas_user;
	if (req.body.login == null || req.body.pass == null || req.body.firstName == null || req.body.lastName == null || req.body.mail == null)
	{
		return next(findError("CENTRALIST.11.3.1"));
	}
	
	user.login = req.body.login;
	user.setPassword(req.body.pass);
	user.setMail(req.body.mail);
	user.firstName = req.body.firstName;
	user.lastName = req.body.lastName;
	user.setTel(req.body.tel);
	
	user.check(null, function(err, b){
		if (err) return next(err);
		
		if (b){
			user.save(function(err){
				if (err) return next(err);
				
				user.check(null, function(err, b){
					if (err) return next(err);
					if (b) return next(findError("CENTRALIST.11.3.2"));
					res.status(200).json(_.omit(user.obj(), 'pass'));
				});
			});
		}
		else {
			return next(findError("CENTRALIST.11.3.3"));
		}
	});
}

function changeUser(req, res, next){
	var s = req.session;
	if (req.body.pass == null && req.body.mail == null && req.body.tel == null)
	{
		return next(findError("CENTRALIST.11.4.1"));
	}
	
	new User(req.params.id, function(err, target){
		if (err) return next(err);
		if (req.params.id == null || target.firstName == null){
			return next(findError("CENTRALIST.11.4.2"));
		}
		
		if (s.user.id.equals(target.id) || s.user.isAdmin){
			target.setPassword(req.body.pass);
			target.setMail(req.body.mail);
			target.setTel(req.body.tel);
			target.save(function(err){
				if (err) return next(err);
				res.sendStatus(200);
			});
		}
		else return next(findError("CENTRALIST.11.4.3"));
	});
}

function delUser(req, res, next){
	var s = req.session;
	
	new User(req.params.id, function(err, target){
		if (err) return next(err);
		if (req.params.id == null || target.firstName == null){
			return next(findError("CENTRALIST.11.5.1"));
		}
		
		if (s.user.id.equals(target.id) || s.user.isAdmin){
			target.remove();
			res.sendStatus(200);
		}
		else return next(findError("CENTRALIST.11.5.2"));
	});
}

function getAll (req, res, next){
	var s = req.session;
	
	User.getFromDb(function(err, t){
		if (err) return next(err);
		var t = _.map(t, function(u){
			return _.omit(u.obj(true), 'pass');
		});
		res.status(200).json(t);
	});
}

function getOneLogin(req, res, next){
	User.getLoginFromDb(req.params.login, function(err, user){
		if (err) return next(err);
		else if (user){
			res.status(200).json(_.omit(user, 'pass', 'isAdmin', 'created', 'updated'));
		}
		else next(findError("CENTRALIST.11.2.1"));
	});
}

function findUsers (req, res, next){
	var s = req.session;
	
	if (req.query.q == null) return getAll(req, res, next);
	
	User.getFromDb(function(err, t){
		var words = req.query.q.split(' '),
			union = [], // More results
			inter = t, // More precise results
			result = [];
		
		if (err) return next(err);
		
		_.each(words, function(w, i){
			var re = new RegExp(w, 'i');
			var temp = _.filter(t, function(u){
				return re.test(u.login) || re.test(u.firstName) || re.test(u.lastName);
			});
			union = _.union(union, temp);
			inter = _.intersection(inter, temp);
		});
		result = _.union(inter, union); // More precise results go first and then we complete with all the others.
		result = _.map(result, function(u){
			return _.omit(u.obj(true), 'pass');
		});
		res.status(200).json(result.slice(0,20)); // Only 20 results
	});
}

function extended (req, res, next){
	var s = req.session;
	
	async.parallel([
		function(done){ //Getting users from db
			User.getFromDb(function(err, t){
				if (err) return done(err);
				t = _.map(t, function(u){
					return _.omit(u.obj(true), 'pass');
				});
				done(null, t);
			});
		},
		function(done){ //Getting suggests from db
			db.collection('suggest').find({}, { _id : 0, login : 1, firstName : 1, lastName : 1, mail : 1 }).toArray(function(err, t2){
				if (err) return done(err);
				done(null, t2);
			});
		}
	], function(err, t){ // Then merging the two
		if (err) return next(err);
		users = t[0];
		suggests = t[1];
		var logins = _.pluck(users, 'login');
		suggests = _.filter(suggests, function(e){
			return !_.contains(logins, e.login)
		});
		t = _.union(users, suggests);

		res.status(200).send(t);
	});
}


module.exports.user = {
	getInfo       : getUserInfos,
	getLoginInfo  : getOneLogin,
	add           : addUser,
	change        : changeUser,
	delete        : delUser,
	all           : getAll,
	find          : findUsers,
	extended      : extended
}
