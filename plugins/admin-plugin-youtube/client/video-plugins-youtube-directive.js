(function() {
	var plugin = angular.module('adminPluginYoutube');
	
	
	plugin.directive('videoPluginYoutube', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'admin-plugin-youtube/views/directives/video-plugin-youtube.html'
		};
	});
		
	
})();