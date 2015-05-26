(function() {
	var app = angular.module('paellaserver');

	app.directive('langWidget', function() {
		return {
			restrict: "E",
			templateUrl:"app/directives/language-widget.html",
			scope: {
				showKlingon:"="
			},
			controller:["$scope", function($scope) {
				$scope.currentLanguage = $.cookie('language') ||  navigator.lang;

				$scope.setLanguage = function(lang) {
					$.cookie('language',lang);
					location.reload();
				};
			}]
		};
	});
})();