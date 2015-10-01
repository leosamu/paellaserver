(function() {
	var app = angular.module('paellaserver');

	app.directive('loaderField', function() {
		return {
			restrict: "E",
			templateUrl:"app/directives/loader-field.html"
		};
	});
})();