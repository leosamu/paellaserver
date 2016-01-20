(function() {
	var plugin = angular.module('adminPluginOA');
	
	
	plugin.directive('channelPluginOa', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				channelId: "="
			},		
			templateUrl: 'admin-plugin-oa/views/directives/channel-plugin-oa.html'
		};
	});
	
})();