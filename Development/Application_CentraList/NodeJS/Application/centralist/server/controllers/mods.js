/* 
 * File 	: ./server/controllers/mods.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the controller used to manage the moderators of the lists
 * Version  	: 1.0.0
 */

var 	User      = require('../models/user.js'),
	List      = require('../models/list.js'),
	findError = require('../errors/referential.js'),
	_         = require('underscore'),
	async     = require('async');

function getListMods(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.9.1.1"));
		}
		
		list.canSee(s.user, function(err, b){
			if (err) return next(err);
			if (b){
				list.modsList(function(err, t){
					if (err) return next(err);
					res.status(200).send(t);
				});
			}
			else return next(findError("CENTRALIST.9.1.2"));
		});
	});
}

function updateListMods(req, res, next){
	var s = req.session;
	
	new List(req.params.id, function(err, list){
		if (err) return next(err);
		if (req.params.id == null || list.name == null){
			return next(findError("CENTRALIST.9.2.1"));
		}
		
		list.canEdit(s.user, function(err, b){
			if (err) return next(err);
			if (!b) return next(findError("CENTRALIST.9.2.2"));
			if (!req.body.length > 0) return next(findError("CENTRALIST.9.2.3"));
			
			async.map(req.body, function(u, done){
				new User(u.id, done);
			}, function(err, result){
				if (err) return next(err);
				var t = _.filter(result, function(user){
					return user.loaded;
				});
				list.setMods(t);
				res.sendStatus(200);
			});
		});
	});
}

function listsOfUser (req, res, next){
	var s = req.session;
	new User(req.params.id, function(err, user){
		if (err) return next(err);
		
		user.getModdedLists(function(err, t){
			if (err) return next(err);
			var a = [];
			
			async.each(t, function(list, done){
				if (!list.loaded) return next(findError("CENTRALIST.9.3.1"));
				list.canSee(s.user, function(err, b, list){
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


module.exports.mods = {
	get    : getListMods,
	user   : listsOfUser,
	update : updateListMods
}
