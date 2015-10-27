
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Catalog = new Schema({
	_id: { type: String },
	description: { type: String },
	inheritedPermissions: [
		{
			role: { type: String, required:true },
			read: { type: Boolean, default:true },
			write: { type: Boolean, default:false }			
		}
	],
	
	permissions: [
		{
			role: { type: String, required:true },
			read: { type: Boolean, default:false },
			write: { type: Boolean, default:false },
			upload: { type: Boolean, default:false }
		}
	],
	defaultRepository: { type:String, ref:'Repository' },
	canBeDeletedByOwner: {type: Boolean, default: false }

});


module.exports = mongoose.model('Catalog', Catalog);



// Polimedia_Valencia
// Polimedia_Alcoy
// Polimedia_Gandia
// Politube
// TV
// ICE
// ARQT
// VIDEOAPUNTES
// ...


