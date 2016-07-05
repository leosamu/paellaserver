(function() {
	var app = angular.module('pluginUPVVideoapuntes');
	
	
	app.directive('channelPluginSakai', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				channelId: "=id"
			},		
			templateUrl: 'sakai/views/directives/channel-plugin-sakai.html'
		};
	});
	
})();