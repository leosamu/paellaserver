(function() {
	var plugin = angular.module('pluginUPVVideoapuntes', ['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/videoapuntes/, "VIDEOAPUNTES_ADMIN");
		
		$routeProvider
		.when('/admin/videoapuntes', {
			templateUrl: 'upv-videoapuntes/views/config.html',
			controller: "VideoapuntesConfigController"
		})		


		.when('/videoapuntes/student/:id', {
			templateUrl: 'upv-videoapuntes/views/lti/student.html',
			controller: "VideoapuntesLTIStudentController"
		})		
		.when('/videoapuntes/teacher/:id', {
			templateUrl: 'upv-videoapuntes/views/lti/teacher.html',
			controller: "VideoapuntesLTITeacherController"
		})		

			
	}]);	

	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/videoapuntes", "Videoapuntes");	
	
})();

