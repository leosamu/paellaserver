(function() {
	var app = angular.module('adminPluginYoutube');
	
	
	app.controller("AdminYoutubeVideosListController", ["$scope", "$modal", "$base64", "$timeout", "VideoCRUD", "Filters", "AdminState", "MessageBox", "VideosSelect", "Actions",
	function($scope, $modal, $base64, $timeout, VideoCRUD, Filters, AdminState, MessageBox, VideosSelect, Actions) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get('youtube-videos');
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
				var qq = Filters.makeQuery($scope.state.videoFilters.filters || [], $scope.state.videoFilters.searchText);
				
				var final_query = {"$and": [
					qq,
					{"$or":[
						{"pluginData.youtube.id": {"$ne": null}},
						{"pluginData.youtube.task": {"$ne": null}}
					]}
				]};
				$scope.filterQuery = $base64.encode(unescape(encodeURIComponent(JSON.stringify(final_query))));
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



		$scope.viewYoutubeInfo = function(v) {			
			var modalInstance = $modal.open({
				templateUrl: 'youTubeInfo.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.pluginData = v.pluginData.youtube;
					
					$scope.accept = function () {
						$modalInstance.close();							
					};
				}
			});
		};
		
		
		$scope.isWaitingToUpload = function(v) {		
			if (v && v.pluginData && v.pluginData.youtube) {
				return (v.pluginData.youtube.id==null) && (v.pluginData.youtube.task!=null);
			}
			else {
				return false;
			}		
		};		
		
		
		$scope.uploadVideoToYoutube = function() {
			VideosSelect().then(function(selectedVideos) {
				Actions.runActionById('upload-to-youtube', selectedVideos);
			});			
		}
	}]);
	
	
})();