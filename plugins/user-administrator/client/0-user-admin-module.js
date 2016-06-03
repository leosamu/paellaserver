(function() {

	var app = angular.module('userAdminModule', ['ngCookies', 'ngSanitize']);
	
	
	app.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
					
		$routeProvider
		.when('/useradmin', {
			redirectTo: '/useradmin/videos' 
		})
		.when('/useradmin/videos', {
			templateUrl: 'user-administrator/views/videos.html',
			controller: "UserAdminListVideosController"
		})
		.when('/useradmin/channels', {
			templateUrl: 'user-administrator/views/channels-list.html',
			controller: "UserAdminListChannelsController"
		})
		.when('/useradmin/channels/:id', {
			templateUrl: 'user-administrator/views/channels-edit.html',
			controller: "UserAdminEditChannelController"
		})



		/*
		.when('/useradmin/profile', {
			templateUrl: 'user-administrator/views/userprofile.html',
			controller: "UserAdminUserProfileController"
		})
		*/
		
	}]);		
	
})();