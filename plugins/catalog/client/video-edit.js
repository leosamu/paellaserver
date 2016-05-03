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
			
		if ( ($scope.video.hidden == false) && ($scope.video.hiddenInSearches == false) && ($scope.video.published.status == true) ){
			$scope.visibility="public";
		}
		else if ( ($scope.video.hidden == true) && ($scope.video.hiddenInSearches == true) && ($scope.video.published.status == false) ){
			$scope.visibility="private";
		}
		else if ( ($scope.video.hidden == true) && ($scope.video.hiddenInSearches == true) && ($scope.video.published.status == true) ){
			$scope.visibility="hidden";
		}
		else {
			$scope.visibility="public";
		}
			
			
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
			$modalInstance.close({
				videoData: $scope.video
			});							
		};
	}]);

	
	catalogModule.factory('VideoEditPopup', ['$modal',function($modal) {
		return function(videoData) {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl:'catalog/directives/video-edit.html',
				controller:'VideoEditModalController',	
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