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
	owner:    [ { type:String, ref:'User' } ],
	operator: [ { type: String, ref:'User'} ],
	creationDate: { type: Date, default: Date.now },
	deletionDate: Date,
	language: String,
	title: String,
	duration: { type:Number },
	source: {
		type: { type: String },  //internos, externos
		live: { type: Boolean, default: false},
		link:  { type: String },
		masters:{
			repository: { type:String, ref:'Repository' },
			files: [
				{
					name: { type:String },
					tag: { type:String }
				}
			],
			task: { type:String, ref:'Task' }			
		},
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
	slices: [SliceSchema],
	search: {
		id: { type:String },
		title: { type:String },
		owner: { type:String },	
		transcription: { type:String }
	}
}, {_id:false});

VideoSchema.plugin(uuid.plugin);




VideoSchema.methods.updateSearchIndex = function () {
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
			ownersNames.push(name);			
		});
		
		var titleText = self.title || "";
		titleText = removeDuplicate(toAccentInsensitiveString(titleText.toLowerCase()));
		self.model('Video').update(
			{_id: self._id},
			{ $set: { 
				search: {
					id:	self._id,
					title: titleText,
					owner: ownersNames,
					transcription: ''
				}
			}},
			function(err) {}			
		);
	});
}





module.exports = mongoose.model('Video',VideoSchema);
module.exports.schema = VideoSchema;
