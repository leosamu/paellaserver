(function() {
	var app = angular.module('userAdminModule');


	app.controller("UserAdminListChannelsController", ['$scope', '$http', '$timeout', '$cookies', '$modal', 'User', 'Channel', 'ChannelEditPopup', 'MessageBox',
	function($scope, $http, $timeout, $cookies, $modal, User, Channel, ChannelEditPopup, MessageBox) {
	
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
				
		$scope.reloadChannels = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				$http.get('/rest/plugins/user-administrator/channels?limit='+$scope.itemsPerPage+'&skip='+($scope.currentPage-1)*$scope.itemsPerPage)
				.then(
					function successCallback(response) {
						$scope.channels = response.data;
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