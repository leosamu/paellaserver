(function() {

	var app = angular.module('videoApuntesNotesModule', []);	
	
	
	app.config(['$routeProvider', function($routeProvider) {
				
		//AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin/, "ADMINISTRATION_UI");
		
		$routeProvider
			.when('/videoapuntes-notes', {
				templateUrl: 'videoapuntes-notes/views/main.html',
				controller: "videoApuntesNotesController"
			})
			.when('/videoapuntes-notes/notes/:noteId',{
				templateUrl:'videoapuntes-notes/views/insertnotes.html',
				controller: "videoApuntesNotesRecordController"
			})			
	}]);		
		
		
	/*app.run(['$rootScope', 'AuthorizationRoutes', function($rootScope, AuthorizationRoutes) {	 	
		$rootScope.$on('$routeChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (toState && toState.$$route && toState.$$route.originalPath) {
				if (toState.$$route.originalPath != '/admin/unauthorized') {
					AuthorizationRoutes.check(toState.$$route.originalPath);
				}
			}
		});	
	}]);*/
	angular.module('adminPluginsModule').registerPlugin(app);
})();