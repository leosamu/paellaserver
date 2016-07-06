(function() {
	var app = angular.module('adminPluginYoutube');


	
	app.controller("AdminYoutubeChannelsListController", ["$scope", "$modal", "$base64", "$timeout", "ChannelCRUD", "Filters", "AdminState", "MessageBox",
	function($scope, $modal, $base64, $timeout, ChannelCRUD, Filters, AdminState, MessageBox) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get("youtube-channels");		
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;	
	
	
		$scope.$watch('selectAll', function(value, old){
			if (value != old) {
				try{
					$scope.channels.list.forEach(function(ch){
						ch.selected = value;
					});
				}
				catch(e) {}
			}
		});
	
		$scope.$watch('state.channelFilters', function(){ 
			if ($scope.state.channelFilters) {
				var qq = Filters.makeQuery($scope.state.channelFilters.filters || [], $scope.state.channelFilters.searchText);
								
				var final_query = {"$and": [
					qq,
					{"catalog": "youtube"}
				]};
				$scope.filterQuery = $base64.encode(unescape(encodeURIComponent(JSON.stringify(final_query))));
				$scope.reloadChannels();
			}
		}, true );
	
		$scope.$watch('currentPage', function(){ $scope.reloadChannels(); });
		
		$scope.reloadChannels = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingChannels = true;
			$scope.timeoutReload = $timeout(function() {			
				ChannelCRUD.search({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.channels = data;
					$scope.loadingChannels = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};
			
		$scope.isWaitingToUpload = function(ch) {		
			if (ch && ch.pluginData && ch.pluginData.youtube) {
				return (ch.pluginData.youtube.id==null) && (ch.pluginData.youtube.task!=null);
			}
			else {
				return false;
			}		
		};			
			
	}]);
	
	
})();