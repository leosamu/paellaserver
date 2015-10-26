(function() {
	var app = angular.module('adminPluginVideos');
	
	
	
	app.controller("AdminVideosEditController", ["$scope","$routeParams", "$window", "MessageBox", "VideoCRUD", function($scope, $routeParams, $window, MessageBox, VideoCRUD){	
		$scope.video = VideoCRUD.get({id: $routeParams.id});
		$scope.updating = false;
				
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
	
	
	app.controller("AdminVideosListController", ["$scope", "$modal", "$base64", "$timeout", "VideoCRUD", "Filters", "Actions", "AdminState", 
	function($scope, $modal, $base64, $timeout, VideoCRUD, Filters, Actions, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get('video');
		$scope.videoActions = Actions.$get("video");
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;


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


		$scope.deleteVideo = function(id) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteVideo.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						console.log("TODO")
						$modalInstance.close();
					};
				}
			});
		};
		
		$scope.doAction = function(action) {
			
			var selectedVideos= [];			
			$scope.videos.list.forEach(function(v){
				if (v.selected) {
					selectedVideos.push(v);
				}
			});						
				
			Actions.runAction(action, selectedVideos);
		};
	}])
	
	
})();