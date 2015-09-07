
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
		CommonController.JsonResponse]}
};