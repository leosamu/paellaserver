var mongoose = require('mongoose');
var config = require("./config");
var install = require("./install");
exports.config = config;
exports.install = install;
var Q = require('q');

exports.checkInitConfig = function() {
	var Role = require(__dirname + '/models/role');
	var User = require(__dirname + '/models/user');
	var Channel = require(__dirname + '/models/channel');
	var Repository = require(__dirname + '/models/repository');

	var rolePromises = [];
	var roles = [];
	var userPromises = [];
	var adminUser = null;
	var channelPromises = [];

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
}

