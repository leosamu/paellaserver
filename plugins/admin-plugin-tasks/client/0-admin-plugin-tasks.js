(function() {
	var plugin = angular.module('adminPluginTasks', ['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/tasks/, "ADMIN");
		
		$routeProvider
			.when('/admin/tasks', {
				templateUrl: 'admin-plugin-tasks/views/tasks-list.html',
				controller: "AdminTasksListController"
			})
	}]);


	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/tasks", "Tasks");	
	
})();