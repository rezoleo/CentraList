/* 
 * File 	: ./server/controllers/login.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the controller used to connect or disconnect the user to the application
 * Version  	: 1.0.0
 */

var 	findError    = require('../errors/referential.js'),
	User         = require('../models/user.js'),
	ws_client    = require('../models/ws_authentification'),
	conf         = require('../conf/conf.js'),
	session_info = require('toolbox')('SESSION_INFO'),
	u            = require('../utils/utils.js'),
	isEmpty	     = require('toolbox')('ISEMPTY'),
	_            = require('underscore');

/** Return login info */
function info(req, res, next){
	var s = req.session,
		result = {};
	
	var end = function(){
		db.collection('suggest').find({login : result.cas_user}).toArray(function(err, t){
			if (err) return next(err);
	    		
			if (t.length > 0) result.suggest = {
					firstName : t[0].firstName,
	    			lastName : t[0].lastName,
	    			mail : t[0].mail
			};
			res.status(200).json(result);
		});
	};
	
	if (s.logged){
		new User(s.userId, function(err, user){
			if (err) return next(err);
		    result = _.omit(user.obj(true), 'pass')
		    result.cas_user = s.cas_user;
		    end();
		});
	}
	else {
		result = {id: null, cas_user: s.cas_user};
		end();
	}
}

/** Login */
function login(req, res, next){
	//read session
	var s = req.session;
	//Check request validity
	if (req.body.login == null || req.body.pass == null){
		return next(findError("CENTRALIST.8.1.1"));
	}
	ws_client.check({login    : req.body.login,
			 password : req.body.pass},
			function(err, elmt){
				if(err){
					return next(err);
				}
				// if incorrect
				else if(isEmpty(elmt)){
					return next(findError("CENTRALIST.8.1.2"));
				}
				// if correct return login info
				else{
					r = db.collection('users').find({login: elmt.login, isEnabled: true});
					r.count(function (err2, count2){
						if (err2) return next(err2);
						if (count2==0) return next(findError("CENTRALIST.8.1.3"));

						// if exists
						r.nextObject(function (err3, doc3){
							session_info.setLogin(req, elmt.login);
							session_info.setGate(req, 'classical');
							session_info.setRoles(req, []);

							s.logged = true;
							s.userId = doc3._id;

							return info(req, res);
						});
					});
				}
			 });
}

/** Logout user: remove session's information */
function logout(req, res, next){
	var s = req.session,
		cas,
    login = s.user ? s.user.login : null;

  if (s.logged)
	{
		// Resets params mode
		s.logged = false;
		s.user = null;
	}
	if(s.cas_user){
		delete s.cas_user;
		cas = [conf.cas.ssl === true ? 'https' : 'http', '://', conf.cas.casHost, ':', conf.cas.port, conf.cas.casPath, '/logout'].join('');
		if(req.method == 'GET'){
			return res.redirect(cas);
		}
	}
	//ajax requests are in a sandbox
	res.status(200).json({id: null, redirect: cas});
}

function cas(req, res, next){
	// Connected with cas, login in req.session.cas_user
	//connect to mongo
	var s = req.session,
		r = db.collection('users').find({login: s.cas_user}, {_id : 1, firstName: 1, lastName: 1});
	
	r.count(function (err, count){
		if (err) return next(err);
		if (count != 1) return res.redirect(conf.cas.createUserUrl);
		
		// if exists
		r.nextObject(function (err, doc){
      s.logged = true;
      s.userId = doc._id;
      res.redirect(conf.http.rootUrl);
    });
	});
}


module.exports.login = {
	cas    : cas,
	info   : info,
	login  : login,
	logout : logout
};
