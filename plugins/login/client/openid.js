(function() {
	var loginModule = angular.module('loginModule');

	function OpenIdController($scope) {
		$scope.identifierUpvOpenId = "yo.rediris.es";
	}

	OpenIdController.$inject = ["$scope"];

	loginModule.directive('loginOpenId', function() {
		return {
			restrict: "E",
			templateUrl:"login/directives/login-openid.html",
			controller:OpenIdController
		};
	});
})();