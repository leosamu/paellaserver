(function() {
	var app = angular.module('pluginUPVVideoapuntes');
	
	
	app.directive('videoPluginSakai', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "=id"
			},		
			templateUrl: 'sakai/views/directives/video-plugin-sakai.html'
		};
	});
	
})();