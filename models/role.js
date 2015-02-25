
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('mongoose-uuid');

var RoleSchema = new Schema({
	_id: String,
	description: String,
	isAdmin: Boolean
});

module.exports = mongoose.model('Role',RoleSchema);