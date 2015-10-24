(function() {
	var plugin = angular.module('adminPluginConfig',['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/config/, "ADMIN");
		
		$routeProvider
			.when('/admin/config', {
				templateUrl: 'admin-plugin-config/views/config-main.html',
				controller: "AdminConfigController"
			})
	}]);


	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/config", "Configuration");	
	
})();