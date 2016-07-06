(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('catalogContents',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/catalog-contents.html",
			scope: {
				currentChannel: "=",
				channels: "=",
				videos: "=",
				myVideos: "=",
				myChannels: "=",
				isAdmin: "=?",
				currentUser: "=?",
				showParents: "=?",
				currentTab: "=?",
				isSearch: "=?"
			},
			controller: ['$scope',function ($scope,Channel) {
				$scope.isAdmin = $scope.isAdmin || false;
				$scope.showParents = $scope.showParents || true;
				$scope.currentTab = $scope.currentTab || 0;
				$scope.isSearch = $scope.isSearch || false;
				$scope.currentUser = $scope.currentUser || null;

				$scope.channelTabSelected = function() {
					return $scope.currentTab == 0;
				};

				$scope.videoTabSelected = function() {
					return $scope.currentTab == 1;
				};

				$scope.myVideosTabSelected = function() {
					return $scope.currentTab == 2;
				};

				$scope.myChannelsTabSelected = function() {
					return $scope.currentTab == 3;
				};
			}]
		};
	});

})();

