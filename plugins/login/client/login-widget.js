(function() {
	var loginModule = angular.module('loginModule');

	loginModule.directive('loginWidget', function() {
		return {
			restrict: "E",
			templateUrl:"login/directives/login-widget.html",
			controller:["$scope","$http", function($scope,$http) {
				$scope.logged = false;
				$scope.userName = "";

				$http.get('/rest/currentUser')
					.success(function(data) {
						$scope.logged = true;
						$scope.userName = data.contactData.name;
					})
					.error(function() {
						$scope.logged = false;
					});
			}]
		};
	});
})();