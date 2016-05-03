
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('./plugins/mongoose-uuid');

var TaskSchema = new Schema({
	_id: String,
	task: String,
	error: {type: Boolean, default: false},
	errorMessage: String,	
	targetType: String,
	targetId: String,
	parameters: String,
	processing: {type: Boolean, default: false},
	priority: {type: Number, default: 10},
	creationDate: { type: Date, default: Date.now }
});

TaskSchema.plugin(uuid.plugin, 'Task');

module.exports = mongoose.model('Task',TaskSchema);