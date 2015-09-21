
(function() {
	angular.module('catalogModule')
		.factory("Authorization", [ function AuthorizationFactory() {
			return function(resource,user) {
				function getRoles(u) {
					var roles = [];
					if (u && u.roles && u.roles.forEach) {
						u.roles.some(function(r) {
							roles.push(r);
							return r.isAdmin;	// If the user is administrator, this role can do anything
						});
					}
					return roles;
				}

				function getPermissions(r) {
					var permissions = [];
					if (r) {
						if (!r.permissions) {	// Default permissions
							// Anonymous can read
							permissions.push({
								role:'ANONYMOUS',
								write: false,
								read: true
							});

							// User can read
							permissions.push({
								role:'USER',
								write: false,
								read: true
							});

							// Owner can write
							if (r.owner) {
								r.owner.forEach(function(own) {
									permissions.push({
										role: 'ROLE_' + (typeof(own)=='object' ? own._id:own),
										write: true,
										read: true
									});
								});
							}
						}
						else {	// Specific permissions
							permissions = r.permissions;
						}
					}
					return permissions;
				}

				function checkPermission(check) {
					var result = false;
					var roles = getRoles(user);
					var permissions = getPermissions(resource);
					roles.some(function(r) {
						permissions.some(function(p) {
							if (p.role==r._id && p[check]) {
								result = true;
							}
							return result;
						});
						return result;
					});

					return result;
				}

				return {
					canRead: function() {
						return checkPermission('read');
						/*
						var canRead = false;
						var roles = getRoles(user);
						var permissions = getPermissions(resource);


						roles.some(function(r) {
							permissions.some(function(p) {
								if (p.role==r._id && p.read) {
									canRead = true;
								}
								return canRead;
							});
							return canRead;
						});

						return canRead;
						*/
					},

					canWrite: function() {
						return checkPermission('write');
						/*
						var canWrite = false;
						var roles = getRoles(user);
						var permissions = getPermissions(resource);

						roles.some(function(r) {
							permissions.some(function(p) {
								if (p.role==r._id && p.write) {
									canWrite = true;
								}
								return canWrite;
							});
							return canWrite;
						});

						return canWrite;
						*/
					}
				}
			};
		}]);
})();