/* 
 * File 	: ./server/utils/synchro.js
 * Author(s)	: Zidmann
 * Function 	: This file defines the function to synchronize the information coming the project Zer0 API with the local database
 * Note		: The user is not removed just updated if it already exists, otherwise lists of users which uses the ID of users would no longer work
 * Version  	: 1.0.0
 */


var	_         = require('underscore'),
	isArray   = require('toolbox')('ISARRAY'),
	isEmpty   = require('toolbox')('ISEMPTY'),
	ws_client = require('../models/ws_people.js');

function synchro(db, callback){
	ws_client.get(function(err, elmt){
				if(err){
					console.log('[-] An error occured during the synchronization\n'+err);
					process.exit(1);
				}
				else{
					if(isArray(elmt)){
						// Remove attributes for all the users in the application database
						db.collection('users').update({}, {$set:{ firstName : null,
											  lastName  : null,
											  mail	    : null,
											  tel	    : null,
											  isAdmin   : false,
											  isEnabled : false,
											  updated   : null}}, {multi : true}, 
							function(){
								var elmt_count = 0;
								var elmt_flag  = (elmt.length==0);

								var insert_or_remove=function(user){
									if(user && user.login){
										elmt_count++;
										db.collection('users').find({login : user.login})
										  .count(function(err, count){
												if(isEmpty(err)){
													// Update the registered users information
													if(count===0){
														elmt_flag = true;
														db.collection('users').insert({ login     : user.login, 
																		firstName : user.firstname,
																		lastName  : user.lastname,
																		mail      : user.mail,
																		tel       : user.tel,
																		isAdmin   : false,
																		isEnabled : true,
																		created   : new Date()}, 
																	       function(err){
																			if(!err){
																				elmt_count--;
																			}
																		});
													}
													// If the login has never been registered in the system the line is added
													else{
														elmt_flag = true;
														db.collection('users').update({login : user.login}, {$set:{ firstName : user.firstname,
																					    lastName  : user.lastname,
																					    mail      : user.mail,
																					    tel       : user.tel,
																					    isAdmin   : false,
																					    isEnabled : true,
																					    updated   : new Date()}}, {multi : true}, 
																		function(err){
																			if(!err){
																				elmt_count--;
																			}
																		});
													}
												}
											});
									}

								}

								// Update or insert one user in the database
								for(var i=0; i<elmt.length; i++){
									insert_or_remove(elmt[i]);
								}

								// Function to check if all the users were updated or inserted and stop the program if it is the case
								var loop_function = function(){
									if(elmt_count===0 && elmt_flag===true){
										process.exit(0);
									}
									setTimeout(loop_function, 1000);
								}
								loop_function();
							});
					}
				}
		      });
}


module.exports = synchro;
