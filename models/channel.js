
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('./plugins/mongoose-uuid');


var ChannelSchema = new Schema({
	children: [ { type:String, ref:'Channel' } ],
	creationDate: { type: Date, default: Date.now },
	deletionDate: { type: Date },
	hidden: Boolean,
	hiddenInSearches: Boolean,
	owner: [ {type:String, ref:'User'} ],
	pluginData: Schema.Types.Mixed,
	thumbnail: String,
	repository: { type:String, ref:'Repository' },
	catalog: { type: String, ref:'Catalog' },	
	title: String,
	videos: [ { type:String, ref:'Video' } ],
	permissions: [
		{
			role: { type: String, required:true },
			read: { type: Boolean, default:true },
			write: { type: Boolean, default:false }
		}
	],
	videosQuery: {
		whereQuery: { type:String },
		objectQuery: { type:String },
		limit: { type:Number },
		sort: Schema.Types.Mixed
	}
}, {_id:false});

ChannelSchema.plugin(uuid.plugin, 'Channel');

module.exports = mongoose.model('Channel', ChannelSchema);
