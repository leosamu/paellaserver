(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.directive('videoPluginPolitube', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'admin-plugin-contents/views/directives/video-plugin-politube.html'
		};
	});
	
})();