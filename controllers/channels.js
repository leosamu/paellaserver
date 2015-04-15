var mongoose = require('mongoose');

// Load channel title and identifier list
//	Input: req.query.skip, req.query.limit
//	Output: res.data [ { _id:"channel_id", title:"channel_title" } ]
exports.LoadChannels = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var select = '-children -creationDate -deletionDate ' +
		'-hidden -hiddenInSearches -owned -pluginData -repository ' +
		'-canRead -canWrite -search -owner -metadata ' +
		'-videos';
	Channel.find()
		.skip(req.query.skip)
		.limit(req.query.limit)
		.select(select)
		.exec(function(err,data) {
			req.data = data;
			next();
		});
};

// Load channel data
//	Input: req.params.id
//	Output: req.data
exports.LoadChannel = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var select = '-search -processSlides';
	Channel.find({ "_id":req.params.id})
		.select(select)
		.exec(function(err,data) {
			req.data = data;
			next();
		});
};

// Load channel's thumbnail full URL
//	Input: req.data > channel data
//	Output: req.data.thumbnail is replaced with the full public URL
exports.LoadUrlFromRepository = function(req,res,next) {
	var Repository = require(__dirname + '/../models/repository');
	if (req.data && req.data.length>0 && req.data[0].thumbnail) {
		var channelData = req.data[0];
		Repository.find({"_id":channelData.repository})
			.exec(function(err,repo) {
				if (repo.length>0) {
					repo = repo[0];
				}
				else {
					repo = { server:'', endpoint:'' };
				}
				if (channelData.thumbnail) channelData.thumbnail = repo.server + repo.endpoint + channelData._id + '/channels/' + channelData.thumbnail;

				req.data = channelData;
				next();
			});
	}
	else {
		next();
	}
};