(function() {
	var loginModule = angular.module('loginModule');

	loginModule.directive('loginWidget', function() {
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

				$http.get('/rest/currentUser')
					.success(function(data) {
						$scope.logged = data._id!="0";
						$scope.userName = data.contactData.name;
					})
					.error(function() {
						$scope.logged = false;
					});
			}]
		};
	});
})();