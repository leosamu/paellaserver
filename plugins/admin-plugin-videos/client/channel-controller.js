(function() {
	var app = angular.module('adminPluginVideos');

	
	app.controller("AdminChannelsEditController", ["$scope","$routeParams", "ChannelCRUD", "VideoCRUD", "AdminState", function($scope, $routeParams, ChannelCRUD, VideoCRUD, AdminState) {
		$scope.state = AdminState;
		$scope.channel = ChannelCRUD.get({id: $routeParams.id});
		$scope.updating = false;
		
		$scope.channel.$promise.then(function(channel){
			if (!channel.metadata) {
				channel.metadata = {};
			}
			if (channel && channel.metadata &&	(typeof(channel.metadata.keywords)=="string")) {
				channel.metadata.keywords = channel.metadata.keywords.split(",");
			}
			$scope.channel = channel;
		});


		/*
		window.onbeforeunload = function() {
			if (true)
				return "¿Seguro que quieres salir?";
		}

		*/
		
		
		$scope.updateChannel = function() {
			$scope.updating = true;		
			ChannelCRUD.update($scope.channel).$promise.then(
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
	
	
	app.controller("AdminChannelsListController", ["$scope", "$modal", "$base64", "$timeout", "ChannelCRUD", "Filters", "Actions", "AdminState", 
	function($scope, $modal, $base64, $timeout, ChannelCRUD, Filters, Actions, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get("channel");;
		$scope.channelActions = Actions.$get("channel");
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;	
	
	
	
	
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
				ChannelCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.channels = data;
					$scope.loadingChannels = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};
	
	
		$scope.deleteChannel = function(id) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteChannel.html',
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
			
			var selectedChannels= [];			
			$scope.channels.list.forEach(function(v){
				if (v.selected) {
					selectedChannels.push(v);
				}
			});						
				
			Actions.runAction(action, selectedChannels);
		};	
	}]);
	
	
})();