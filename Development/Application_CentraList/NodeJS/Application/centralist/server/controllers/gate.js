/* 
 * File 	: ./server/controllers/gate.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the controller used to manage gate
 * Version  	: 1.0.0
 */

var	User      = require('../models/user.js'),
	findError = require('../errors/referential.js');

function lock(req, res, next){
	new User(req.session.userId, function(err, user){
		if (err) return next(err);
		if (!req.session.logged || req.session.userId == null || user.firstName == null){ // You need to be logged-in !
			return next(findError("CENTRALIST.5.1.1"));
		}
		else {
			req.session.user = user;
			next();
		}
	});
}


module.exports.gate = lock;
