/* 
 * File 	: ./server/conf/cas.js
 * Author(s)	: Zidmann
 * Function 	: This file defines the CAS settings
 * Version  	: 1.0.0
 */

module.exports = {
	casHost		: "cas.ec-lille.fr",
	casPath		: "/",
	ssl		: true,
	port		: 443,
	service		: "http://localhost:9102/api/cas",
	sessionName	: "cas_user",
	renew		: false,
	gateway		: false,
	redirectUrl	: 'http://localhost:3333',
	connectedURL	: 'http://localhost:3333/#/home',
	createUserUrl	: 'http://localhost:3333/#/user/create'
}
