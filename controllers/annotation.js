var Annotation = require(__dirname + '/../models/annotation');
var mongoose = require('mongoose');


// Load annotation data from a video id
// 	Input:
//				req.data -> videoId
//		(opt) req.params.type
//	Output: req.data
exports.LoadAnnotations = function(req,res,next) {
	var and = [{video: req.params.id}];
	if (req.params.type) {
		and.push({tye: req.params.type})
	}
	
	Annotation.find({'$and':and})
	.exec(function(err, data) {	
		if (err) { return res.sendStatus(500); }
	
		req.data = data;
		next();
	});
};


// Load annotation data
// 	Input:
//	req.params.id  -> videoId
//	req.params.annotationId
//	Output: req.data
exports.LoadAnnotation = function(req,res,next) {

	Annotation.findOne({ "_id":req.params.annotationId, video: req.params.id})
	.exec(function(err, data) {
		if (err) { return res.sendStatus(500); }
		if (!data) { return res.sendStatus(404); }
		
		req.data = data;
		next();
	});
};



// Create a new annotation
//	Input:
//		req.user
//		req.params.id  -> videoId
//		req.body: the new annotation
//	Output: req.data: the new annotation data, including the UUID
exports.CreateAnnotation = function(req,res,next) {	
	var item = new Annotation(req.body.annotation)	
	console.log(req.user);
	item.user = req.user._id;
	item.video = req.params.id;
	console.log(item);
	item.save(function(err) {
		if(!err) {
			res.status(201);
			req.data = item;
			next();
		}
		else {
			res.sendStatus(500);
		}
	});	
};


// Update an existing annotation
//	Input:
//		req.user
//		req.params.id  -> videoId
//		req.body: the new annotationData
//		req.params.annotationId
//	Output: req.data: the new channel data.
exports.UpdateAnnotation = function(req,res,next) {
	req.body.video = req.params.id;
	req.body.user = req.user._id;
	Annotation.findByIdAndUpdate({"_id": req.params.annotationId }, req.body, function(err, item) {
		if(err) { return res.sendStatus(500); }
		if (item) {
			res.status(204);
			req.data = item;
			next();			
		}
		else {
			res.sendStatus(500);
		}
	});			
};



// Delete an existing annotation
//	Input:
//		req.params.id  -> videoId
//		req.params.annotationId
//	Output: req.data: the new channel data.
exports.DeleteAnnotation = function(req,res,next) {
	req.body.video = req.params.id;
	req.body.user = req.user._id;
	Annotation.remove({"_id": req.params.annotationId }, function(err) {
		if(err) { return res.sendStatus(500); }
		res.sendStatus(204);
	});
};
