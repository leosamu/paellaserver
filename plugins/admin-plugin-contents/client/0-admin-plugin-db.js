(function() {
	var plugin = angular.module('adminPluginVideos', ['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/videos/, "ADMINISTRATION_UI");
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/channels/, "ADMINISTRATION_UI");
		
		$routeProvider
			.when('/admin/videos', {
				templateUrl: 'admin-plugin-contents/views/videos-list.html',
				controller: "AdminVideosListController"
			})
			.when('/admin/videos/new', {
				templateUrl: 'admin-plugin-contents/views/videos-new.html',
				controller: "AdminVideosNewController"
			})
			.when('/admin/videos/edit/:id', {
				templateUrl: 'admin-plugin-contents/views/videos-edit.html',
				controller: "AdminVideosEditController"
			})
			
			.when('/admin/channels', {
				templateUrl: 'admin-plugin-contents/views/channels-list.html',
				controller: "AdminChannelsListController"
			})			
			.when('/admin/channels/new', {
				templateUrl: 'admin-plugin-contents/views/channels-new.html',
				controller: "AdminChannelsNewController"
			})			
			.when('/admin/channels/edit/:id', {
				templateUrl: 'admin-plugin-contents/views/channels-edit.html',
				controller: "AdminChannelsEditController"
			})
	}]);

	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/videos", "Contents");	
	
})();