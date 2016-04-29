(function() {
	var catalogModule = angular.module('catalogModule');


	catalogModule.controller('VideoUploadModalController', [ "$scope", '$modal', "$modalInstance", "Upload", "videoData",
	function($scope, $modal, $modalInstance, Upload, videoData) {
		$scope.updating = false;
		$scope.editing = (videoData!= null);
		$scope.uploadPercentage = 0;
		$scope.upload = null;
		$scope.visibility="public";
		
		$scope.video = videoData || {
			published: {
				status: true
			}
		};		
				
		$scope.$watch('visibility', function() {
			if ($scope.visibility == 'public') {
				$scope.video.hidden = false;
				$scope.video.hiddenInSearches = false;
				$scope.video.published = {
					status: true
				}
			}			
			else if ($scope.visibility == 'private') {
				$scope.video.hidden = true;
				$scope.video.hiddenInSearches = true;
				$scope.video.published = {
					status: false
				}
				
			}			
			else if ($scope.visibility == 'hidden') {
				$scope.video.hidden = true;
				$scope.video.hiddenInSearches = true;
				$scope.video.published = {
					status: true
				}
			}			
		});
		
		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};
		
		$scope.accept = function() {
			$scope.updating = true;
					
		
			var modalInstance = $modal.open({
				templateUrl: 'uploadingVideoMessageBox.html',
				size: '',
				backdrop: true,
				resolve:{
					videoData: function() {
						return {videoData: $scope.video, file: $scope.videoFile};
					}
				},				
				
				controller: function ($scope, $modalInstance, videoData) {
					$scope.updating = true;
					$scope.uploadPercentage = 0;
					
					$scope.upload = Upload.upload({
						url: '/rest/video/new',
						data: videoData,
					});
					
					$scope.upload.then(
						function(){
							$scope.updating = false;
							//$modalInstance.close();
						},
						function(){
							$scope.upload = null;
							$scope.updating = false;
							$modalInstance.dismiss();
						},
						function (evt) {
							$scope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);					
						}
					);
					
					$scope.cancel = function () {						
						if ($scope.upload) {
							$scope.upload.abort();
							$scope.upload = null;
						}
						$scope.updating = false;
						$modalInstance.dismiss();
					};
					
					$scope.accept = function () {
						$modalInstance.close();
					};
				}
			});
			
			modalInstance.result.then(
				function(){ 
					$modalInstance.close();
				},
				function() {
					$scope.updating = false;
				}
			);
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