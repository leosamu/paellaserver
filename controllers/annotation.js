
var mongoose = require('mongoose');

// Load annotation data
// 	Input: req.params.id
//	Output: req.data
exports.LoadAnnotation = function(req,res,next) {
	var Annotation = require(__dirname + '/../models/annotation');
	var select = '-search -processSlides';
	Annotation.find({ "_id":req.params.id})
		.select(select)
		.exec(function(err,data) {
			req.data = data;
			next();
		});
};

// Load annotation data from a video id
// 	Input: req.params.id
//	Output: req.data
exports.LoadVideoAnnotation = function(req,res,next) {
	var Annotation = require(__dirname + '/../models/annotation');
	var select = '-search -processSlides';
	Annotation.find({ "video":req.params.id})
		.select(select)
		.exec(function(err,data) {
			req.data = data;
			next();
		});
};