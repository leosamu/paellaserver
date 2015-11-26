
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Annotation = new Schema({
	user: [ { type:String, ref:'User' } ],
    video: [ { type:String, ref:'Video' } ],
    type: { type:String },
	time: { type:Number },
	duration: { type:Number },
	content: String
//	private: Boolean
}, {_id:false});

module.exports = mongoose.model('Annotation', Annotation);
