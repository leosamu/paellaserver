
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
	_id: { type:String },
	value: { type:Schema.Types.Mixed }
});

module.exports = mongoose.model('Config',ConfigSchema);
