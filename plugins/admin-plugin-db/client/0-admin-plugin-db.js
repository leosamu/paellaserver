(function() {
	var plugin = angular.module('adminPluginDB',[]);

	plugin.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider
			.when('/admin/videos', {
				templateUrl: 'admin-plugin-db/views/videos-list.html',
				controller: "AdminVideosListController"
			})
			.when('/admin/videos/edit/:id', {
				templateUrl: 'admin-plugin-db/views/videos-edit.html',
				controller: "AdminVideosEditController"
			})
			
			.when('/admin/channels', {
				templateUrl: 'admin-plugin-db/views/channels-list.html',
				controller: "AdminChannelsListController"
			})			
			.when('/admin/channels/edit/:id', {
				templateUrl: 'admin-plugin-db/views/channels-edit.html',
				controller: "AdminChannelsEditController"
			})
			
			.when('/admin/users', {
				templateUrl: 'admin-plugin-db/views/users-list.html',
				controller: "AdminUsersListController"
			})
			.when('/admin/users/edit/:id', {
				templateUrl: 'admin-plugin-db/views/users-edit.html',
				controller: "AdminUsersEditController"
			})
			.when('/admin/users/new', {
				templateUrl: 'admin-plugin-db/views/users-new.html',
				controller: "AdminUsersNewController"
			})

			.when('/admin/roles', {
				templateUrl: 'admin-plugin-db/views/roles-list.html',
				controller: "AdminRolesListController"
			})
			.when('/admin/roles/edit/:id', {
				templateUrl: 'admin-plugin-db/views/roles-edit.html',
				controller: "AdminRolesEditController"
			})
			.when('/admin/roles/new', {
				templateUrl: 'admin-plugin-db/views/roles-new.html',
				controller: "AdminRolesNewController"
			})
			
	}]);


	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/videos", "Data Base");	
	
})();