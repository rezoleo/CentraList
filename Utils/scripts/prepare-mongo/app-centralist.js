/* 
 * File 	: ./scripts/prepare-mongo/app-centralist.js
 * Author(s)	: Zidmann
 * Function 	: This file determines which data to put inside the CentraList mongo database for Unit Test
 * Version  	: 1.0.0
 * Note		: To run the script : mongo Application_CentraList app-centralist.js
 */

// Remove the objects
db.lists.remove({})
db.lists.mods.remove({})
db.lists.users.remove({})
db.sessions.remove({})
db.suggest.remove({})
db.users.remove({})

