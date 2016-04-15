(function() {
	var catalogModule = angular.module('catalogModule');


	catalogModule.controller('VideoUploadModalController', [ "$scope", "$modalInstance", "Upload", "videoData",
	function($scope, $modalInstance, Upload, videoData) {
		$scope.updating = false;
		$scope.editing = (videoData!= null);
		$scope.uploadPercentage = 0;
		$scope.upload = null;
		
		$scope.video = videoData || {
			published: {
				status: true
			}
		};		
			
		$scope.abort_upload = function()
		{
			if (upload) {
				$scope.upload.abort();
				$scope.upload = null;
			}
			$scope.updating = false;
		}
			
		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};
		
		$scope.accept = function() {
			$scope.updating = true;
			$scope.upload = Upload.upload({
				url: '/rest/video/new',
				data: {videoData: $scope.video, file: $scope.videoFile},
			});
			
			$scope.upload.then(
				function(){
					$modalInstance.close();
				},
				function(){
					$scope.upload = null;
					$scope.updating = false;
				},
				function (evt) {
					$scope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);					
				}
			)		
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

			return modalInstance.result;
		};
	}]);
		
})();