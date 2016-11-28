var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('./plugins/mongoose-uuid');

var Annotation = new Schema({
	_id: { type: String },
	title: {type: String},
	user: { type:String, ref:'User' },
    video: { type:String, ref:'Video' },
    type: { type:String },
	time: { type:Number },
	duration: { type:Number },
	content: String
//	private: Boolean
});//, {_id:false});

Annotation.plugin(uuid.plugin);

module.exports = mongoose.model('Annotation', Annotation);
