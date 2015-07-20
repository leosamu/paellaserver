(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('loader', function () {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/loader.html"
		};
	});
})();
