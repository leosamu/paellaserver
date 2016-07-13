(function() {
	var app = angular.module('adminModule');

	
	app.controller("AdminController", ['$scope', 'AdminPlugin', 'User', function($scope, AdminPlugin, User) {	
		$scope.plugins = AdminPlugin;
		
		User.current().$promise.then(function(currentUser) {
			$scope.currentUser = currentUser;
		});
		
	}]);


	app.controller("AdminUnauthorizedController", ['$scope', function($scope) {
	}]);		
	
})();