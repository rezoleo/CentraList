/* 
 * File 	: ./server/models/objectdb.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the model of one element in the database
 * Version  	: 1.0.0
 */

var findError = require('../errors/referential.js');

function ObjectDB (name, col){
	this.loaded = false;
	this.odb = {
		col  : col,
		name : name
	};
}

ObjectDB.prototype.fetch = function(callback){
	var obj = this;
	this.loaded = false;
	if (!this.id && callback) return callback(findError("CENTRALIST.3.1.1"));
	db.collection(obj.odb.col).find({_id : obj.id}).toArray(function(err, t){
		if (err && callback) callback(err);
		if (t.length > 0){
			obj.fromObj(t[0]);
			obj.loaded = true;
		}
		if (callback) callback(err, obj);
	});
};

ObjectDB.prototype.save = function(callback){
	var c = db.collection(this.odb.col),
	obj = this;
	if (obj.loaded){ //Update
		obj.updated = new Date();
		c.update({_id:obj.id},{$set:obj.obj()}, {w : 0}, function(err, res){
			if (callback) callback(err);
		});
	}
	else { //Insert
		c.insert(obj.obj(), {w : 0}, function(err, res){
			obj.id = res[0]._id;
			if (callback) callback(err);
		});
	}
};

ObjectDB.prototype.remove = function(){
	db.collection(this.odb.col).remove({_id : this.id}, {w : 0});
};


module.exports = ObjectDB;
