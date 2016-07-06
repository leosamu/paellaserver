var mongoose = require('mongoose');

// Search channels and videos
//	Input: req.query.skip, req.query.limit, req.query.search
//	Output: res.data.channels, res.data.videos
exports.Search = function(req,res,next) {
	var configure = require(__dirname + "/../configure");
	var Channel = require(__dirname + '/../models/channel');
	var Video = require(__dirname + '/../models/video');
	req.data = {
		channels:[],
		videos:[]
	};

	var user = req.user;
	var isAdmin = user && user.roles.some(function(role) {
		return role.isAdmin;
	});

	function prepareResult(req,data,collectionName,isSearch) {
		req.data = req.data || {};

		if (isAdmin) {
			req.data[collectionName] = data;
		}
		else {
			req.data[collectionName] = [];
			if (collectionName=='channels' && Array.isArray(data)) {
				data.forEach(function(item) {
					req.data[collectionName].push(item);
				});
			}
			else if (collectionName=='videos' && Array.isArray(data)) {
				data.forEach(function(item) {
					if (item.published && item.published.status) {
						req.data[collectionName].push(item);
					}
				});
			}
		}
	}

	var chSelect = '-children -deletionDate ' +
		'-pluginData ' +
		'-canRead -canWrite -search -metadata ' +
		'-videos';
	var vSelect = '-slides -roles -duration ' +
		'-canRead -canWrite ' +
		'-deletionDate -pluginData ' +
		'-metadata -search -processSlides';

	if (req.query.search=="" || !req.query.search) {
		var defaultChannel = configure.config.channels.default;
		Channel.find({ "_id":defaultChannel, deletionDate:null })
			.exec()
			.then(function(data) {
				if (data.length) {
					var subchannels = data[0].children;
					return Channel.find({"_id":{$in:subchannels}, deletionDate:null})
						.select(chSelect)
						.populate('owner','contactData.name contactData.lastName')
						.populate('repository','server endpoint')
						.exec();
				}
				else {
					res.status(404).json({
						status:false,
						message:"Default channel not found"
					});
				}
			})
			.then(function(data) {
				prepareResult(req,data,'channels',false);
				next();
			});
	}
	else {
		Channel.find(
			{ $text : { $search : req.query.search }, deletionDate:null },
			{ score : { $meta: "textScore" } }
		)
			.select(chSelect)
			.populate('owner','contactData.name contactData.lastName')
			.populate('repository','server endpoint')
			.sort({ score : { $meta : 'textScore' } })
			.exec()
			.then(function(data) {
				prepareResult(req,data,'channels');
				return Video.find(
					{ $text : { $search : req.query.search }, deletionDate:null },
					{ score : { $meta: "textScore" } }
				)
					.select(vSelect)
					.populate('owner','contactData.name contactData.lastName')
					.populate('repository','server endpoint')
					.sort({ score: { $meta: "textScore" } })
					.limit(1000)
					.exec(function(err,data) {
						prepareResult(req,data,'videos',true);
						next();
					});
			});
	}
};

// Load channel's thumbnail full URL
//	Input: req.data:{ channels:[], videos:[] }  > channel and video data
//	Output: req.data.thumbnail is replaced with the full public URL
exports.LoadUrlFromRepository = function(req,res,next) {
	var channels = req.data.channels;
	var videos = req.data.videos;
	if (channels && channels.length) {
		channels.forEach(function(channelData) {
			if (channelData.thumbnail && channelData.repository) {
				channelData.thumbnail = channelData.repository.server +
					channelData.repository.endpoint +
					channelData._id + '/channels/' +
					channelData.thumbnail;
			}
		})
	}
	if (videos && videos.length) {
		videos.forEach(function(videoData) {
			if (videoData.thumbnail && videoData.repository) {
				videoData.thumbnail = videoData.repository.server +
						videoData.repository.endpoint +
						videoData._id + "/" +
						videoData.thumbnail;
			}
		});
	}
	next();
};
