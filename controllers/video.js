
var mongoose = require('mongoose');

// Load video title and identifier list
//	Input: req.query.skip, req.query.limit, req.data.query
//	Output: res.data [ { _id:"video_id", title:"video_title" } ]
exports.LoadVideos = function(req,res,next) {
	var Video = require(__dirname + '/../models/video');
	var select = '-slides -hidden -roles -duration ' +
				'-hiddenInSearches -canRead -canWrite ' +
				'-deletionDate -pluginData ' +
				'-metadata -search -processSlides ';
	var query = req.data ? req.data.query:null;
	Video.find(query)
		.skip(req.query.skip)
		.limit(req.query.limit)
		.select(select)
		.populate('repository','server endpoint')
		.exec(function(err,data) {
			req.data = data;
			next();
		});
};


// Load newest vides (title and identifier) list
//	Input: req.query.skip, req.query.limit, req.data.query
//	Output: res.data [ { _id:"video_id", title:"video_title" } ]
exports.Newest = function(req,res,next) {
	var Video = require(__dirname + '/../models/video');
	var select = '-slides -hidden -roles -duration -source -blackboard ' +
		'-hiddenInSearches -canRead -canWrite ' +
		'-deletionDate -pluginData ' +
		'-metadata -search -processSlides ';
	var query = req.data ? req.data.query:null;
	Video.find(query)
		.skip(req.query.skip)
		.limit(req.query.limit)
		.sort({ creationDate:'desc' })
		.select(select)
		.exec(function(err,data) {
			req.data = data;
			next();
		});
};

// Gets the number of videos in the catalog
// 	Output: res.data > the number of videos
exports.Count = function(req,res,next) {
	var Video = require(__dirname + '/../models/video');
	Video.count().exec(function(err,data) {
		req.data = data;
		next();
	});
};

// Load video data
// 	Input: req.params.id
//	Output: req.data
exports.LoadVideo = function(req,res,next) {
	var Video = require(__dirname + '/../models/video');
	var select = '-search -processSlides';
	Video.find({ "_id":req.params.id })
		.select(select)
		.exec(function(err,data) {
			if (data.published && !data.published.status) {
				var user = req.user;
			}
			else {
				req.data = data;
			}
			next();
		});
};

// Load the video url's from the repository
//	Input: req.data (video)
//	Output: req.data (video) with the full video url
exports.LoadUrlFromRepository = function(req,res,next) {
	var Repository = require(__dirname + '/../models/repository');
	if (req.data && req.data.length>0 && req.data[0].source && req.data[0].source.videos) {
		var videoData = req.data[0];
		Repository.find({"_id":videoData.repository})
			.exec(function(err,repo) {
				if (repo.length>0) {
					repo = repo[0];
				}
				else {
					repo = { server:'', endpoint:'' };
				}
				videoData.source.videos.forEach(function(video) {
					if (video.src) {
						video.src = repo.server + repo.endpoint + videoData._id + '/polimedia/' + video.src;
					}
				});
				if (videoData.source.slaveVideos && videoData.source.slaveVideos.forEach) {
					videoData.source.slaveVideos.forEach(function(video) {
						if (video.src) {
							video.src = repo.server + repo.endpoint + videoData._id + '/polimedia/' + video.src;
						}
					});
				}
				if (videoData.thumbnail) videoData.thumbnail = repo.server + repo.endpoint + videoData._id + '/' + videoData.thumbnail;
				if (!videoData.slides) {
					videoData.slides = [];
				}
				videoData.slides.forEach(function(slide) {
					if (slide.url) slide.url = repo.server + repo.endpoint + videoData._id + '/slides/' + slide.url;
					if (slide.thumb) slide.thumb = repo.server + repo.endpoint + videoData._id + '/slides/' + slide.thumb;
				});

				req.data = videoData;
				next();
			});
	}
	else {
		next();
	}
};

exports.LoadThumbnails = function(req,res,next) {
	if (req.data) {
		req.data.forEach(function(videoData) {
			var repo = videoData.repository;
			if (repo) {
				if (videoData.thumbnail) videoData.thumbnail = repo.server + repo.endpoint + videoData._id + '/' + videoData.thumbnail;
			}
		});
	}
	next();
};

function checkVideoData(video) {

}

// Check if a video object is correct. If the input data include an identifier, it will check
// that the video exists in the database
//	Input: req.body > video object
//	Output: req.data > valid video object
exports.CheckVideo = function(req,res,next) {
	var Video = require(__dirname + '/../models/video');
	var data = req.body;

	if (typeof(data)=="object") {
		if (data._id) {
			Video.findOne({"_id":data._id},function(err,result) {
				if (!result) {
					res.status(404).json({ status:false, message:"No such video with id " + data._id});
				}
				else {
					try {
						checkVideoData(data);
						req.data = data;
						next();
					}
					catch (e) {
						res.status(422).json({ status: false, message: e.message });
					}
				}
			});
		}
		else {
			try {
				checkVideoData(data);
				req.data = data;
				next();
			}
			catch (e) {
				res.status(422).json({ status: false, message: e.message });
			}
		}
	}
};

// Execute a $where query in the Video document
//	Input: req.query.skip, req.query.limit, req.data.query
//	Output: res.data: the video data.
exports.Where = function(query,select) {
	return function(req,res,next) {
		var paramRE = /:(\w[a-zA-Z0-9]*)/g;
		var result = null;
		var q = query;
		while (result = paramRE.exec(q)) {
			var varName = result[0];
			var paramName = result[1];
			q = q.replace(new RegExp(varName),req.params[paramName]);
		}
		var Video = require(__dirname + '/../models/video');
		select = select || '-slides -hidden -roles -duration ' +
			'-hiddenInSearches -canRead -canWrite ' +
			'-deletionDate ' +
			'-metadata -search -processSlides ';

		Video.find({ $where:q })
			.skip(req.query.skip)
			.limit(req.query.limit)
			.select(select)
			.populate('repository','server endpoint')
			.exec(function(err,data) {
				req.data = data;
				next();
			});
	};
};

// Create a new video using the full json object except the identifier
//	Input: req.body.data > valid video object (see CheckVideo)
// 	Output: req.data > the new video object, including the identifier
exports.Create = function(req,res,next) {


	if (data) {

	}
};


// Update a video field
//	Input:
//	Output:
exports.UpdateField = function(fieldName, inputParamName) {
	return function(req,res,next) {
		var value = req[inputParamName];
		function updateField() {

		}



		next();
	};
};