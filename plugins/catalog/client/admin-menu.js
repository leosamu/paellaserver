(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('adminMenu',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/admin-menu.html",
			scope: {
				currentUser:"=",
				currentChannel:"="
			},
			controller: ['$scope','$translate','Channel','ChannelEditPopup','Authorization', function ($scope,$translate,Channel,ChannelEditPopup,Authorization) {
				$scope.status = {
					isopen: false
				};

				$scope.showMenu = function() {
					return $scope.currentUser!=null;
				};

				$scope.createChannel = function() {
					ChannelEditPopup(null, function(channelData) {
						Channel.create(channelData).$promise
							.then(function(data) {
								location.reload();
							});
					});
				};

				$scope.removeChannel = function() {
					if (Authorization($scope.currentChannel, $scope.currentUser).canWrite() &
						confirm($translate.instant("confirm_channel_remove_message"))) {
						Channel.remove($scope.currentChannel).$promise
							.then(function(result) {
								location.href = '/';
							});
					}
				};

				$scope.editChannel = function() {
					if (Authorization($scope.currentChannel, $scope.currentUser).canWrite() && $scope.currentChannel) {
						ChannelEditPopup($scope.currentChannel, function (channelData) {
							if (channelData.owner && channelData.owner.forEach) {
								channelData.owner.forEach(function(item, index, array) {
									array[index] = item._id;
								});
							}
							Channel.update(channelData).$promise
								.then(function(result) {
									location.reload();
								});
						})
					}
				};

				$scope.canWriteChannel = function() {
					return $scope.currentChannel &&
						$scope.currentChannel.id &&
						Authorization($scope.currentChannel, $scope.currentUser).canWrite();
				};
			}]
		};
	});

})();

