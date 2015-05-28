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
	hideSocial: Boolean,
	owner: [ { type:String, ref:'User' } ],
	creationDate: { type: Date, default: Date.now },
	deletionDate: Date,
	language: String,
	title: String,
	catalog: String,
	source: {
		type: { type: String },
		videos: [
			{
				mimetype: { type: String },
				src: { type: String },
				href: { type: String },
				link: { type: String },
				width: { type: Number },
				height: { type: Number },
				operator: { type: String, ref:'User'},
				recordingDate: { type:Date }
			}
		],
		slaveVideos: [
			{
				mimetype: { type: String },
				src: { type: String },
				href: { type: String },
				link: { type: String },
				width: { type: Number },
				height: { type: Number },
				operator: { type: String, ref:'User'},
				recordingDate: { type:Date }
			}
		]
	},
	pluginData: Schema.Types.Mixed,
	thumbnail: String,
	metadata: { type:[ String ] },
	permissions: [
		{
			role: { type: String, required:true },
			read: { type: Boolean, default:true },
			write: { type: Boolean, default:false }
		}
	]
}, {_id:false});

VideoSchema.plugin(uuid.plugin, 'Video');

module.exports = mongoose.model('Video',VideoSchema);
module.exports.schema = VideoSchema;
