/* 
 * File 	: ./server/index.js
 * Author(s)	: Zidmann
 * Function 	: This file starts NodeJS server for using the centralist application
 * Version  	: 1.0.0
 */

var	mongoose= require('mongoose'),
	server	= require('applicationcore')('HTTPS')(mongoose),

	cas	= require('grand_master_cas'),
	_	= require('underscore'),

	conf	= require('./conf/conf.js'),
	routes  = require('./routes/routes.js');

// Load controller
var ctrl = _.extend({}, require('./controllers/login.js'));


// Initialize MongoDB connection
db = null;
require('mongodb').MongoClient.connect(conf.mongo.adress+conf.mongo.databasename, function(err, myDb){
	if (err){
		console.log('[-] Could not connect to database');
		process.exit(1);
	}
	else{
		db = myDb;
		console.log('[+] Established connection to database through mongodb client');
	}
});


// Defining the NodeJS server settings
var app = server.setup(conf, routes);

// Manage the CAS connection
cas.configure(conf.cas);
app.get('/api/cas', cas.bouncer, ctrl.login.cas);

// Starting NodeJS server
server.start(app);
