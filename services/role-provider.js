var Q = require('q');


/**
 * `RoleProvider` constructor.
 */
function RoleProvider(roleGroup) {
	this._roleGroup = roleGroup;
} 


RoleProvider.prototype.getRoleGroup = function() {
	return this._roleGroup;
}



RoleProvider.prototype.getRolesForUser = function(user) {
	throw new Error('RoleProvider#getRolesForUser must be overridden by subclass');
}


RoleProvider.prototype.searchRoles = function(searchtext) {
	throw new Error('RoleProvider#serachRoles must be overridden by subclass');
}


module.exports = RoleProvider;
