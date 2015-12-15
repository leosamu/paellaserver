
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('mongoose-uuid');

var UserSchema = new Schema({
	auth: Schema.Types.Mixed,
	contactData: {
		email: String,
		name: String,
		lastName: String,
		phone: String,
		gender: { type:String },
		comunicationLanguage: { type:String }
	},
	roles: [ { type:String, ref:'Role' } ]
}, {_id:false});

UserSchema.plugin(uuid.plugin, 'User');

module.exports = mongoose.model('User', UserSchema);
