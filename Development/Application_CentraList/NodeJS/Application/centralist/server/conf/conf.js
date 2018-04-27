/* 
 * File 	: ./server/conf/conf.js
 * Author(s)	: Zidmann
 * Function 	: This file defines the different configuration settings
 * Version  	: 1.0.0
 */

var application = require('./application.js'),
    cas         = require('./cas.js'),
    http        = require('./http.js'),
    log         = require('./log.js'),
    mongo       = require('./mongo.js'),
    ssl         = require('./ssl.js');

module.exports = {
	application : application,
	cas         : cas,
	http        : http,
	log	    : log,
	mongo       : mongo,
	ssl	    : ssl
}
