(function() {
	var app = angular.module('adminPluginTranslectures');
	
	
	app.directive('catalogPluginTranslectures', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'admin-plugin-translectures/views/directives/catalog-plugin-translectures.html'
		};
	});
	
})();