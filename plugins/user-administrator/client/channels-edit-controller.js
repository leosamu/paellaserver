(function() {
	var app = angular.module('userAdminModule');


	app.controller("UserAdminEditChannelController", ['$scope', "$routeParams", '$http', '$timeout', '$cookies', '$modal', 'User', 'Channel', 'ChannelEditPopup', 'MessageBox',
	function($scope, $routeParams, $http, $timeout, $cookies, $modal, User, Channel, ChannelEditPopup, MessageBox) {
	
		User.current().$promise
		.then(function(data) {
			if (data._id=="0") {
				location.href = "#/auth/login";
			}
		});				

		$scope.newChannel = function() {
			ChannelEditPopup(null)
			.then(function(channelData) {
				return Channel.create(channelData).$promise;
			})					
			.then(function(channel) {
				location.reload();
			});
		};
		
		$scope.loading = true;
		$scope.errorLoading = false;
		$http.get('/rest/plugins/user-administrator/channels/' + $routeParams.id)
		.then(
			function successCallback(response) {
				$scope.channel = response.data;
				$scope.loading = false;
			},
			function errorCallback(response) {
				$scope.loading = false;
				$scope.errorLoading = true;
			}
		);					
		
	}]);		
	
})();