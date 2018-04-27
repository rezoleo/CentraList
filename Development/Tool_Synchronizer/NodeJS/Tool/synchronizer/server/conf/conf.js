/* 
 * File 	: ./server/conf/conf.js
 * Author(s)	: Zidmann
 * Function 	: This file defines the different configuration settings
 * Version  	: 1.0.0
 */

var distant     = require('./distant.js'),
    log         = require('./log.js'),
    mongo       = require('./mongo.js');

module.exports = {
	distant     : distant,
	log	    : log,
	mongo       : mongo
}
