var User = require("../../models/user.js");
var RoleServices = require("../../services/role-services.js");
var RoleProvider = RoleServices.RoleProvider;
var util = require('util');
var Q = require('q');

/**
 * `LocalUserRoleProvider`
 */
function LocalUserRoleProvider() {
	RoleProvider.call(this, "User roles");
}


/**
 * Inherit from `RoleProvider`.
 */
util.inherits(LocalUserRoleProvider, RoleProvider);

LocalUserRoleProvider.prototype.getRolesForUser = function(user) {
	var deferred = Q.defer();
	deferred.resolve([
		{_id: 'USER_' + user._id, description: user.contactData.name + " " + user.contactData.lastName, isAdmin: false}
	]);
	return deferred.promise;
};


LocalUserRoleProvider.prototype.searchRoles = function(search) {
	var deferred = Q.defer();
	
	var query = {$or:[
		{ "contactData.name": { $regex: '.*'+search+'.*', $options: "i" } },
		{ "contactData.lastName": { $regex: '.*'+search+'.*', $options: "i" } },
		{ "contactData.email": { $regex: '.*'+search+'.*', $options: "i" } }
	]};
	
	User.find(query)
	.select("-__v")
	.exec(function(err, users){
		if (err) {
			deferred.reject(err);
		}
		else {
			var roles = [];
			
			users.forEach(function(user){
				roles.push({_id: 'USER_' + user._id, description: user.contactData.name + " " + user.contactData.lastName, isAdmin: false})	
			});
			deferred.resolve(roles);
		}
	})
	
	return deferred.promise;
}



module.exports = LocalUserRoleProvider;
