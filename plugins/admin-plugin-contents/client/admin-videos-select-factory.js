(function() {
	var app = angular.module('adminPluginVideos');



	app.controller("AdminVideosSelectController", ['$scope',  "$modalInstance", '$timeout', '$base64', 'VideoCRUD', 'Filters', 'videosSelected', 
	function($scope, $modalInstance, $timeout, $base64, VideoCRUD, Filters, videosSelected) {	
		
		$scope.selectedvideos = [];
		$scope.selectableFilters = Filters.$get('video');
		$scope.state = {itemsPerPage:"5"}
		


		$scope.$watch('state.videoFilters', function(){ 
			if ($scope.state.videoFilters) {
				var final_query = Filters.makeQuery($scope.state.videoFilters.filters || [], $scope.state.videoFilters.searchText);
				$scope.filterQuery = $base64.encode(JSON.stringify(final_query));
				$scope.reloadVideos();
			}
		}, true );

		$scope.$watch('currentPage', function(){ $scope.reloadVideos(); });



		$scope.reloadVideos = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				VideoCRUD.search({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.videos = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};		


		$scope.existsVideoInChannel= function(v) {
			if (videosSelected) {
				return videosSelected.some(function(i){ return i._id == v._id;});				
			}
			else {
				return false;
			}
		}


		$scope.getVideoThumbnail = function(v) {
			try {
				if (v.thumbnail) {
					if  (v.thumbnail.startsWith("http")) {
						return v.thumbnail;
					}
					else {			
						return v.repository.server + v.repository.endpoint + v._id +"/" + v.thumbnail;
					}
				}
			}
			catch(err) {}			
			return "resources/images/video-placeholder.png";
		};

		
		$scope.switchSelectVideo = function(v) {
			v.selected = !(v.selected==true);
			
			if (v.selected) {
				$scope.selectedvideos.push(v);
			}
			else {
				var index = $scope.selectedvideos.indexOf(v);
				if (index > -1) {
				    $scope.selectedvideos.splice(index, 1);
				}
			}
		}
		
		
		$scope.close = function() {
			$modalInstance.dismiss();
		}
		
		$scope.accept = function() {
			$modalInstance.close($scope.selectedvideos);
		}
		
	}]);
	
	
	app.factory('AdminVideosSelect', ['$modal',function($modal) {
		return function(options) {
			options = options || {};
			
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl:'admin-plugin-contents/views/modal/admin-videos-select.html',
				controller:'AdminVideosSelectController',	
				resolve:{
					videosSelected: function () { return options.videosSelected}
				}							
			});

			return modalInstance.result;
		};
	}]);	
	
})();