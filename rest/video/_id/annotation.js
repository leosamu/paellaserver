
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../../controllers/video');
var AnnotationController = require(__dirname + '/../../../controllers/annotation');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');



exports.routes = {
	getAnnotation: {
		param: 'annotationId',
		get:[		
			VideoController.LoadVideo,
			AuthController.LoadRoles,
//			AuthController.CheckAccess,
			AnnotationController.LoadAnnotation,
			CommonController.JsonResponse
		]
	},
	
	createAnnotation: {
		post:[
			VideoController.LoadVideo,
			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			AnnotationController.CreateAnnotation,
			CommonController.JsonResponse
		]
	},

	updateAnnotation: {
		param: 'annotationId',	
		patch:[
			VideoController.LoadVideo,
			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			AnnotationController.UpdateAnnotation,
			CommonController.JsonResponse
		]
	},
	
	deleteAnnotation: {
		param: 'annotationId',	
		delete:[
			VideoController.LoadVideo,
			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			AnnotationController.DeleteAnnotation,
			CommonController.JsonResponse
		]
	}			
};
