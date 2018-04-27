/* 
 * File 	: ./server/models/ws_people.js
 * Author(s)	: Zidmann
 * Function 	: This file defines the model used to call People Service
 * Version  	: 1.0.0
 */

var conf      = require('../conf/distant.js').people,
    isEmpty   = require('toolbox')('ISEMPTY'),
    ws_client = require('toolbox')('WSCLIENT')({ server_ca   : conf.security.ca,
					         client_cert : conf.security.cert,
					         client_key  : conf.security.key});


function getFunc(callback){
	var final_uri = conf.uri+'/';
	if(!isEmpty(conf.token)){
		final_uri+='?token='+conf.token;
	}
	ws_client.get({ uri : final_uri}, callback);
}


module.exports = {
	get : getFunc
};
