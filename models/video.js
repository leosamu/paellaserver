var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('./plugins/mongoose-uuid');


var SliceSchema = new Schema({
	_id: String,
	type: String,
	start: Number,
	end: Number,
	enabled: Boolean
});


var VideoSchema = new Schema({
	repository: { type:String, ref:'Repository' },
	catalog: { type: String, ref:'Catalog' },
	
	slides: [
		{
			mimetype: String,
			url: String,
			id: String,
			thumb: String,
			time: Number
		}
	],
	blackboard: {
		frames: [
			{
				src: { type:String },
				time: { type:Number }
			}
		],
		mimetype: { type:String },
		res: {
			w: { type:Number },
			h: { type:Number }
		}
	},
	hidden: Boolean,
	hiddenInSearches: Boolean,
	hideSocial: Boolean,
	published: {
		status: { type: Boolean },
		publicationDate: { type:Date }
	},
	owner: [ { type:String, ref:'User' } ],
	creationDate: { type: Date, default: Date.now },
	deletionDate: Date,
	language: String,
	title: String,
	duration: { type:Number },
	source: {
		type: { type: String },  //internos, externos
		live: { type: Boolean, default: false},
		link:  { type: String },
		videos: [
			{
				mimetype: { type: String },
				src: { type: String },
				href: { type: String },
				link: { type: String },  //TODO: Quitar
				server: { type: String },
				stream: { type: String },
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
				link: { type: String },   //TODO: Quitar
				server: { type: String },
				stream: { type: String },
				width: { type: Number },
				height: { type: Number },
				operator: { type: String, ref:'User'},
				recordingDate: { type:Date }
			}
		]
	},
	unprocessed: { type:Boolean, default:false },
	pluginData: { type:Object },
	thumbnail: String,
	metadata: {
		keywords: [ { type: String } ]
	},
	permissions: [
		{
			role: { type: String, required:true },
			read: { type: Boolean, default:true },
			write: { type: Boolean, default:false }
		}
	],
	slices: [SliceSchema]
}, {_id:false});

VideoSchema.plugin(uuid.plugin);

module.exports = mongoose.model('Video',VideoSchema);
module.exports.schema = VideoSchema;
