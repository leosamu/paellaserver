
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('mongoose-uuid');

var TaskSchema = new Schema({
	_id: String,
	task: String,
	error: Boolean,
	targetType: String,
	targetId: String,
	parameters: String
});

TaskSchema.plugin(uuid.plugin, 'Task');

module.exports = mongoose.model('Task',TaskSchema);