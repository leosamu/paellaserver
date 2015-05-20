var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('mongoose-uuid');

var VideoSchema = new Schema({
	repository: { type:String, ref:'Repository' },
	slides: [
		{
			mimetype: String,
			url: String,
			id: String,
			thumb: String,
			time: Number
		}
	],
	hidden: Boolean,
	hiddenInSearches: Boolean,
	owner: [ { type:String, ref:'User' } ],
	creationDate: { type: Date, default: Date.now },
	deletionDate: Date,
	language: String,
	title: String,
	catalog: String,
	source: {
		type: { type: String },
		videos: { type:[ Schema.Types.Mixed ]},
		slaveVideos: { type:[Schema.Types.Mixed] }
	},
	pluginData: Schema.Types.Mixed,
	thumbnail: String,
	metadata: { type:[ String ] }
}, {_id:false});

VideoSchema.plugin(uuid.plugin, 'Video');

module.exports = mongoose.model('Video',VideoSchema);
module.exports.schema = VideoSchema;
