(function() {
	var loginModule = angular.module('loginModule', ["ngRoute", "ngResource", "ui.bootstrap"]);

	function LoginController($scope,$location,$routeParams) {
		$scope.redirectUrl = $location.$$search.redirect;

		$scope.errorCode = Number($routeParams.error);

		$scope._loginMethod = 'local';

		$scope.setLoginMethod = function(method) {
			$scope._loginMethod = method;
		};

		$scope.loginMethod = function() {
			return $scope._loginMethod;
		};

		$scope.isLoginLocal = function() { return $scope._loginMethod=='local'; };
		$scope.isLoginUpv = function() { return $scope._loginMethod=='upv'; };
		$scope.isLoginOpenID = function() { return $scope._loginMethod=='openid'; };
	}

	LoginController.$inject = ["$scope","$location","$routeParams"];
	loginModule.controller('LoginController',LoginController);

	loginModule.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/auth/login',{
				templateUrl: '/login/views/main.html',
				controller: "LoginController"
			})
			.when('/auth/login/:error',{
				templateUrl: '/login/views/main.html',
				controller: "LoginController"
			});
	}]);
})();
