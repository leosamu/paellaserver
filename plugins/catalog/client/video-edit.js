(function() {
	var catalogModule = angular.module('catalogModule');


	catalogModule.controller('VideoEditModalController', [ "$scope", "$modalInstance", "videoData",
	function($scope, $modalInstance, videoData) {			
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

	
	catalogModule.factory('VideoEditPopup', ['$modal',function($modal) {
		return function(videoData) {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl:'catalog/directives/video-edit.html',
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