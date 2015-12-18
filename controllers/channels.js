var mongoose = require('mongoose');
var Q = require('q');

// Load channel title and identifier list
//	Input: req.data.query: mongodb query object, req.query.skip, req.query.limit
//	Output: res.data [ { _id:"channel_id", title:"channel_title" } ]
exports.LoadChannels = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var select = '-children -deletionDate ' +
		'-hidden -hiddenInSearches -owned -pluginData ' +
		'-canRead -canWrite -search -metadata ' +
		'-videos';
	var query = (req.data && req.data.query) ? req.data.query : {};
	query.deletionDate=null;
	
	Channel.count(query,function(err, count) {
		Channel.find(query)
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
	var query = { "_id":req.params.id , "deletionDate":null};

	Channel.find(query)
		.select(select)
		.populate('owner','contactData.name contactData.lastName')
		.populate('repository','server endpoint')
		.populate('videos',null,{"deletionDate":null})
		.populate('children',null,{"deletionDate":null})
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
				function populateVideoFunction(err,videoData) {
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
							if ((videoData[0] && videoData[0].published && videoData[0].published.status) || isAdmin) {
								videos[index] = videoItem;
							}
							else {
								videos.splice(index, 1);
							}
						}
					});
				};

				req.data = data[0];
				req.data.videos.forEach(function(item, index) {
					populationList.push(Video.find({"_id":item._id})
						.populate('owner','contactData.name contactData.lastName')
						.populate('repository')
						.exec(populateVideoFunction));
				});

				if (req.data.videosQuery) {
					var videosQuery = null;
					if (req.data.videosQuery.whereQuery) {
						videosQuery= { "$where":req.data.videosQuery.whereQuery };
					}
					else if (req.data.videosQuery.objectQuery) {
						try {
							videosQuery = JSON.parse(req.data.videosQuery.objectQuery);
						}
						catch (e) {

						}
					}

					if (videosQuery) {
						var result = Video.find(videosQuery)
							.populate('owner', 'contactData.name contactData.lastName')
							.populate('repository');

						if (req.data.videosQuery.sort) {
							result.sort(req.data.videosQuery.sort);
						}
						if (req.data.videosQuery.limit) {
							result.limit(req.data.videosQuery.limit);
						}
						populationList.push(
							result
							.exec(function(err,videoData) {
								if (!err && videoData) {
									videoData.forEach(function(videoItem) {
										videos.push(videoItem);
									});
									populateVideoFunction(err,videoData);
								}
							}));
					}
				}

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
								if (repo) {
									channelItem.thumbnail = repo.server + repo.endpoint + channelItem._id + "/channels/" + channelData[0].thumbnail;
								}
							}
							channelData[0].owner.forEach(function(owner) {
								if (owner) {
									channelItem.owner.push({
									_id:owner._id,
									contactData: {
											lastName:owner.contactData ? owner.contactData.lastName:"",
											name:owner.contactData ? owner.contactData.name:""
										}
									});
								}
							});

							children.forEach(function(findChannel,index) {
								if (findChannel._id==channelItem._id) {
									children[index] = channelItem;
									// Do not hide children
									//if (!channelData[0].hidden || isAdmin) {
									//	children[index] = channelItem;
									//}
									//else {
									//	children.splice(index, 1);
									//}
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
			if (channelData.thumbnail && channelData.repository) {
				channelData.thumbnail = channelData.repository.server +
										channelData.repository.endpoint +
										channelData._id + '/channels/' +
										channelData.thumbnail;
			}
		});
	}
	else if (data.thumbnail && data.repository) {
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

	Channel.find({"children":{$in:[req.params.id]}, deletionDate:null})
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

	Channel.find({"videos":{$in:[req.params.id]}, deletionDate:null})
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


// Execute a $where query in the Video document
//	Input: req.query.skip, req.query.limit, req.data.query, req.user: the owner of the new channel
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
		var Channel = require(__dirname + '/../models/channel');
		select = select || '-hidden -roles ' +
			'-hiddenInSearches -canRead -canWrite ' +
			'-deletionDate ' +
			'-metadata -search -processSlides ';

		Channel.find({ $where:q, deletionDate:null })
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

// Create a new channel
//	Input: req.data: the new channel data
//	Output: req.data: the new channel data, including the UUID
exports.CreateChannel = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var channelData = req.data;
	var user = req.user;
	if (!user) {
		res.status(401).json({ status:false, message:"Could not create channel. No user logged in"});
		return;
	}

	if (typeof(channelData)!="object" || !channelData.title) {
		res.status(500).json({ status:false, message:"Could not create new channel. Invalid channel data." });
		return;
	}

	channelData.owner = [ user._id ];
	var newChannel = new Channel(channelData);
	newChannel.save(function(err) {
		if (!err) {
			req.data = JSON.parse(JSON.stringify(newChannel));
			delete req.data.__v;
			next();
		}
		else {
			res.status(500).json({ status:false, message:"Unexpected server error creating new channel: " + err});
		}
	})
};

// Update an existing channel
//	Input: req.data: the new data, req.params.id: the target channel. req.data._id will be ignored
//	Output: req.data: the new channel data.
exports.UpdateChannel = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var channelData = req.data;
	var user = req.user;

	if (typeof(channelData)!="object" && (!channelData.title || channelData.title=="")) {
		res.status(500).json({ status:false, message:"Could not create new channel. Invalid channel data." });
		return;
	}

	delete channelData._id;

	Channel.update({ "_id":req.params.id }, channelData, { multi:false }, function(err,data) {
		if (!err) {
			req.data = channelData;
			req.data._id = req.params.id;
			next();
		}
		else {
			res.status(500).json({ status:false, message:"Unexpected server error creating new channel:" + err});
		}
	});
};

// Update an existing channel with the parameters specified in req.data, and keep unchanged the resto of the elements
//	Input: req.data: the new data, req.params.id: the target channel. req.data._id will be ignored
//	Output: req.data: the new channel data.
exports.PatchChannel = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	var channelData = req.data;
	var user = req.user;

	if (typeof(channelData)!="object" && (!channelData.title || channelData.title=="")) {
		res.status(500).json({ status:false, message:"Could not create new channel. Invalid channel data." });
		return;
	}

	delete channelData._id;

	Channel.update({ "_id":req.params.id }, { "$set":channelData }, { multi:false }, function(err,data) {
		if (!err) {
			req.data = channelData;
			req.data._id = req.params.id;
			next();
		}
		else {
			res.status(500).json({ status:false, message:"Unexpected server error creating new channel:" + err.message});
		}
	});
};

// Delete a channel
//	Input: req.params.id: the channel id
//	Output:
exports.RemoveChannel = function(req,res,next) {
	var Channel = require(__dirname + '/../models/channel');
	Channel.find({"_id":req.params.id})
		.remove()
		.exec(function(err,data) {
			if (err) {
				res.status(500).json({status:false, message:"Error executing query: " + err.message() });
			}
			else {
				next();
			}
		});
};

