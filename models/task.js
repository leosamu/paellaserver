
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('./plugins/mongoose-uuid');

var TaskSchema = new Schema({
	_id: String,
	task: String,
	error: Boolean,
	targetType: String,
	targetId: String,
	parameters: String,
	processing: Boolean,
	priority: Number
});

TaskSchema.plugin(uuid.plugin, 'Task');

module.exports = mongoose.model('Task',TaskSchema);