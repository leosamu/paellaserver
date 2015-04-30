var mongoose = require('mongoose');

// Load channel title and identifier list
//	Input: req.query.skip, req.query.limit
//	Output: res.data [ { _id:"channel_id", title:"channel_title" } ]
exports.LoadChannels = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var select = '-children -creationDate -deletionDate ' +
		'-hidden -hiddenInSearches -owned -pluginData ' +
		'-canRead -canWrite -search -metadata ' +
		'-videos';
	Channel.count({},function(err, count) {
		Channel.find()
			.skip(req.query.skip)
			.limit(req.query.limit)
			.select(select)
			.populate('owner','contactData.name contactData.lastName')
			.populate('repository','server endpoint')
			.exec(function(err,data) {
				req.data = {
					total: count,
					skip: Number(req.query.skip),
					limit: Number(req.query.limit),
					list:data
				};
				next();
			});
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
		.populate('owner','contactData.name contactData.lastName')
		.populate('repository','server endpoint')
		.exec(function(err,data) {
			if (data.length>0) {
				req.data = data[0];
				next();
			}
			else {
				res.status(404).json({
					status:false,
					message:"No such product with id " + req.params.id
				});
			}
		});
};

// Load channel's thumbnail full URL
//	Input: req.data > channel data
//	Output: req.data.thumbnail is replaced with the full public URL
exports.LoadUrlFromRepository = function(req,res,next) {
	var Repository = require(__dirname + '/../models/repository');
	var data = req.data;
	if (data.list && data.list.length>0) {
		data.list.forEach(function(channelData) {
			if (channelData.thumbnail) {
				channelData.thumbnail = channelData.repository.server +
										channelData.repository.endpoint +
										channelData._id + '/channels/' +
										channelData.thumbnail;
			}
		});
	}
	else if (data.thumbnail) {
		data.thumbnail = data.repository.server +
			data.repository.endpoint +
			data._id + '/channels/' +
			data.thumbnail;
	}
	next();
};