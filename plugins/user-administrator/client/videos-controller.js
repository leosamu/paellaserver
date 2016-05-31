(function() {
	var app = angular.module('userAdminModule');


	app.controller("UserAdminListVideosController", ['$scope', '$http', '$timeout', '$cookies', '$modal', 'User', 'Video', 'VideoEditPopup', 'VideoUploadPopup', 'MessageBox',
	function($scope, $http, $timeout, $cookies, $modal, User, Video, VideoEditPopup, VideoUploadPopup, MessageBox) {
	
		$scope.currentPage=1;
//		$scope.filterQuery = null;
//		$scope.selectableFilters = Filters.$get('video');
		$scope.timeoutReload = null;
//		$scope.timeoutSearchText = null;			
		$scope.itemsPerPage = $cookies.get('itemsPerPage') || '10';
		

		User.current().$promise
		.then(function(data) {
			if (data._id=="0") {
				location.href = "#/auth/login";
			}
		});
				
		
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
				.then(
					function successCallback(response) {
						$scope.videos = response.data;
						$scope.loadingVideos = false
						$scope.timeoutReload = null;
					},
					function errorCallback(response) {
						$scope.loadingVideos = false
						$scope.timeoutReload = null;
					}
				);				
			});	
		}
		
		$scope.uploadVideo = function() {
			VideoUploadPopup().then(
				function (response) {
					location.reload();
				},
				function (response) {
					location.reload();
				}
			);
		};
		
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
		
		$scope.canDeleteVideo = function(v) {
			return !(v && v.pluginData && v.pluginData.OA && (v.pluginData.OA.isOA == true) || false);
		}
		
		$scope.deleteVideo = function(v) {
			var reloadVideos = $scope.reloadVideos;
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteVideo.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.video = v;
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
					
						$http.delete('/rest/plugins/user-administrator/videos/' + v._id)
						.then(
							function successCallback(response) {
								$modalInstance.close();
								location.reload();
							},
							function errorCallback(response) {
								$modalInstance.close();
								MessageBox("Error", "An error has happened deleting the video.");					
							}
						);					
					};
				}
			});
		};		
		
		
		$scope.$watch('currentPage', function(){ $scope.reloadVideos(); });
		
		$scope.getVideoState = function(v) {
			var state = "error";

			if ( (v) && (v.source) && (v.source.videos) ) {
				if (v.source.videos.length > 0) {
					state = 'ready';
				}
				else if (v.source.masters) {
					if (v.source.masters.task) {
						if (v.source.masters.task.error) {
							state = "error";
						}
						else if (v.source.masters.task.processing) {
							state = "processing";
						}
						else {
							state = "queue";
						}
					}
				}
			}
			return state;	
		}
				
	}]);		
	
})();