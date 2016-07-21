var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheduledTaskSchema = new Schema({
	_id: String,
	scheduler: String,
	enabled: Boolean,
	params: Schema.Types.Mixed
});

ScheduledTaskSchema.index({ _id: "text", scheduler: "text" });

module.exports = mongoose.model('ScheduledTask', ScheduledTaskSchema);