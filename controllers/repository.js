var Q = require('q');
var configure = require(__dirname + "/../configure");

exports.utils = {
	/*
		A reasource is an object that contains the following fields:
			- _id: the unique identifier of the resource
			- repository: the repository identifier or the repository object

		An uninitialized resource is an object that countains the following fields:
			- _id: the unique identifier of the resource
			- type: type identifier to determine the repository that will be used
	 */

	assertValidResource: function(resource, deferred) {
		if (resource && resource._id!==undefined && resource.repository) {
			if (typeof(resource.repository)=="string") {
				return true;
			}
			else if ((typeof(resource.repository)=="object") && resource.repository._id) {
				resource.repository = resource.repository._id;
				return true;
			}
			else {
				deferred.reject(new Error("Could not get repository. Invalid repository identifier"));
				return false;
			}
		}
		else if (resource && resource._id!==undefined &&
			((resource.type && typeof(resource.type)=="string")) ||
			(resource.source && typeof(resource.source.type)=="string")
		) {
			return true;
		}
		else {
			deferred.reject(new Error("Could not get repository. Invalid resource"));
			return false;
		}
	},

	isResourceInitialized: function(resource) {
		if (resource.repository) {
			return true;
		}
		else {
			return false;
		}
	},

	loadRepo:function(id, onSuccess) {
		var Repo = require(__dirname + "/../models/repository");
		Repo.findOne({ "_id":id })
			.exec(onSuccess);
	},

	// Create the repository field from the resource type.
	initializeResource: function(resource) {
		var deferred = Q.defer();
		var result = null;
		var resourceType = resource.type || (resource.source && resource.source.type);

		if (this.assertValidResource(resource, deferred)
			&& !this.isResourceInitialized(resource)
		) {
			var config = configure.config;
			for (var type in config.repository) {
				var repo = config.repository[type];
				if (type==resourceType) {
					result = repo;
					break;
				}
			}
		}

		if (result) {
			this.loadRepo(result,function(err,data) {
				if (err) {
					deferred.reject(err);
				}
				else {
					deferred.resolve(data);
				}
			});
		}
		else {
			deferred.reject(new Error("Unknown resource type. Check if the resource type exists in the configuration database."));
		}

		return deferred.promise;
	},

	getRepositoryWithResource: function(resource) {
		var deferred = Q.defer();

		if (this.assertValidResource(resource, deferred)) {
			this.initializeResource(resource);
			var Repository = require(__dirname + '/../models/repository');
			Repository.find({ "_id":resource.repository }).$promise
				.then(function() {

				})
		}

		return deferred.promise;
	},

	createResourcesDirectory: function(resource) {
		var deferred = Q.defer();

		this.loadRepo(resource.repository, function(err,repoData) {
			if (err || !repoData) {
				deferred.reject(new Error("Could not load repository"));
			}
			else {
				var path = repoData.path.slice(-1)!='/' ? repoData.path + '/':repoData.path;
				path += resource._id + "/polimedia";
				var mkdirp = require('mkdirp');
				mkdirp(path, function(err) {
					if (!err) {
						deferred.resolve();
					}
					else {
						deferred.reject(err);
					}
				});
			}
		});

		return deferred.promise;
	}
};