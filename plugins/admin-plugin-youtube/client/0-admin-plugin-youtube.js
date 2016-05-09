(function() {
	var plugin = angular.module('adminPluginYoutube',['AuthorizationRoutesModule']);
	
	
	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/youtube\/videos/, "YOUTUBE_UPLOADER");
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/youtube\/channels/, "YOUTUBE_UPLOADER");
		
		$routeProvider
			.when('/admin/youtube/videos', {
				templateUrl: 'admin-plugin-youtube/views/videos-list.html',
				controller: "AdminYoutubeVideosListController"
			})
			
			.when('/admin/youtube/channels', {
				templateUrl: 'admin-plugin-youtube/views/channels-list.html',
				controller: "AdminYoutubeChannelsListController"
			})			
	}]);	
	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/youtube/videos", "Youtube");
})();