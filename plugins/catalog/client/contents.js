(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('catalogContents',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/catalog-contents.html",
			scope: {
				channels: "=",
				videos: "=",
				myVideos: "=",
				myChannels: "=",
				isAdmin: "=?",
				isSearch: "=?",
				showParents: "=?",
				currentTab: "=?"
			},
			controller: ['$scope',function ($scope,Channel) {
				$scope.isAdmin = $scope.isAdmin || false;
				$scope.isSearch = $scope.isSearch || false;
				$scope.showParents = $scope.showParents || true;
				$scope.currentTab = $scope.currentTab || 0;

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

