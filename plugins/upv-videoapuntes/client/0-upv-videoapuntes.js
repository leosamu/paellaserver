(function() {
	var plugin = angular.module('pluginUPVVideoapuntes', ['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/videoapuntes/, "VIDEOAPUNTES_ADMIN");
		
		$routeProvider
		.when('/admin/videoapuntes', {
			templateUrl: 'upv-videoapuntes/views/config.html',
			controller: "VideoapuntesConfigController"
		})		
			
	}]);	

	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/videoapuntes", "Videoapuntes");	
	
})();

