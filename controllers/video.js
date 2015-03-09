
var mongoose = require('mongoose');

// Load video title and identifier list
//	Input: req.query.skip, req.query.limit
//	Output: res.data [ { _id:"video_id", title:"video_title" } ]
exports.LoadVideos = function(req,res,next) {
	var Video = require(__dirname + '/../models/video');
	var select = '-slides -hidden -thumbnail ' +
				'-hiddenInSearches -owner -creationDate -canRead -canWrite ' +
				'-deletionDate -language -source -pluginData ' +
				'-metadata -search -hideSocial -processSlides -repository';
	Video.find()
		.skip(req.query.skip)
		.limit(req.query.limit)
		.select(select)
		.exec(function(err,data) {
			req.data = data;
			next();
		});
}

// Load video data
// 	Input: req.params.id
//	Output: req.data
exports.LoadVideo = function(req,res,next) {
	var Video = require(__dirname + '/../models/video');
	var select = '-search -processSlides';
	Video.find({ "_id":req.params.id})
		.select(select)
		.exec(function(err,data) {
			req.data = data;
			next();
		});
}

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
				if (videoData.thumbnail) videoData.thumbnail = repo.server + repo.endpoint + videoData._id + '/' + videoData.thumbnail;
				videoData.slides.forEach(function(slide) {
					if (slide.url) slide.url = repo.server + repo.endpoint + videoData._id + '/' + slide.url;
					if (slide.thumb) slide.thumb = repo.server + repo.endpoint + videoData._id + '/' + slide.thumb;
				});

				req.data = videoData;
				next();
			});
	}
	else {
		next();
	}
}
