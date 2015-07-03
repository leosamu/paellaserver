var mongoose = require('mongoose');
var Q = require('q');

// Load channel title and identifier list
//	Input: req.query.skip, req.query.limit
//	Output: res.data [ { _id:"channel_id", title:"channel_title" } ]
exports.LoadChannels = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var select = '-children -deletionDate ' +
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
	var Video = require(__dirname + '/../models/video');

	var user = req.user;
	var isAdmin = user && user.roles.some(function(role) {
			return role.isAdmin;
		});
	var select = '-search -processSlides';
	var query = { "_id":req.params.id };

	Channel.find(query)
		.select(select)
		.populate('owner','contactData.name contactData.lastName')
		.populate('repository','server endpoint')
		.populate('videos')
		.populate('children')
		.exec(function(err,data) {
			var populationList = [];
			var videos = [];
			var children = [];
			try {
				var videos = JSON.parse(JSON.stringify(data[0].videos));
				var children = JSON.parse(JSON.stringify(data[0].children));
			}
			catch (e) {
			}

			if (data.length>0) {
				req.data = data[0];
				req.data.videos.forEach(function(item, index) {
					populationList.push(Video.find({"_id":item._id})
						.populate('owner','contactData.name contactData.lastName')
						.populate('repository')
						.exec(function(err,videoData) {
							var videoItem = {
								_id:videoData[0]._id,
								title:videoData[0].title,
								creationDate:videoData[0].creationDate,
								owner:[],
								hidden: videoData[0].hidden,
								hiddenInSearches: videoData[0].hiddenInSearches
							};
							if (videoData[0].thumbnail) {
								var repo = videoData[0].repository;
								videoItem.thumbnail = repo.server + repo.endpoint + videoItem._id + "/" + videoData[0].thumbnail;
							}
							videoData[0].owner.forEach(function(owner) {
								videoItem.owner.push({
									_id:owner._id,
									contactData: {
										lastName:owner.contactData ? owner.contactData.lastName:"",
										name:owner.contactData ? owner.contactData.name:""
									}
								});
							});
							videos.forEach(function(findVideo,index) {
								if (findVideo._id==videoItem._id) {
									if (!videoData[0].hidden || isAdmin) {
										videos[index] = videoItem;
									}
									else {
										videos.splice(index, 1);
									}
								}
							});
						}));
				});

				req.data.children.forEach(function(item, index) {
					populationList.push(Channel.find({"_id":item._id})
						.populate('owner','contactData.name contactData.lastName')
						.populate('repository')
						.exec(function(err,channelData) {
							var channelItem = {
								_id:channelData[0]._id,
								title:channelData[0].title,
								creationDate:channelData[0].creationDate,
								owner:[],
								hidden: channelData[0].hidden,
								hiddenInSearches: channelData[0].hiddenInSearches
							};
							if (channelData[0].thumbnail) {
								var repo = channelData[0].repository;
								channelItem.thumbnail = repo.server + repo.endpoint + channelItem._id + "/" + channelData[0].thumbnail;
							}
							channelData[0].owner.forEach(function(owner) {
								channelItem.owner.push({
									_id:owner._id,
									contactData: {
										lastName:owner.contactData ? owner.contactData.lastName:"",
										name:owner.contactData ? owner.contactData.name:""
									}
								});
							});

							children.forEach(function(findChannel,index) {
								if (findChannel._id==channelItem._id) {
									if (!channelData[0].hidden || isAdmin) {
										children[index] = channelItem;
									}
									else {
										children.splice(index, 1);
									}
								}
							});

						}));
				});

				Q.all(populationList).then(function() {
					req.data = JSON.parse(JSON.stringify(data[0]));
					req.data.videos = videos;
					req.data.children = children;
/*					req.data = {
						_id:data[0]._id,
						title: data[0].title,
						creationDate: data[0].creationDate,
						owner: data[0].owner,
						videos: videos,
						children: children
					};
		*/
					next();
				});
			}
			else {
				res.status(404).json({
					status:false,
					message:"No such product with id " + req.params.id
				});
			}

				//.populate({ path:'video.repository' } )
		});

/*

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
		});*/
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

// Load channel's parents
//	Input: req.params.id > channel's identifier
//	Output: req.list > list of parent channels or empty array
exports.ParentsOfChannels = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var select = '-children -deletionDate ' +
		'-hidden -hiddenInSearches -owned -pluginData ' +
		'-canRead -canWrite -search -metadata ' +
		'-videos';

	Channel.find({"children":{$in:[req.params.id]}})
		.select(select)
		.populate('owner','contactData.name contactData.lastName')
		.populate('repository','server endpoint')
		.exec(function(err,data) {
			req.data = {
				list: data
			};
			next();
		});
};

// Load video's parents
//	Input: req.params.id > video's identifier
//	Output: req.list > list of parent channels or empty array
exports.ParentsOfVideo = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var select = '-children -deletionDate ' +
		'-hidden -hiddenInSearches -owned -pluginData ' +
		'-canRead -canWrite -search -metadata ' +
		'-videos';

	Channel.find({"videos":{$in:[req.params.id]}})
		.select(select)
		.populate('owner','contactData.name contactData.lastName')
		.populate('repository','server endpoint')
		.exec(function(err,data) {
			req.data = {
				list: data
			};
			next();
		});
};

