var configure = require("../../configure.js");
var UserProvider = require("../../services/user-provider.js");
var User = require('../../models/user.js');
var util = require('util');
var Q = require('q');
var request = require('request');
var iconv = require('iconv-lite');

/**
 * `LocalUserProvider`
 */
function LocalUserProvider() {
	UserProvider.call(this, "local");
}


/**
 * Inherit from `UserProvider`.
 */
util.inherits(LocalUserProvider, UserProvider);



LocalUserProvider.prototype.getOrCreateUserByAuthInfo = function(autenticateInfo) {
	var deferred = Q.defer();		

	var query = {};
	var loginField = configure.config.security.loginField;
	var passwField = configure.config.security.passwField;
	query[loginField] = autenticateInfo.username;
	query[passwField] = autenticateInfo.password;
	User.findOne(query)
	.exec(function(err, user) {
		if (err) {
			return deferred.reject(err);
		}
		deferred.resolve(user);
	});

	return deferred.promise;
}


LocalUserProvider.prototype.getOrCreateUserByEmail = function(email) {
	var deferred = Q.defer();		

	deferred.reject();

	return deferred.promise;
};




module.exports = LocalUserProvider;
