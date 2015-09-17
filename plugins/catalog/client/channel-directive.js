(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('channelItem',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/channel-item.html",
			scope: {
				channel: "=",
				userChannels:"=",
				isAdmin: "=?",
				isSearch: "=?",
				showParents: "=?"
			},
			controller: ['$scope','Channel', 'ChannelListPopup', function ($scope,Channel,ChannelListPopup) {
				$scope.parents = [];
				$scope.isAdmin = $scope.isAdmin || false;
				$scope.isSearch = $scope.isSearch || false;
				$scope.showParents = $scope.showParents!==undefined ?  $scope.showParents:true;

				$scope.isVisible = function() {
					if ($scope.isSearch) {
						return !$scope.channel.hiddenInSearches;
					}
					else {
						return !$scope.channel.hidden;
					}
				};

				$scope.loadChannelParents = function() {
					Channel.parents({id:$scope.channel._id}).$promise
						.then(function(result) {
							$scope.parents = result.list;
						});
					$scope.parents = [];
				};

				$scope.showParentChannels = function() {
					ChannelListPopup($scope.parents, true);
				};

				$scope.addToChannel = function() {
					ChannelListPopup($scope.userChannels, false, function(parentChannel) {
						alert("Añadir canal " + $scope.channel.title + " al canal " + parentChannel.title);
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

