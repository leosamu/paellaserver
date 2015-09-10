
var mongoose = require('mongoose');

var AnnotationController = require(__dirname + '/../controllers/annotation');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	getAnnotationData: { param:'id', get:[
		AnnotationController.LoadAnnotation,
		CommonController.JsonResponse]},
    getVideoAnnotationData: { param:'id', get:[
		AnnotationController.LoadVideoAnnotation,
		CommonController.JsonResponse]},
		
    createAnnotation: { post:[
		AuthController.EnsureAuthenticatedOrDigest,
		AuthController.CheckAccess(['ADMIN']),
		function(req,res,next) {
			req.data = req.body;
			next();
		},
		AnnotationController.CreateAnnotation,
		CommonController.JsonResponse
	]},

    updateAnnotation: { param:'id', put:[
		AuthController.EnsureAuthenticatedOrDigest,
		AnnotationController.LoadAnnotation,
		AuthController.CheckWrite,
		function(req,res,next) {
			req.data = req.body;
			next();
		},
		AnnotationController.UpdateAnnotation,
		CommonController.JsonResponse
	]}


};