(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('channelItem',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/channel-item.html",
			scope: {
				channel: "=",
				userChannels:"=",
				currentChannel:"=?",
				isAdmin: "=?",
				isSearch: "=?",
				showParents: "=?",
				currentUser: "=?"
			},
			controller: ['$scope','Channel', 'ChannelListPopup','Authorization', function ($scope,Channel,ChannelListPopup,Authorization) {
				$scope.parents = [];
				$scope.isAdmin = $scope.isAdmin || false;
				$scope.isSearch = $scope.isSearch || false;
				$scope.showParents = $scope.showParents!==undefined ?  $scope.showParents:true;

				$scope.isEditable = function() {

				};

				$scope.isVisible = function() {
					if ($scope.isSearch) {
						return !$scope.channel.hiddenInSearches;
					}
					else {
						return !$scope.channel.hidden;
					}
				};

				$scope.getCurrentChannelTitle = function() {
					return $scope.currentChannel ? $scope.currentChannel.title:"";
				};

				$scope.removeFromCurrentChannel = function() {
					if ($scope.currentChannel) {
						Channel.removeChannel({ id:$scope.currentChannel.id, childId:$scope.channel._id },
							{ id:'@id', childId:'@childId'}).$promise
							.then(function(result) {
								location.reload();
							});
					}
				};

				$scope.loadChannelParents = function() {
					Channel.parents({id:$scope.channel._id}).$promise
						.then(function(result) {
							$scope.parents = result.list;
						});
					$scope.parents = [];
				};

				$scope.allowRemove = function() {
					return Authorization($scope.currentChannel,$scope.currentUser).canWrite();
				};

				$scope.showParentChannels = function() {
					ChannelListPopup($scope.parents, true);
				};

				$scope.addToChannel = function() {
					ChannelListPopup($scope.userChannels, false, function(parentChannel) {
						Channel.addChannel({ id:parentChannel._id, childId:$scope.channel._id },
							{ id:'@id', childId:'@childId'}).$promise
							.then(function(result) {ç
								location.reload();
							});
					});
				};

				$scope.getChannelUrl = function() {
					if ($scope.isAdmin || $scope.isVisible()) {
						return "#/catalog/channel/" + $scope.channel._id;
					}
					else {
						return "";
					}
				};

				$scope.ownerName = function() {
					var contactData = $scope.channel.owner.length ? $scope.channel.owner[0].contactData:{};
					return contactData ? contactData.name + " " + contactData.lastName:"anonymous";
				};

				$scope.thumbnail = function() {
					return $scope.channel.thumbnail || 'resources/images/channel-placeholder.gif';
				};
			}]
		};
	});

})();

