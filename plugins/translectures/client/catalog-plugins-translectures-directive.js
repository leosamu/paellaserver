(function() {
	var app = angular.module('translecturesAdmin');
	
	
	app.directive('catalogPluginTranslectures', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "="
			},		
			templateUrl: 'translectures/views/directives/catalog-plugin-translectures.html'
		};
	});
	
})();