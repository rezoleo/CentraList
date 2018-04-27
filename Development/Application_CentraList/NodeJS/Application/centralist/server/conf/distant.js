/* 
 * File 	: ./server/conf/distant.js
 * Author(s)	: Zidmann
 * Function 	: This file defines the distant paths to call the different webservices
 * Version  	: 1.0.0
 */

var security_provider= { ca   : 'certificates/distant/server-cert-provider.pem',
			 cert : 'certificates/server-cert.pem',
			 key  : 'certificates/server-key.pem'};


module.exports = {
	authentification : { uri      : 'https://localhost:8301/api/authentification',
			     salt     : 'ssd~jsd16fèzejzojié"çè)"èefgsfgo&jp^51fgsg3sqgrh"f',
			     security : security_provider,
			     token    : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb3VyY2VfaXAiOiIxMjcuMC4wLjEiLCJzb3VyY2Vfc2VydmljZSI6Ikp1bml0VGVzdHMiLCJkZXN0X3NlcnZpY2UiOiJTZXJ2aWNlX1Byb3ZpZGVyIiwiZW5kX2RhdGUiOiIyMDE3LTAxLTE1VDIzOjEwOjM4LjQxOFoiLCJhY2Nlc3MiOlsiR0VUQXV0aCIsIlBPU1RBdXRoTG9naW4iLCJHRVRDYXJkIiwiR0VUQ2FyZElkIiwiR0VUQ2FyZENvZGUiLCJHRVRDb250cmlidXRvciIsIkdFVENvbnRyaWJ1dG9ySWQiLCJHRVRDb250cmlidXRvckxvZ2luIiwiR0VUUGVvcGxlIiwiR0VUUGVvcGxlSWQiLCJHRVRQZW9wbGVMb2dpbiIsIkdFVFBlb3BsZU1haWwiLCJHRVRQaWN0dXJlIiwiR0VUR3JvdXAiLCJHRVRHcm91cElkIiwiR0VUR3JvdXBOYW1lIiwiR0VUR3JvdXBTZWFyY2giXSwiZXh0cmEiOnsicmVhZCI6WyJKdW5pdFRlc3RzIiwiZGlyZWN0b3J5IiwiZGlyZWN0b3J5w6kiLCJkaXJlY3RvcnnDoCIsImRpcmVjdG9yeSYiLCJkaXJlY3RvcnkrIiwiZGlyZWN0b3J5PSIsImRpcmVjdG9yeToiLCJkaXJlY3RvcnkoIiwiZGlyZWN0b3J5JTIwIl19fQ.e2uZvzqcR866iX7FZik1th4z_MfzdNTg78riXhBo7UA' },
	card             : { uri      : 'https://localhost:8301/api/card',
			     security : security_provider,
			     token    : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb3VyY2VfaXAiOiIxMjcuMC4wLjEiLCJzb3VyY2Vfc2VydmljZSI6Ikp1bml0VGVzdHMiLCJkZXN0X3NlcnZpY2UiOiJTZXJ2aWNlX1Byb3ZpZGVyIiwiZW5kX2RhdGUiOiIyMDE3LTAxLTE1VDIzOjEwOjM4LjQxOFoiLCJhY2Nlc3MiOlsiR0VUQXV0aCIsIlBPU1RBdXRoTG9naW4iLCJHRVRDYXJkIiwiR0VUQ2FyZElkIiwiR0VUQ2FyZENvZGUiLCJHRVRDb250cmlidXRvciIsIkdFVENvbnRyaWJ1dG9ySWQiLCJHRVRDb250cmlidXRvckxvZ2luIiwiR0VUUGVvcGxlIiwiR0VUUGVvcGxlSWQiLCJHRVRQZW9wbGVMb2dpbiIsIkdFVFBlb3BsZU1haWwiLCJHRVRQaWN0dXJlIiwiR0VUR3JvdXAiLCJHRVRHcm91cElkIiwiR0VUR3JvdXBOYW1lIiwiR0VUR3JvdXBTZWFyY2giXSwiZXh0cmEiOnsicmVhZCI6WyJKdW5pdFRlc3RzIiwiZGlyZWN0b3J5IiwiZGlyZWN0b3J5w6kiLCJkaXJlY3RvcnnDoCIsImRpcmVjdG9yeSYiLCJkaXJlY3RvcnkrIiwiZGlyZWN0b3J5PSIsImRpcmVjdG9yeToiLCJkaXJlY3RvcnkoIiwiZGlyZWN0b3J5JTIwIl19fQ.e2uZvzqcR866iX7FZik1th4z_MfzdNTg78riXhBo7UA' }
}
