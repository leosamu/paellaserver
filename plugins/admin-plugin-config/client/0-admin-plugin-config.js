(function() {
	var plugin = angular.module('adminPluginConfig',['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/config/, "ADMIN");
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/repositories/, "ADMIN");
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/catalogs/, "ADMIN");
		
		$routeProvider
			.when('/admin/config', {
				templateUrl: 'admin-plugin-config/views/config-main.html',
				controller: "AdminConfigController"
			})
			.when('/admin/repositories', {
				templateUrl: 'admin-plugin-config/views/config-main.html',
				controller: "AdminConfigController"
			})
			.when('/admin/catalogs', {
				templateUrl: 'admin-plugin-config/views/catalogs-list.html',
				controller: "AdminCatalogsListController"
			})
			.when('/admin/catalogs/new', {
				templateUrl: 'admin-plugin-config/views/catalogs-new.html',
				controller: "AdminCatalogsNewController"
			})
			.when('/admin/catalogs/edit/:id', {
				templateUrl: 'admin-plugin-config/views/catalogs-edit.html',
				controller: "AdminCatalogsEditController"
			})
	}]);


	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/config", "Configuration");	
	
})();