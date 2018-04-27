/* 
 * File 	: ./server/models/users.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the model of one user
 * Version  	: 1.0.0
 */

var 	u        = require('../utils/utils.js'),
	List     = require('./list.js'),
	ObjectDB = require('./objectdb.js'),
	_        = require('underscore'),
	async    = require('async');

function User(id, callback, obj){
	// User properties
	id = (typeof id === 'string' && id.length == 24) ? u.ObjectID(id) : id;

	this.id        = id;
	this.login     = null;
	this.pass      = null; // encrypted
	this.firstName = null;
	this.lastName  = null;
	this.mail      = null;
	this.tel       = null;
	this.isAdmin   = false;
	this.isEnabled = true;
	this.created   = new Date();
	this.updated   = null;

	// Object properties
	this.loaded = false;

	if (obj){
		this.fromObj(obj);
		this.loaded = true;
	}

	if (id != null && !this.loaded) this.fetch(callback);
	else if (callback) callback(null, this);
};

User.prototype = new ObjectDB('User', 'users');

User.getFromDb = function(callback){
	var t = null;
	db.collection('users').find({}).toArray(function(err, t){
		async.map(t, function(e, done){
			new User(e._id, done, e);
		}, callback);
	});
}

User.getLoginFromDb = function(login, callback){
	var user = this;
	db.collection('users').findOne({login : login}, callback);
}

User.prototype.toString = function(){
	return this.login;
};

User.prototype.fromObj = function(obj){
	this.login     = obj.login;
	this.pass      = obj.pass;
	this.firstName = obj.firstName;
	this.lastName  = obj.lastName;
	this.mail      = obj.mail;
	this.tel       = obj.tel;
	this.isAdmin   = obj.isAdmin;
	this.created   = obj.created;
	this.updated   = obj.updated;
};

/* obj : returns the javascript object corresponding to the user
*/
User.prototype.obj = function(id){
	var o = {
		login     : this.login,
		pass      : this.pass,
		firstName : this.firstName,
		lastName  : this.lastName,
		mail      : this.mail,
		tel       : this.tel,
		isAdmin   : this.isAdmin,
		created   : this.created,
		updated   : this.updated
	};
	if (id) o.id = this.id;
	return o;
};

User.prototype.remove = function(){
	var user = this;
	user.remove();
	db.collection('lists.users').remove({ userId : user.id }, {w : 0});
	db.collection('lists.mods').remove({ userId : user.id }, {w : 0});
}

/* setPassword : change the password using the encryption algorythm
* @param pass : new password
*/
User.prototype.setPassword = function(pass){
	if (pass) this.pass = u.sha1(pass);
};

User.prototype.setMail = function(mail){
	var re = new RegExp('^[_a-zA-Z0-9+-]+[_.a-zA-Z0-9+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$');
	if (re.test(mail)){
		this.mail = mail;
		return true;
	}
	return false;
};

User.prototype.setTel = function(tel){
	var re = new RegExp('^((0|(\\+[0-9]{0,3}[-. ]?))[1-689]([-. ]?[0-9]{2}){4})?$');
	if (re.test(tel)){
		this.tel = tel;
		return true;
	}
	return false;
};

/* check : checks the availability of the parameters in the db
* @param champ : name of the field to check
*/
User.prototype.check = function(champ, callback){
	champ = champ || 'login';
	var c = _.pick(this.obj(), champ);
	db.collection('users').find(c).count(function(err, count){
		callback(err, count==0);
	});
};

User.prototype.getLists = function(callback){
	var user = this;
	db.collection('lists.users').find({userId : user.id}, {listId : 1, created : 1, updated : 1}).toArray(function(err, t){
		async.map(t, function(e, done){
			new List(e.listId, done);
		}, callback);
	});
};

User.prototype.getModdedLists = function(callback){
	var user = this;
	db.collection('lists.mods').find({userId : user.id}).toArray(function(err, t){
		async.map(t, function(e, done){
			new List(e.listId, done);
		}, callback);
	});
};

User.prototype.getRequests = function(callback){
	var user = this;
	db.collection('lists.requests').find({userId : user.id}).toArray(callback);
};


module.exports = User;
