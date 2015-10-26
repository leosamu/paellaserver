(function() {
	var app = angular.module('adminPluginDB');
	
	
	app.directive('videoPluginTranslectures', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'admin-plugin-db/views/directives/video-plugin-translectures.html'
		};
	});


	app.directive('videoPluginYoutube', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'admin-plugin-db/views/directives/video-plugin-youtube.html'
		};
	});

	
})();