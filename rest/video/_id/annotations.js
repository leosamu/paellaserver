
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../../controllers/video');
var AnnotationController = require(__dirname + '/../../../controllers/annotation');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	getAnnotations: {
		get:[
//			VideoController.LoadVideo,
	//		AuthController.LoadRoles,
//			AuthController.CheckAccess,	
			// TODO: Paginator					
			AnnotationController.LoadAnnotations,
			CommonController.JsonResponse
		]
	}
};
