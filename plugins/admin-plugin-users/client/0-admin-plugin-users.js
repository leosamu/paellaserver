(function() {
	var plugin = angular.module('adminPluginUsers', ['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/users/, "ADMIN");
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/roles/, "ADMIN");
		
		
		$routeProvider
			.when('/admin/users', {
				templateUrl: 'admin-plugin-users/views/users-list.html',
				controller: "AdminUsersListController"
			})
			.when('/admin/users/edit/:id', {
				templateUrl: 'admin-plugin-users/views/users-edit.html',
				controller: "AdminUsersEditController"
			})
			.when('/admin/users/new', {
				templateUrl: 'admin-plugin-users/views/users-new.html',
				controller: "AdminUsersNewController"
			})

			.when('/admin/roles', {
				templateUrl: 'admin-plugin-users/views/roles-list.html',
				controller: "AdminRolesListController"
			})
			.when('/admin/roles/edit/:id', {
				templateUrl: 'admin-plugin-users/views/roles-edit.html',
				controller: "AdminRolesEditController"
			})
			.when('/admin/roles/new', {
				templateUrl: 'admin-plugin-users/views/roles-new.html',
				controller: "AdminRolesNewController"
			})
	}]);


	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/users", "Users");	
	
})();