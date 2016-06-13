var Role = require("../../models/role.js");
var RoleServices = require("../../services/role-services.js");
var RoleProvider = RoleServices.RoleProvider;
var util = require('util');
var Q = require('q');

/**
 * `LocalRoleProvider`
 */
function LocalRoleProvider() {
	RoleProvider.call(this, "Basic roles");
}


/**
 * Inherit from `RoleProvider`.
 */
util.inherits(LocalRoleProvider, RoleProvider);

LocalRoleProvider.prototype.getRolesForUser = function(user) {
	var deferred = Q.defer();
	deferred.resolve([
		{_id: 'USER', description: "Any logged user", isAdmin: false}
	]);
	return deferred.promise;
};


LocalRoleProvider.prototype.searchRoles = function(search) {
	var deferred = Q.defer();
	
	
	
	var query = {$or:[
		{ _id: { $regex: '.*'+search+'.*', $options: "i" } },
		{ description: { $regex: '.*'+search+'.*', $options: "i" } }
	]};
	
	Role.find(query)
	.select("-__v")
	.exec(function(err, roles){
		if (err) {
			deferred.reject(err);
		}
		else {
			deferred.resolve(roles);
		}
	})
	
	return deferred.promise;
}



module.exports = LocalRoleProvider;
