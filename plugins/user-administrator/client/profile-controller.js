(function() {
	var app = angular.module('userAdminModule');


	app.controller("UserAdminUserProfileController", ['$scope', '$http', '$timeout', '$cookies', 'User', 'Video', 'VideoEditPopup',
	function($scope, $http, $timeout, $cookies, User, Video, VideoEditPopup) {
			
		User.current().$promise
		.then(function(data) {
			if (data._id=="0") {
				location.href = "#/auth/login";
			}
			else {
				$scope.user = data;
			}
		});		
		
		
		$scope.updateProfile = function() {
			console.log("update user profile:");
			console.log($scope.user);
		}		
		
	}]);		
	
})();