(function() {
	var app = angular.module('adminPluginDB');
	
	
	app.directive('translecturesVideoPlugin', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'admin-plugin-db/views/directives/video-plugin-translectures.html'
		};
	});


	app.directive('youtubeVideoPlugin', function(){
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