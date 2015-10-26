(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.directive('videoPluginTranslectures', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'admin-plugin-videos/views/directives/video-plugin-translectures.html'
		};
	});


	app.directive('videoPluginYoutube', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'admin-plugin-videos/views/directives/video-plugin-youtube.html'
		};
	});

	
})();