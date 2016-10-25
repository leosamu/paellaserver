(function() {
	var app = angular.module('adminPluginVideos');



	app.controller("AdminChannelsSelectController", ['$scope',  "$modalInstance", '$timeout', '$base64', 'ChannelCRUD', 'Filters', 'channelsSelected', 
	function($scope, $modalInstance, $timeout, $base64, ChannelCRUD, Filters, channelsSelected) {	
		
		$scope.selectedChannels = [];
		$scope.selectableFilters = Filters.$get('channel');
		$scope.state = {itemsPerPage:"5"}
		


		$scope.$watch('state.channelFilters', function(){ 
			if ($scope.state.channelFilters) {
				var final_query = Filters.makeQuery($scope.state.channelFilters.filters || [], $scope.state.channelFilters.searchText);
				$scope.filterQuery = $base64.encode(JSON.stringify(final_query));
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


		$scope.existsChannelInChannel= function(ch) {
			if (channelsSelected) {
				return channelsSelected.some(function(i){ return i._id == ch._id;});				
			}
			else {
				return false;
			}
		}


		$scope.getChannelThumbnail = function(c) {
			try {
				if (c.thumbnail) {
					if  (c.thumbnail.startsWith("http")) {
						return c.thumbnail;
					}
					else {			
						return c.repository.server + c.repository.endpoint + c._id +"/channels/" + c.thumbnail;
					}
				}
			}
			catch(err) {}			
			return "resources/images/channel-placeholder.png";
		};	

		
		$scope.switchSelectChannel = function(ch) {
			ch.selected = !(ch.selected==true);
			
			if (ch.selected) {
				$scope.selectedChannels.push(ch);
			}
			else {
				var index = $scope.selectedChannels.indexOf(ch);
				if (index > -1) {
				    $scope.selectedChannels.splice(index, 1);
				}
			}
		}
		
		
		$scope.close = function() {
			$modalInstance.dismiss();
		}
		
		$scope.accept = function() {
			$modalInstance.close($scope.selectedChannels);
		}
		
	}]);
	
	
	app.factory('AdminChannelsSelect', ['$modal',function($modal) {
		return function(options) {
			options = options || {};
			
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl:'admin-plugin-contents/views/modal/admin-channels-select.html',
				controller:'AdminChannelsSelectController',	
				resolve:{
					channelsSelected: function () { return options.channelsSelected}
				}							
			});

			return modalInstance.result;
		};
	}]);	
	
})();