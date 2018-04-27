/* 
 * File 	: ./server/utils/utils.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file contains useful functions
 * Version  	: 1.0.0
 */

var mongo = require('mongodb'),
	sha1 = require('sha1');

module.exports = {
	mongoc : mongo.MongoClient,
	sha1 : sha1,
	ObjectID : mongo.ObjectID
}
