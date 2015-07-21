(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('channelItem',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/channel-item.html",
			scope: {
				channel: "=",
				isAdmin: "=?",
				isSearch: "=?",
				showParents: "=?"
			},
			controller: ['$scope','Channel', function ($scope,Channel) {
				$scope.parents = [];
				$scope.isAdmin = $scope.isAdmin || false;
				$scope.isSearch = $scope.isSearch || false;
				$scope.showParents = $scope.showParents || true;

				function isVisible() {
					if ($scope.isSearch) {
						return !$scope.channel.hiddenInSearches;
					}
					else {
						return !$scope.channel.hidden;
					}
				}

				$scope.loadChannelParents = function() {
					Channel.parents({id:$scope.channel._id}).$promise
						.then(function(result) {
							$scope.parents = result.list;
						});
					$scope.parents = [];
				};

				$scope.getChannelUrl = function() {
					if ($scope.isAdmin || isVisible()) {
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

