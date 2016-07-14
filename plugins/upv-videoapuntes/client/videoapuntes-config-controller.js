(function() {
	var plugin = angular.module('pluginUPVVideoapuntes');

		
	plugin.controller("VideoapuntesConfigController", ["$scope", "$http", "MessageBox",  function($scope, $http, MessageBox) {
		$scope.config = {}		
		$scope.loading = true;
		$http.get('/rest/plugins/upv-videoapuntes/config')
		.then(
			function successCallback(response) {
				$scope.config = response.data;
				$scope.loading = false
			},
			function errorCallback(response) {
				$scope.loadingVideos = false
			}
		);		
		
		$scope.updateConfig = function() {
			$http.patch('/rest/plugins/upv-videoapuntes/config', $scope.config);
		};
	}]);
})();