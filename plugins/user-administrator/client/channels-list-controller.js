(function() {
	var app = angular.module('userAdminModule');


	app.controller("UserAdminListChannelsController", ['$scope', '$http', '$timeout', '$cookies', '$modal', 'UserAdminState', 'User', 'Channel', 'ChannelEditPopup', 'MessageBox',
	function($scope, $http, $timeout, $cookies, $modal, UserAdminState, User, Channel, ChannelEditPopup, MessageBox) {
	
		$scope.state = UserAdminState;
		$scope.currentPage=1;
//		$scope.filterQuery = null;
//		$scope.selectableFilters = Filters.$get('video');
		$scope.timeoutReload = null;
//		$scope.timeoutSearchText = null;			
		$scope.state.channelsSort = $scope.state.channelsSort || 'date';
		

		User.current().$promise
		.then(function(data) {
			if (data._id=="0") {
				location.href = "#/auth/login";
			}
		});
		
		
		
		$scope.$watch('selectAll', function(value, old){
			if (value != old) {
				try{
					$scope.channels.list.forEach(function(c){
						c.selected = value;
					});
				}
				catch(e) {}
			}
		});				
		$scope.$watch('state.channelSearchText', function(value, old){
			if (value != old) {
				$scope.reloadChannelsWithTimer();
			}
		});					
		$scope.$watch('state.channelsSort', function(value, old){
			if (value != old) {
				$scope.reloadChannels();
			}
		});					
		$scope.$watch('currentPage', function(){ $scope.reloadChannels(); });

				
				
		$scope.reloadChannelsWithTimer = function() {
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}					
			$scope.timeoutReload = $timeout(function() {	
				$scope.reloadChannels();
				$scope.timeoutReload = null;
			}, 1000);
		};
						
		$scope.reloadChannels = function(){
			$scope.loadingVideos = true;			
			var searchText = $scope.state.channelSearchText || '';
									
			$http.get('/rest/plugins/user-administrator/channels?limit='+$scope.state.itemsPerPage+'&skip='+($scope.currentPage-1)*$scope.state.itemsPerPage+"&q="+searchText+"&sort="+$scope.state.channelsSort)
			.then(
				function successCallback(response) {
					$scope.channels = response.data;
					$scope.loadingChannels = false
				},
				function errorCallback(response) {
					$scope.loadingChannels = false
				}
			);				
		}
		

		$scope.newChannel = function() {
			ChannelEditPopup(null)
			.then(function(channelData) {
				return Channel.create(channelData).$promise;
			})					
			.then(function(channel) {
				location.reload();
			});
		};
		
	
		
		$scope.editChannel = function(channelId) {
			Channel.get({ id:channelId }).$promise
			.then(function(data) {
				delete(data.slides);
				delete(data.blackboard);
				delete(data.source);
				delete(data.thumbnail);					
				delete(data.search);
			
				ChannelEditPopup(data)
				.then(function(newChannelData) {								
					newChannelData.id = newChannelData._id;
					return Channel.update(newChannelData).$promise;
				})
				.then(function(result) {
					location.reload();
				});
			});
		};		
		
		$scope.canDeleteChannel = function(v) {
			return true;
		}
		
		$scope.deleteChannel = function(ch) {
			var reloadVideos = $scope.reloadVideos;
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteChannel.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.channel = ch;
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
					
						$http.delete('/rest/plugins/user-administrator/channels/' + ch._id)
						.then(
							function successCallback(response) {
								$modalInstance.close();
								location.reload();
							},
							function errorCallback(response) {
								$modalInstance.close();
								MessageBox("Error", "An error has happened deleting the channel.");
							}
						);					
					};
				}
			});
		};		
		
		
		$scope.$watch('currentPage', function(){ $scope.reloadChannels(); });
		
				
		
	}]);		
	
})();