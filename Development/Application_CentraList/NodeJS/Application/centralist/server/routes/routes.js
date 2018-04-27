/*
 * File 	: ./server/routes/routes.js
 * Author(s)	: Zidmann
 * Function 	: This file manages NodeJS server routes for centralist application
 * Version  	: 1.0.0
 */ 

var	_    = require('underscore'),
	ctrl = _.extend({}, require('../controllers/login.js'),
			    require('../controllers/card.js'),
			    require('../controllers/user.js'),
			    require('../controllers/list.js'),
			    require('../controllers/link.js'),
			    require('../controllers/gate.js'),
			    require('../controllers/mods.js'),
			    require('../controllers/request.js'));

var routes = [];
var prefix = '/api';

var prefix_card     = prefix + '/card';
var prefix_login    = prefix + '/login';
var prefix_logout   = prefix + '/logout';
var prefix_users    = prefix + '/users';
var prefix_lists    = prefix + '/lists';
var prefix_links    = prefix + '/lists/:id/links';
var prefix_requests = prefix + '/lists/:id/requests';

//Routes to manage signin, signout in the application
routes.push({method: 'GET',    path: prefix_login, ctrl: ctrl.login.info });
routes.push({method: 'POST',   path: prefix_login, ctrl: ctrl.login.login });
routes.push({method: 'DELETE', path: prefix_login, ctrl: ctrl.login.logout });

routes.push({method: 'GET', path: prefix_logout, ctrl: ctrl.login.logout });

//Routes to add a user in the application
routes.push({method: 'POST', path: prefix_users, ctrl: ctrl.user.add });

//Routes to prevents non-logged-in users from accessing deeper APIs
routes.push({method: 'GET',    path: prefix+'/*', ctrl: ctrl.gate });
routes.push({method: 'POST',   path: prefix+'/*', ctrl: ctrl.gate });
routes.push({method: 'PUT',    path: prefix+'/*', ctrl: ctrl.gate });
routes.push({method: 'DELETE', path: prefix+'/*', ctrl: ctrl.gate });

//Routes to read cards
routes.push({method: 'GET',    path: prefix_card+'/code/:code', ctrl: ctrl.card.getOneCard });

//Routes to manage users
routes.push({method: 'GET',    path: prefix_users+'/', 			  ctrl: ctrl.user.all });
routes.push({method: 'GET',    path: prefix_users+'/find', 		  ctrl: ctrl.user.find });
routes.push({method: 'GET',    path: prefix_users+'/extended', 		  ctrl: ctrl.user.extended });
routes.push({method: 'GET',    path: prefix_users+'/:id', 		  ctrl: ctrl.user.getInfo });
routes.push({method: 'GET',    path: prefix_users+'/login/:login',	  ctrl: ctrl.user.getLoginInfo });
routes.push({method: 'PUT',    path: prefix_users+'/:id', 		  ctrl: ctrl.user.change });
routes.push({method: 'DELETE', path: prefix_users+'/:id', 		  ctrl: ctrl.user.delete });
routes.push({method: 'GET',    path: prefix_users+'/:id/lists', 	  ctrl: ctrl.link.listsOfUser });
routes.push({method: 'GET',    path: prefix_users+'/:id/lists/moderated', ctrl: ctrl.mods.user });
routes.push({method: 'GET',    path: prefix_users+'/:id/requests', 	  ctrl: ctrl.reqs.user });

//Routes to manage list contents
routes.push({method: 'GET',    path: prefix_lists+'/', 			 ctrl: ctrl.list.getAll });
routes.push({method: 'POST',   path: prefix_lists+'/', 			 ctrl: ctrl.list.create });
routes.push({method: 'GET',    path: prefix_lists+'/:id', 		 ctrl: ctrl.list.getOne });
routes.push({method: 'PUT',    path: prefix_lists+'/:id', 		 ctrl: ctrl.list.update });
routes.push({method: 'DELETE', path: prefix_lists+'/:id', 		 ctrl: ctrl.list.delete });
routes.push({method: 'GET',    path: prefix_lists+'/:id/stats', 	 ctrl: ctrl.list.stats });
routes.push({method: 'GET',    path: prefix_lists+'/:id/export/:format', ctrl: ctrl.list.export });

//Routes to manage list links
routes.push({method: 'GET',    path: prefix_links, 		ctrl: ctrl.link.usersOfList });
routes.push({method: 'POST',   path: prefix_links, 		ctrl: ctrl.link.add });
routes.push({method: 'GET',    path: prefix_links+'/:lid', 	ctrl: ctrl.link.getOne });
routes.push({method: 'PUT',    path: prefix_links+'/:lid', 	ctrl: ctrl.link.update });
routes.push({method: 'DELETE', path: prefix_links+'/:lid', 	ctrl: ctrl.link.remove });

//Routes to manage list rights
routes.push({method: 'GET',    path: prefix_lists+'/:id/mods', 	ctrl: ctrl.mods.get });
routes.push({method: 'PUT',    path: prefix_lists+'/:id/mods', 	ctrl: ctrl.mods.update });

//Routes to manage list requests
routes.push({method: 'GET',    path: prefix_requests, 			ctrl: ctrl.reqs.list });
routes.push({method: 'POST',   path: prefix_requests, 			ctrl: ctrl.reqs.add });
routes.push({method: 'GET',    path: prefix_requests+'/:rid', 		ctrl: ctrl.reqs.getOne });
routes.push({method: 'PUT',    path: prefix_requests+'/:rid', 		ctrl: ctrl.reqs.update });
routes.push({method: 'DELETE', path: prefix_requests+'/:rid', 		ctrl: ctrl.reqs.decline });
routes.push({method: 'GET',    path: prefix_requests+'/:rid/accept', 	ctrl: ctrl.reqs.accept });
routes.push({method: 'GET',    path: prefix_requests+'/:rid/decline', 	ctrl: ctrl.reqs.decline });


module.exports = routes;
