(function() {
	var plugin = angular.module('adminPluginTask',[]);

	plugin.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider
			.when('/admin/tasks', {
				templateUrl: 'admin-plugin-tasks/views/tasks-list.html',
				controller: "AdminTasksListController"
			})
	}]);


	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/tasks", "Tasks");	
	
})();