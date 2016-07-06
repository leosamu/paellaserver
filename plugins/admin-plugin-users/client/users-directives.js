(function() {
	var app = angular.module('adminPluginUsers');
	
	
	app.directive('userauthPluginPolimedia', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				id: "="
			},
			templateUrl: 'admin-plugin-users/views/directives/userauth-plugin-polimedia.html'
		};
	});	
	
	
	app.directive('userauthPluginUpv', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				id: "="
			},		
			templateUrl: 'admin-plugin-users/views/directives/userauth-plugin-upv.html'
		};
	});		
	
	
})();