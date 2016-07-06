
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('../../../models/plugins/mongoose-uuid');

var Schema = new Schema({
	description: String,
	server: String,
	playerURL: String,
	editorURL: String,
	user: String,
	password: String,
	apiVersion: String
}, {_id:false});


Schema.plugin(uuid.plugin);

module.exports = mongoose.model('Translectures', Schema);

