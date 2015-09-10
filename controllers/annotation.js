
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

// Create a new annotation
//	Input: req.data: the new channel data
//	Output: req.data: the new channel data, including the UUID
exports.CreateAnnotation = function(req,res,next) {
	var Annotation = require(__dirname + '/../models/annotation');
	var anotationData = req.data;
	var user = req.user;
	if (!user) {
		req.status(401).json({ status:false, message:"Could not create annotation. No user logged in"});
		return;
	}

	if (typeof(anotationData)!="object" && !anotationData.title) {
		req.status(500).json({ status:false, message:"Could not create new annotation. Invalid annotation data." });
		return;
	}

	anotationData.user = [ user._id ];
	var newAnnotation = new Annotation(anotationData);
	newAnnotation.save(function(err) {
		if (!err) {
			req.data = JSON.parse(JSON.stringify(newAnnotation));
			delete req.data.__v;
			next();
		}
		else {
			req.status(500).json({ status:false, message:"Unexpected server error creating new annotation: " + err});
		}
	})
};

// Update an existing annotation
//	Input: req.data: the new data, req.params.id: the target channel. req.data._id will be ignored
//	Output: req.data: the new channel data.
exports.UpdateAnnotation = function(req,res,next) {
	var Annotation = require(__dirname + '/../models/annotation');
	var annotationData = req.data;
	var user = req.user;

	if (typeof(annotationData)!="object" && (!annotationData.video || annotationData.video=="")) {
		req.status(500).json({ status:false, message:"Could not update annotation. Invalid annotation data." });
		return;
	}

	delete annotationData._id;

	Annotation.update({ "_id":req.params.id }, annotationData, { multi:false }, function(err,data) {
		if (!err) {
			req.data = annotationData;
			req.data._id = req.params.id;
			next();
		}
		else {
			req.status(500).json({ status:false, message:"Unexpected server error updating annotation:" + err});
		}
	});
};
