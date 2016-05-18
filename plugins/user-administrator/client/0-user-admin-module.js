(function() {

	var app = angular.module('userAdminModule', ['ngCookies']);
	
	
	app.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
					
		$routeProvider
		.when('/useradmin', {
			redirectTo: '/useradmin/videos' 
		})
		.when('/useradmin/videos', {
			templateUrl: 'user-administrator/views/videos.html',
			controller: "UserAdminListVideosController"
		})

	}]);		
	
})();