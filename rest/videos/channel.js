var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../controllers/video');
var CommonController = require(__dirname + '/../../controllers/common');
var AuthController = require(__dirname + '/../../controllers/auth');

exports.routes = {
	list: { param:'id', get:[
		CommonController.Paginate,
		function(req,res,next) {
			var Channel = require(__dirname + '/../../models/channel');
			Channel.find({ "_id":req.params.id})
            		.exec(function(err,data) {
            			if (data.length>=1) {
            				req.data = {
                              	query:{"_id":{"$in":data[0].videos}}
                            };
                            next();
            			}
            			else {
            				res.status(404).json({
            					status:false,
            					message:"No such channel with id " + req.params.id
            				});
            			}
            		});
		},
		VideoController.LoadVideos,
		CommonController.JsonResponse
	]}
};
