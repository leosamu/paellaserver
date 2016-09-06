(function() {
	var plugin = angular.module('adminPluginTasks', ['AuthorizationRoutesModule', 'angular-cron-jobs']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/tasks/, "ADMIN");
		
		$routeProvider
			.when('/admin/tasks', {
				templateUrl: 'admin-plugin-tasks/views/tasks-list.html',
				controller: "AdminTasksListController"
			})
			.when('/admin/scheduler', {
				templateUrl: 'admin-plugin-tasks/views/scheduler-list.html',
				controller: "AdminSchedulerListController"
			})
			
			
			
	}]);


	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/tasks", "Tasks");	
	
})();