
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Repository = new Schema({
	_id: String,
	description: String,
	endpoint: String,
	server: String,
	path: String,
	diskusage: {
		value: Number,
		updatedDate: Date
	}
});

module.exports = mongoose.model('Repository', Repository);
