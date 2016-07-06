var mongoose = require('mongoose');
var configFile = require("./config");
exports.configFile = configFile;
var install = require("./install");
exports.install = install;
var Q = require('q');

exports.serverUrl = function() {
	var port = configFile.connection.port;
	var showPort = configFile.connection.showPortInURL;
	return configFile.connection.protocol + '://' +
		configFile.connection.rootUrl +
		(showPort && port!=80 && port!=443 ? ':' + port:"");
};

exports.checkInitConfig = function(configDone) {
	var Role = require(__dirname + '/models/role');
	var User = require(__dirname + '/models/user');
	var Video = require(__dirname + '/models/video');
	var Channel = require(__dirname + '/models/channel');
	var Repository = require(__dirname + '/models/repository');
	var Config = require("./models/config");

	var rolePromises = [];
	var roles = [];
	var userPromises = [];
	var adminUser = null;
	var channelPromises = [];
	var configPromises = [];

	var fileKeys = Object.keys(configFile);
	Config.find({"_id":{"$in":fileKeys}}).exec(function(err,data) {
		fileKeys.forEach(function(fileKey) {
			var isInDb = data.some(function(dataItem) {
				if (dataItem._id==fileKey) {
					return true;
				}
			});
			if (!isInDb) {
				console.log("Insert config data: " + fileKey + ":" + JSON.stringify(configFile[fileKey]));
				var configItem = new Config({"_id":fileKey, "value":configFile[fileKey]});
				configPromises.push(configItem.save());
			}
		});
	});


	Repository.find().exec()
		.then(function(data) {
			if (data.length==0) {
				install.repository.forEach(function(repo) {
					var newRepo = new Repository(repo);
					newRepo.save();
				});
			}
		});

	Role.find().exec()
		.then(function(data) {
			if (data.length==0) {
				var defaultRoles = install.role;
				for (var i=0; i<defaultRoles.length;++i) {
					var newRole = new Role(defaultRoles[i]);
					rolePromises.push(newRole.save());
				}
			}

			return Q.all(rolePromises);
		})
		.then(function(){
			return User.find({"roles":{"$in":["ADMIN"]}}).exec();
		})
		.then(function(data) {
			if (data.length==0) {
				install.user.forEach(function(user) {
					var newUser = new User(user);
					userPromises.push(newUser.save());
				});
			}
			return Q.all(userPromises);
		})
		.then(function() {
			return User.find({"roles":{"$in":["ADMIN"]}}).exec();
		})
		.then(function(data) {
			adminUser = data[0];
			return Channel.find().exec();
		})
		.then(function(data) {
			if (data.length==0) {
				install.channel.forEach(function(chn) {
					chn.owner = [];
					chn.owner.push(adminUser._id);
					var newChannel = new Channel(chn);
					newChannel.save();
				});
			}
		});

	Q.all(configPromises)
		.then(function() {
			Config.find()
				.exec(function(err,data) {
					exports.config = {};
					data.forEach(function(data) {
						exports.config[data._id] = data.value;
					});
					configDone();
				});

		});
};

