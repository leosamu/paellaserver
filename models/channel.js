
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
	},
	search: {
		id: { type:String },	
		title: { type:String },
		owner: { type:String },		
	}
}, {_id:false});

ChannelSchema.plugin(uuid.plugin, 'Channel');





ChannelSchema.methods.updateSearchIndex = function () {
	function toAccentInsensitiveString(text) {
		if (text) {
			text = text.replace(RegExp("[aàáâãäå]","ig"),'a');
			text = text.replace(RegExp("[eèéêëẽ]","ig"),'e');
			text = text.replace(RegExp("[iìíîïĩ]","ig"),'i');
			text = text.replace(RegExp("[oðòóôõöø]","ig"),'o');
			text = text.replace(RegExp("[uùúûü]","ig"),'u');
			text = text.replace(RegExp("ñ","ig"),'n');
			text = text.replace(RegExp("ç","ig"),'c');
		}
		else {
			text = "";
		}
		return text;
	}
	
	function removeDuplicate(text) {
		return text.split(' ').filter(function(item,i,allItems){
			return i==allItems.indexOf(item);
		}).join(' ');
	}

	var self = this;
	this.model('User').find({_id:{$in:self.owner}}, function(err, users) {
		if (err) { return; }
		
		var ownersNames = [];
		users.forEach(function(user){
			var name = "";
			name = name + ( user.contactData.lastName || "" ) + " ";
			name = name + ( user.contactData.name || "" ) + " ";
			name = name + ( user.contactData.email || "" ) + " ";
			
			name = removeDuplicate(toAccentInsensitiveString(name.toLowerCase()));
			console.log (name);
			ownersNames.push(name);			
		});
		
		var titleText = self.title || "";
		titleText = removeDuplicate(toAccentInsensitiveString(titleText.toLowerCase()));
		self.model('Channel').update(
			{ _id: self._id},
			{ $set: { 
				search: {
					id:	self._id,
					title: titleText,
					owner: ownersNames
				}
			}}
		);
	});
}

module.exports = mongoose.model('Channel', ChannelSchema);
