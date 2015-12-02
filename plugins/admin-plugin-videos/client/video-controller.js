(function() {
	var app = angular.module('adminPluginVideos');
	
	
	
	app.controller("AdminVideosEditController", ["$scope","$routeParams", "$window", "MessageBox", "VideoCRUD", function($scope, $routeParams, $window, MessageBox, VideoCRUD){	
		$scope.updating = false;

		VideoCRUD.get({id: $routeParams.id}).$promise.then(function(v){
			$scope.video = v;
			
			$scope.video.creationDate = new Date($scope.video.creationDate);
			if ($scope.video.published && $scope.video.published.publicationDate) {
				$scope.video.published.publicationDate = new Date($scope.video.published.publicationDate);
			}
		});
				
		$scope.updateVideo = function() {
			$scope.updating = true;
			VideoCRUD.update($scope.video).$promise.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("Video actualizado", "El video se ha actualizado correctamente.");
					}
				},
				function() {
					return MessageBox("Error", "Ha ocurrido un error al actualizar el video.");
				}
			).finally(function(){
				$scope.updating = false;
			});
		}
	}]);
	
	
	app.controller("AdminVideosListController", ["$scope", "$modal", "$base64", "$timeout", "VideoCRUD", "Filters", "AdminState", "MessageBox",
	function($scope, $modal, $base64, $timeout, VideoCRUD, Filters, AdminState, MessageBox) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get('video');
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;


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
				VideoCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.videos = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};


		$scope.deleteVideo = function(v) {
			var reloadVideos = $scope.reloadVideos;
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteVideo.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						VideoCRUD.remove({id: v._id}).$promise
						.then(
							function(){
								$modalInstance.close();
								//reloadVideos();
								v.deletionDate = Date.now();
							},
							function(){
								$modalInstance.close();
								MessageBox("Error", "An error has happened deleting the video.");
							}
						);
					};
				}
			});
		};
		
		
		
		$scope.restoreVideo = function(v) {
			var reloadVideos = $scope.reloadVideos;
			
			var modalInstance = $modal.open({
				templateUrl: 'confirmRestoreVideo.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						VideoCRUD.get({id: v._id}).$promise
						.then(
							function(v2) {
								v2.deletionDate = null;
								return VideoCRUD.update(v2).$promise;
							},
							function(){
								MessageBox("Error", "An error has happened restoring the channel.");
							}
						)
						.then(
							function(){										
								//reloadVideos();
								v.deletionDate = null;
							},
							function(){
								MessageBox("Error", "An error has happened restoring the channel.");
							}
						)
						.finally(function(){
							$modalInstance.close();							
						});
					};
				}
			});
		};
	}]);
	
	
})();