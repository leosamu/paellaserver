var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../controllers/video');
var CommonController = require(__dirname + '/../../controllers/common');
var AuthController = require(__dirname + '/../../controllers/auth');

exports.routes = {
	list: { param:'id', get:[
		CommonController.Paginate,
		function(req,res,next) {
			req.data = {
				query:{"owner":{$in:[req.params.id]}}
			}
			next();
		},
		VideoController.LoadVideos,
		CommonController.JsonResponse
	]}
}
