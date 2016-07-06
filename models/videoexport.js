var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('./plugins/mongoose-uuid');

var VideoExportSchema = new Schema({
	user: { type:String, ref:'User' },
    video: { type:String, ref:'Video' },
    slices: [{
	    start: {type: Number},
	    end: {type: Number}
    }],
    meta: {
	    title: { type: String }
    },
    status: { type: String }, // 'editing', 'sendedToProcess', 'processing', 'processed'
    videoIdGenerated: { type: String, ref:'Video' }
}, {_id:false});


VideoExportSchema.plugin(uuid.plugin);

module.exports = mongoose.model('VideoExport', VideoExportSchema);
module.exports.schema = VideoExportSchema;
