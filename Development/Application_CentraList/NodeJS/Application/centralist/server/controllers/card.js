/* 
 * File 	: ./server/controllers/card.js
 * Author(s)	: Zidmann
 * Function 	: This file defines the controller used to manage cards stored in the Card service
 * Version  	: 1.0.0
 */

var	_            = require('underscore'),
	isEmpty	     = require('toolbox')('ISEMPTY'),
	session_info = require('toolbox')('SESSION_INFO'),
	ws_client    = require('../models/ws_card.js');

function getOneCardFunc(req, res, next){
	ws_client.getOneCard({ code : req.params.code },
			     function(err, elmt){
					if(err){
						return next(err);
					}
					else{
						res.status(200).json(elmt);
					}
		  	     });
}


module.exports.card = {
	getOneCard : getOneCardFunc
};
