/* 
 * File 	: ./server/models/field.js
 * Author(s)	: Zidmann, Shogi31
 * Function 	: This file defines the model of one field contains in a list
 * Version  	: 1.0.0
 */

var u = require('../utils/utils.js');

function Field(p){
	this.name     = p.name || null;
	this.label    = p.label || null;
	this.type     = p.type || null;
	this.options  = p.options || null;
	this.required = p.required || false;
	return this;
};

/* obj : returns the javascript object, used to store in the db
*/
Field.prototype.obj = function(){
	return {
		name     : this.name,
		label    : this.label,
		type     : this.type,
		options  : this.options,
		required : this.required
	};
};


module.exports = Field;
