(function() {
	var app = angular.module('userAdminModule');


	app.service('UserAdminState', function () {
		this.itemsPerPage = '10';
	});	


	app.controller("UserAdminListVideosController", ['$scope', '$http', '$timeout', '$cookies', '$modal', 'UserAdminState', 'User', 'Video', 'VideoEditPopup', 'VideoUploadPopup', 'MessageBox',
	function($scope, $http, $timeout, $cookies, $modal, UserAdminState, User, Video, VideoEditPopup, VideoUploadPopup, MessageBox) {
	
		$scope.state = UserAdminState;
		$scope.currentPage=1;
//		$scope.filterQuery = null;
//		$scope.selectableFilters = Filters.$get('video');
		$scope.timeoutReload = null;
//		$scope.timeoutSearchText = null;			
		$scope.state.videosSort = $scope.state.videosSort || 'date';
		

		User.current().$promise
		.then(function(data) {
			if (data._id=="0") {
				location.href = "#/auth/login";
			}
		});
				
		
		$scope.$watch('selectAll', function(value, old){
			if (value != old) {
				try{
					$scope.videos.list.forEach(function(v){
						v.selected = value;
					});
				}
				catch(e) {}
			}
		});				
		$scope.$watch('state.videoSearchText', function(value, old){
			if (value != old) {
				$scope.reloadVideosWithTimer();
			}
		});					
		$scope.$watch('state.videosSort', function(value, old){
			if (value != old) {
				$scope.reloadVideos();
			}
		});					
		$scope.$watch('currentPage', function(){ $scope.reloadVideos(); });
			
			
			
		$scope.reloadVideosWithTimer = function() {
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}					
			$scope.timeoutReload = $timeout(function() {	
				$scope.reloadVideos();
				$scope.timeoutReload = null;
			}, 1000);
		};
				
		$scope.reloadVideos = function(){
			
			$scope.loadingVideos = true;
			
			var searchText = $scope.state.videoSearchText || '';
			
			$http.get('/rest/plugins/user-administrator/videos?limit='+$scope.state.itemsPerPage+'&skip='+($scope.currentPage-1)*$scope.state.itemsPerPage+"&q="+searchText+"&sort="+$scope.state.videosSort)
			.then(
				function successCallback(response) {
					$scope.videos = response.data;
					$scope.loadingVideos = false
				},
				function errorCallback(response) {
					$scope.loadingVideos = false
				}
			);				
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
		
		$scope.editVideo = function(video) {
			var videoId = video._id;
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
		
		$scope.showLinks = function(video) {
			var modalInstance = $modal.open({
				templateUrl: 'showLinksVideo.html',
				size: 'lg',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.video = video;
					$scope.vsize = "640x360";
						
					try {
						var v = $scope.video.source.videos[0];
						if ((v) && (v.src)) {							
							$scope.downloadURL = $scope.video.repository.server + $scope.video.repository.endpoint + video._id + '/polimedia/' + v.src;
						}
						else if ((v) && (v.href)) {
							$scope.downloadURL = v.href;
						}
					}
					catch(e) {}
					
					$scope.$watch('vsize', function(){
						var arr = $scope.vsize.split('x');
						if (arr.length == 2) {
							$scope.vwidth = parseInt(arr[0]);
							$scope.vheight = parseInt(arr[1]);
						}
					});
					
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {					
						$modalInstance.close();
					};
				}
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
					else if ( (v.source.files) && (v.source.files.length > 0) ){
						state = "processing";
					}
					else {
						state = "pendingUpload"; // Temporal Fix
					}
				}
			}
			return state;	
		}
				
	}]);		
	
})();