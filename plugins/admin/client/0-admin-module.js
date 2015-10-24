(function() {

	var app = angular.module('adminModule',['adminPluginsModule', "ngRoute", "base64", "angularMoment", "ui.sortable"]);	
	
	app.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
		
		$routeProvider
			.when('/admin', {
				templateUrl: 'admin/views/main.html',
				controller: "AdminController"
			})
			.when('/admin/unauthorized', {
				templateUrl: 'admin/views/unauthorized.html',
				controller: "AdminUnauthorizedController"
			})

		function loadDictionary(lang) {
			$.ajax('admin/i18n/' + lang + '.json')
			.success(function(data) {
				$translateProvider.translations(lang, data);
			});
		}

		loadDictionary('es');
		loadDictionary('ca');
	}]);		
		
		
		
	app.run(['$rootScope', '$location', 'User', 'Authorization', function($rootScope, $location, User, Authorization) {
		$rootScope.$on('$routeChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (toState) {
				if (/^\/admin/.test(toState.$$route.originalPath) == true) {				
					User.current().$promise.then(function(currentUser){
						
						var AdminUIResource = {
							"permissions" : [ 
								 {
								 "role" : "ADMIN_UI",
								 "write" : true,
								 "read" : true
								 }
							]
						};
						
						var auth = Authorization(AdminUIResource, currentUser)
						if (auth.canRead() == false) {
							if (currentUser._id == 0) {
								$location.path('/auth/login');
							}
							else {
								$location.path('/admin/unauthorized');								
							}
						}					
					})
				}
			}
		});	
	}]);
	
})();