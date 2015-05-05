
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('mongoose-uuid');


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
	title: String,
	videos: [ { type:String, ref:'Video' } ]
}, {_id:false});

ChannelSchema.plugin(uuid.plugin, 'Channel');

module.exports = mongoose.model('Channel', ChannelSchema);
