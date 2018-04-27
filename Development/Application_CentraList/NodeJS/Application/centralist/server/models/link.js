/* 
 * File 	: ./server/models/link.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the model of one link of one list
 * Version  	: 1.0.0
 */

var 	u 	  = require('../utils/utils.js'),
	_ 	  = require('underscore'),
	findError = require('../errors/referential.js'),
	async	  = require('async'),
	User	  = require('./user.js'),
	ObjectDB  = require('./objectdb.js');

function Link(id, callback, obj){
	id = (typeof id === 'string' && id.length == 24) ? u.ObjectID(id) : id;

	this.id      = id || null;
	this.userId  = null;
	this.listId  = null;
	this.data    = [];
	this.checkIn = null;
	this.created = new Date();
	this.updated = null;

	this.loaded = false;

	if (obj){
		this.fromObj(obj);
		this.loaded = true;
	}

	if (id != null && !this.loaded) this.fetch(callback);
	else if (callback) callback(null, this);
};

Link.ofList = function(list, callback){
	db.collection('lists.users').find({ listId : list.id }).toArray(function(err,t){
		if (err) callback(err);
		async.map(t, function(e, done){
			new Link(e._id, done, e);
		}, callback);
	});
};

Link.prototype = new ObjectDB('Link', 'lists.users');

Link.prototype.fromObj = function(obj){
	this.userId   = obj.userId;
	this.listId   = obj.listId;
	this.data     = obj.data;
	this.checkIn  = obj.checkIn;
	this.userData = obj.userData;
	this.created  = obj.created;
	this.updated  = obj.updated;
};

Link.prototype.obj = function(id){
	var o = {
		userId  : this.userId,
		listId  : this.listId,
		data    : this.data,
		checkIn : this.checkIn,
		created : this.created,
		updated : this.updated
	};
	if (id) o.id = this.id;
	return o;
};

Link.prototype.getCheckin = function(callback){
	var link = this;
	if (!this.userId){
		var user = new User();
		user.login = this.data.user_login;
		callback(null, link.obj(true));
	}
	else new User(this.userId, function(err, user){
		if (err) return callback(err);
		if (!user.loaded) return next(findError("CENTRALIST.1.1.1"));

		var o = _.extend(link.obj(true));
		o.data = _.extend(o.data, {
			user_login     : user.login,
			user_firstName : user.firstName,
			user_lastName  : user.lastName
		});
		callback(null, o);
	});
}

Link.prototype.getUser = function(callback){
	new User(this.userId, callback);
};

Link.prototype.ofList = function(list){
	return this.listId.equals(list.id);
}


module.exports = Link;
