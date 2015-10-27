(function() {
	var loginModule = angular.module('loginModule');

	loginModule.directive('loginWidget', ['User', function(User) {
		return {
			restrict: "E",
			templateUrl:"login/directives/login-widget.html",
			controller:["$scope","$http", function($scope,$http) {
				$scope.logged = false;
				$scope.userName = "";
				$scope.currentLanguage = $.cookie('language') ||  navigator.lang;

				$scope.setLanguage = function(lang) {
					$.cookie('language',lang);
					location.reload();
				};

				User.current().$promise.then(
					function(data) {
						$scope.logged = data._id!="0";
						$scope.userName = data.contactData.name;
					},
					function() {
						$scope.logged = false;
					}
				);
			}]
		};
	}]);
})();