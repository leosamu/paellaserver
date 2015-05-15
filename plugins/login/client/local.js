(function() {
	var loginModule = angular.module('loginModule');

	loginModule.directive('loginLocal', function() {
		return {
			restrict: "E",
			templateUrl:"login/directives/login-local.html",
			scope: {
				error:"="
			},
			controller:["$scope",function($scope) {
				$scope.getError = function() {
					switch ($scope.error) {
						case 401:
							return "Invalid user or password";
						case 403:
							return "Insufficient privileges";
					}
				};
			}]
		};
	});
})();