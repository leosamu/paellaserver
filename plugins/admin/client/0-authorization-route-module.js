(function() {

	var app = angular.module('AuthorizationRoutesModule', []);
	
		
	app.provider('AuthorizationRoutes', [ function(){
		var authRoutes = [];
		
		return {			
			addAuthorizationRoute: function(route, role) {
				authRoutes.push({route: route, role: role});
			},
			
			$get: ['$location', 'Authorization', 'User', function($location, Authorization, User) {
				return {
					check: function(originalPath) {						
						var rolesToTest = []
						authRoutes.forEach(function(r) {
							if (r.route.test(originalPath) == true) {
								rolesToTest.push(r.role);
							}
						});
						
						rolesToTest.forEach(function(role) {
							User.current().$promise.then(function(currentUser) {
								var resource = {
									"permissions" : [{
										"role" : role,
										"write" : true,
										"read" : true
									}]
								};
								var auth = Authorization(resource, currentUser)
								if (currentUser._id == 0) {
									$location.path('/auth/login');
								}
								else if (auth.canRead() == false) {
									$location.path('/admin/unauthorized');
								}
							});
						});
					}
				}
			}]
		}
		
	}]);
		
	
})();