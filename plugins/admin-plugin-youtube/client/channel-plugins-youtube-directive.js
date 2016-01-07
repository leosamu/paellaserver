(function() {
	var plugin = angular.module('adminPluginYoutube');
	
	
	plugin.directive('channelPluginYoutube', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'admin-plugin-youtube/views/directives/channel-plugin-youtube.html'
		};
	});
	
})();