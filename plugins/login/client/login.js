(function() {
	var loginModule = angular.module('loginModule', ["ngRoute", "ngResource", "ui.bootstrap"]);

	function LoginController($scope,$routeParams) {
		$scope.error = Number($routeParams.error);

		$scope.getError = function() {
			switch ($scope.error) {
				case 401:
					return "Invalid user or password";
				case 403:
					return "Insufficient privileges";
			}
		};
	}

	LoginController.$inject = ["$scope","$routeParams"];
	loginModule.controller('LoginController',LoginController);

	loginModule.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/auth/local',{
				templateUrl: 'login/views/main.html',
				controller: "LoginController"
			})
			.when('/auth/local/:error',{
				templateUrl: 'login/views/main.html',
				controller: "LoginController"
			})
			.when('/auth/login',{
				redirectTo:'/auth/local'
			});
	}]);
})();
