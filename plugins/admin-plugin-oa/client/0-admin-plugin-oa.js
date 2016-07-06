(function() {
	var plugin = angular.module('adminPluginOA', ['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/oa/, "ADMINISTRATION_OA");
		
		$routeProvider
			.when('/admin/oa', {
				templateUrl: 'admin-plugin-oa/views/oa-list.html',
				controller: "AdminOAListController"
			})
	}]);

	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/oa", "OAs");	
	
})();