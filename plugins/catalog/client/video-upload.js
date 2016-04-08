(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.controller('VideoUploadModalController', [
		"$scope",
		"$translate",
		"$modalInstance",
		"$timeout",
		"videoData",
	function($scope, $translate, $modalInstance, $timeout, videoData) {			
		$scope.updating = false;
		$scope.editing = (videoData!= null);
		
		$scope.video = videoData || {
			published: {
				status: true
			}
		};		
			
		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};
		
		$scope.accept = function() {			
			$modalInstance.close({
				videoData: $scope.video,
				file: $scope.videoFile
			});							
		};
	}]);

	catalogModule.factory('VideoUploadPopup', ['$modal',function($modal) {
		return function() {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl:'catalog/directives/video-upload.html',
				controller:'VideoUploadModalController',	
				resolve:{
					videoData: function() {
						return null;
					}
				}							
			});

			return modalInstance.result
		};
	}]);
	
	catalogModule.factory('VideoEditPopup', ['$modal',function($modal) {
		return function(videoData) {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl:'catalog/directives/video-upload.html',
				controller:'VideoUploadModalController',	
				resolve:{
					videoData: function() {
						return videoData;
					}
				}							
			});

			return modalInstance.result.then(function(result) {return result.videoData;});
		};
	}]);
	
})();