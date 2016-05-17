(function() {
	var app = angular.module('userAdminModule');


	app.controller("UserAdminListVideosController", ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
	
		$scope.currentPage=1;
//		$scope.filterQuery = null;
//		$scope.selectableFilters = Filters.$get('video');
		$scope.timeoutReload = null;
//		$scope.timeoutSearchText = null;			
		$scope.state = {
			itemsPerPage: 10
		};
		
		
		$scope.reloadVideos = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				$http.get('/rest/plugins/user-administrator/videos?limit='+$scope.state.itemsPerPage+'&skip='+($scope.currentPage-1)*$scope.state.itemsPerPage)
				.then(function successCallback(response) {
					$scope.videos = response.data;
					console.log($scope.videos);
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				}, function errorCallback(response) {
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});				
			});	
		}
		
		$scope.$watch('currentPage', function(){ $scope.reloadVideos(); });
		
		
	}]);		
	
})();