(function() {
	var app = angular.module('userAdminModule');


	app.controller("UserAdminListVideosController", ['$scope', '$http', '$timeout', '$cookies', 'Video', 'VideoEditPopup',
	function($scope, $http, $timeout, $cookies, Video, VideoEditPopup) {
	
		$scope.currentPage=1;
//		$scope.filterQuery = null;
//		$scope.selectableFilters = Filters.$get('video');
		$scope.timeoutReload = null;
//		$scope.timeoutSearchText = null;			
		$scope.itemsPerPage = $cookies.get('itemsPerPage') || '10';
		
		
		$scope.$watch('itemsPerPage', function(value){
			$cookies.put('itemsPerPage', value);
		});
		
		$scope.reloadVideos = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				$http.get('/rest/plugins/user-administrator/videos?limit='+$scope.itemsPerPage+'&skip='+($scope.currentPage-1)*$scope.itemsPerPage)
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
		
		$scope.editVideo = function(videoId) {
			Video.get({ id:videoId }).$promise
			.then(function(data) {
				delete(data.slides);
				delete(data.blackboard);
				delete(data.source);
				delete(data.thumbnail);					
				delete(data.search);
			
				VideoEditPopup(data)
				.then(function(newVideoData) {								
					newVideoData.id = newVideoData._id;
					return Video.update(newVideoData).$promise;
				})
				.then(function(result) {
					location.reload();
				});
			});
		};		
		
		
		$scope.$watch('currentPage', function(){ $scope.reloadVideos(); });
		
		
		
		
		
		
	}]);		
	
})();