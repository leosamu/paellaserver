(function() {
	var loginModule = angular.module('loginModule');

	loginModule.directive('loginUpv', function() {
		return {
			restrict: "E",
			templateUrl:"login/directives/login-upv.html"
		};
	});
})();