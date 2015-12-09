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
			controller: ['$scope','Channel', 'ChannelEditPopup','ChannelListPopup','Authorization', function ($scope,Channel,ChannelEditPopup,ChannelListPopup,Authorization) {
				$scope.parents = [];
				$scope.isAdmin = $scope.isAdmin || false;
				$scope.isSearch = $scope.isSearch || false;
				
				$scope.isEmbed = /embed/i.test(window.location.href);
				$scope.showIfNotEmbed = !$scope.isEmbed;
				
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

				$scope.allowEdit = function() {
					return Authorization($scope.channel,$scope.currentUser).canWrite();
				};

				$scope.editChannel = function() {
					var channelData = $scope.channel;

					Channel.get({ id:channelData._id }).$promise
						.then(function(channelData) {
							ChannelEditPopup(channelData, function (channelData) {
								channelData.id = channelData._id;
								Channel.update(channelData).$promise
									.then(function(result) {
										location.reload();
									});
							});
						});
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
					return Authorization($scope.currentChannel,$scope.currentUser).canWrite() &&
							$scope.currentChannel &&
							$scope.currentChannel.title &&
							$scope.currentChannel.title!="";
				};

				$scope.showParentChannels = function() {
					ChannelListPopup($scope.parents, true);
				};

				$scope.addToChannel = function() {
					ChannelListPopup($scope.userChannels, false, function(parentChannel) {
						Channel.addChannel({ id:parentChannel._id, childId:$scope.channel._id },
							{ id:'@id', childId:'@childId'}).$promise
							.then(function(result) {
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

