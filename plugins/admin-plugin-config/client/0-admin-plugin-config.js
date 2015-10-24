(function() {
	var plugin = angular.module('adminPluginConfig',[]);

	plugin.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider
			.when('/admin/config', {
				templateUrl: 'admin-plugin-config/views/config-main.html',
				controller: "AdminConfigController"
			})
	}]);


	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/config", "Configuration");	
	
})();