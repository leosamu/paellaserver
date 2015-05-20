var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../controllers/video');
var CommonController = require(__dirname + '/../../controllers/common');
var AuthController = require(__dirname + '/../../controllers/auth');

exports.routes = {
	contVideos: {
		 get: [
			 VideoController.Count,
			 function (req,res,next) {
				 req.data = {
					 result: true,
					 count: req.data
				 };
				 next();
			 },
			 CommonController.JsonResponse ]
	}
};