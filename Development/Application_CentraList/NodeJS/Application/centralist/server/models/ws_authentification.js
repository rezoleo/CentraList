/* 
 * File 	: ./server/models/ws_authentification.js
 * Author(s)	: Zidmann
 * Function 	: This file defines the model used to call Authentification Service
 * Version  	: 1.0.0
 */

var conf      = require('../conf/distant.js').authentification,
    sha512    = require('toolbox')('HASH').sha512,
    isEmpty   = require('toolbox')('ISEMPTY'),
    ws_client = require('toolbox')('WSCLIENT')({ server_ca   : conf.security.ca,
					         client_cert : conf.security.cert,
					         client_key  : conf.security.key});

function checkFunc(data, callback){
	var final_uri = conf.uri+'/'+data.login;
	if(!isEmpty(conf.token)){
		final_uri+='?token='+conf.token;
	}

	var hash = sha512(data.password, conf.salt);
	ws_client.post({ uri  : final_uri,
			 form : {password : hash}}, callback);
}


module.exports={
	check  : checkFunc
};
