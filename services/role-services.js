var Q = require('q');
var RoleProvider = require('./role-provider.js');




var roleProviders = [];

function registerRoleProvider(roleProvider) {
	roleProviders.push(roleProvider);
}

function getRoleGroups() {
	var roleGroups = [];
	roleProviders.forEach(function(rp){
		var rg = rp.getRoleGroup();
		if (roleGroups.indexOf(rg) == -1) {
			roleGroups.push(rg);
		}
	});
	
	return roleGroups;
}


function getRolesForUser(user) {
	var deferred = Q.defer();
	var promises = [];
	var roles = [];
	
	roleProviders.forEach(function(rp){
		var p = rp.getRolesForUser(user)
		
		p.then(function(r) {
			r.forEach(function(rr){ roles.push(rr); });
		});
		
		promises.push(p)
	})
	
	Q.all(promises)
	.finally(
		function(){
			deferred.resolve(roles);
		}
	);
	return deferred.promise;
}


function searchRoles(roleGroup, search) {
	var deferred = Q.defer();
	var promises = [];
	var roles = [];
	
	if (search == undefined) {
		search = roleGroup;
		roleGroup = undefined;
	}
	roleProviders.forEach(function(rp){	
		if ( (roleGroup == undefined) || (roleGroup == rp.getRoleGroup())) {	
			var p = rp.searchRoles(search)			
			p.then(function(r){
				r.forEach(function(rr){ roles.push(rr); });
			});			
			promises.push(p)
		}
	})
	
	Q.all(promises)
	.finally(
		function(){
			deferred.resolve(roles);
		}
	);
	return deferred.promise;
}





module.exports.RoleProvider = RoleProvider;

// Role Providers
module.exports.registerRoleProvider = registerRoleProvider;
module.exports.getRoleGroups = getRoleGroups;

module.exports.getRolesForUser = getRolesForUser;
module.exports.searchRoles = searchRoles;


