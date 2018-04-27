/* 
 * File 	: ./server/index.js
 * Author(s)	: Zidmann
 * Function 	: This file starts NodeJS server for using the CentraList application synchronizer
 * Version  	: 1.0.0
 */

var	mongo 	= require('mongodb'),
	isEmpty	= require('toolbox')('ISEMPTY'),
	_     	= require('underscore'),

	conf  	= require('./conf/conf.js'),
	synchro = require('./utils/synchro.js');


// Initialize MongoDB connection
mongo.MongoClient.connect(conf.mongo.adress, 
	function(err, client){
		if(!isEmpty(err)){
			console.log('[-] Could not connect to database');
			console.log(err);
			process.exit(1);
		}
		else{
			var db = client.db(conf.mongo.databasename);
			console.log('[+] Established connection to database through mongodb client');

			synchro(db, function(){
				client.close();
			});
		}
	});

