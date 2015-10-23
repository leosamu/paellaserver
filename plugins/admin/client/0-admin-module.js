(function() {

	var app = angular.module('adminModule',['adminPluginsModule', "ngRoute", "base64", "angularMoment", "ui.sortable"]);	
	
	app.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider
			.when('/admin', {
				templateUrl: 'admin/views/main.html',
				controller: "AdminController"
			})
	}]);
		
		
		
	app.run(['$rootScope', '$location', 'User', 'Authorization', function($rootScope, $location, User, Authorization) {
		$rootScope.$on('$routeChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (toState) {
				if (/^\/admin/.test(toState.$$route.originalPath) == true) {
				
					User.current().$promise.then(function(currentUser){
						
						var AdminUIResource = {
							"permissions" : [ 
								 {
								 "role" : "ADMIN",
								 "write" : true,
								 "read" : true
								 }
							]
						};
						
						var auth = Authorization(AdminUIResource, currentUser)
						if (auth.canRead() == false) {
							$location.path('/auth/login');
						}					
					})
				}
			}
			/*
			else {
				$location.path('/auth/login');
			}
			*/
		});	
	}]);
	
})();