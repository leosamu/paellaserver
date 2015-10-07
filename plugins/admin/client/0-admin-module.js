(function() {
	var app = angular.module('adminModule',["ngRoute", "base64", "angularMoment"]);

	
	app.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider
			.when('/admin', {
				templateUrl: 'admin/views/main.html',
				controller: "AdminController"
			})
			
			.when('/admin/videos', {
				templateUrl: 'admin/views/videos-list.html',
				controller: "AdminVideosListController"
			})
			.when('/admin/videos/edit/:id', {
				templateUrl: 'admin/views/videos-edit.html',
				controller: "AdminVideosEditController"
			})
			
			.when('/admin/channels', {
				templateUrl: 'admin/views/channels-list.html',
				controller: "AdminChannelsListController"
			})
			
			
	}]);
		
	app.run(['$rootScope', '$http', '$location', function($rootScope, $http, $location) {
		$rootScope.$on('$routeChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (/^\/admin/.test(toState.$$route.originalPath) == true) {
				$http.get('/rest/currentUser').then(function(res){
					var isAdmin = res.data.roles.some(function(r) { return (r.isAdmin == true); });
					
					if (isAdmin == false) {
						$location.path('/auth/login');
					}
				});
			}
		});	
	}]);
	
})();