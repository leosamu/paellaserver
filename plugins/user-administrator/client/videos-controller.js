(function() {
	var app = angular.module('userAdminModule');


	app.controller("UserAdminListVideosController", ['$scope', '$http', function($scope, $http) {
	
	
		$http.get('/rest/plugins/user-administrator/videos')
		.then(function successCallback(response) {
			console.log("ok");
			console.log(response);
		}, function errorCallback(response) {
			console.log("mal");
		});
	}]);		
	
})();