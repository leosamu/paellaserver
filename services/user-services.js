var User = require('../models/user.js');
var Q = require('q');
var UserProvider = require('./user-provider.js');


var userProviders = [];

function registerUserProvider(userProvider) {
	userProviders.push(userProvider);
}


function getUserProviderByName(name) {
	var ret;

	userProviders.forEach(function(up){
		if  (rp.getProviderName() == name) {
			ret = up;
		}
	});	
	
	return ret;
}


function findUserById(userId) {
	var deferred = Q.defer();
	
	User.findOne({_id:userId})
	.populate("roles", "-__v")
	.exec(function(err, user){
		if (err) {
			deferred.reject(err);
		}
		else if (user) {
			deferred.resolve(user);
		}
		else {
			deferred.reject();
		}
	});
	
	return deferred.promise;
}


function findUserByEmail(email) {
	var deferred = Q.defer();
	
	User.findOne({"contactData.email": email})
	.populate("roles", "-__v")
	.exec(function(err, user){
		if (err) {
			deferred.reject(err);
		}
		else if (user) {
			deferred.resolve(user);
		}
		else {
			deferred.reject();
		}
	});
	
	return deferred.promise;
}



function getOrCreateUserByEmail(email) {
	var deferred = Q.defer();
	
	deferred.reject();
	
	return deferred.promise;
}





module.exports.UserProvider = UserProvider;

// User Providers
module.exports.registerUserProvider = registerUserProvider;
module.exports.getUserProviderByName = getUserProviderByName;


module.exports.findUserById = findUserById;
module.exports.findUserByEmail = findUserByEmail;
module.exports.getOrCreateUserByEmail = getOrCreateUserByEmail;
