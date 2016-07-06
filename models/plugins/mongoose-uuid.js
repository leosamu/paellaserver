var uuid = require('node-uuid');


exports.plugin = function(schema) {

    if(!schema.paths._id)
        schema.add({
            '_id': { 
                type: String,
                index: {
                    unique: true
                }
            }
        });

    schema.pre('save', function(next) {
        if(!this.isNew) return next();

        if (this._id == undefined) {
	        this._id = uuid.v1();
	    }
        return next();
    });
};
