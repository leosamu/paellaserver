
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('mongoose-uuid');

var ChannelSchema = new Schema({
	children: [ String ],
	creationDate: { type: Date, default: Date.now },
	deletionDate: { type: Date },
	hidden: Boolean,
	hiddenInSearches: Boolean,
	owner: [ {type:String, ref:'User'} ],
	pluginData: Schema.Types.Mixed,
	thumbnail: String,
	repository: { type:String, ref:'Repository' },
	title: String,
	videos: [ String ]
}, {_id:false});

ChannelSchema.plugin(uuid.plugin, 'Channel');

module.exports = mongoose.model('Channel', ChannelSchema);
