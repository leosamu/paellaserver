(function() {

	var app = angular.module('adminModule', ['AuthorizationRoutesModule', 'adminPluginsModule', "ngRoute", "base64", "angularMoment", "ui.sortable"]);	
	
	
	app.config(['$routeProvider', '$translateProvider', 'AuthorizationRoutesProvider', function($routeProvider, $translateProvider, AuthorizationRoutesProvider) {
				
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin/, "ADMINISTRATION_UI");
		
		$routeProvider
			.when('/admin', {
				templateUrl: 'admin/views/main.html',
				controller: "AdminController"
			})
			.when('/admin/unauthorized', {
				templateUrl: 'admin/views/unauthorized.html',
				controller: "AdminUnauthorizedController"
			})
	}]);		
		
		
	app.run(['$rootScope', 'AuthorizationRoutes', function($rootScope, AuthorizationRoutes) {	 	
		$rootScope.$on('$routeChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (toState && toState.$$route && toState.$$route.originalPath) {
				if (toState.$$route.originalPath != '/admin/unauthorized') {
					AuthorizationRoutes.check(toState.$$route.originalPath);
				}
			}
		});	
	}]);
	
})();