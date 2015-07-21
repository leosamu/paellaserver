(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('searchBar',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/search-bar.html",
			scope: {
				channels: "=",
				videos: "=",
				myVideos: "=",
				searchText: "=",
				doSearchFunction: "=",
				currentTab: "=?",
				showSearch: "=?",
				showSort: "=?",
				showMyVideos: "=?",
				showEmptyTabs: "=?"
			},
			controller: ['$scope',function ($scope,Channel) {
				$scope.currentTab = $scope.currentTab || 0;
				$scope.showSearch = $scope.showSearch || true;
				$scope.showSort = $scope.showSort || true;
				$scope.showMyVideos = $scope.showMyVideos!==undefined ? $scope.showMyVideos:true;
				$scope.showEmptyTabs = $scope.showEmptyTabs!==undefined ? $scope.showEmptyTabs:true;


				$scope.showChannels = function() {
					if ($scope.numChannels()>0) {
						$scope.currentTab = 0;
						return true;
					}
					return false;
				};

				$scope.showVideos = function() {
					if ($scope.numVideos()>0) {
						$scope.currentTab = 1;
						return true;
					}
					return false;
				};

				$scope.showMyVideos = function() {
					if (!$scope.logged) {
						location.href = "#/auth/login"
					}
					else if ($scope.numMyVideos()>0) {
						$scope.currentTab = 2;
						return true;
					}
					return false;
				};

				$scope.numVideos = function() {
					return $scope.videos.length;
				};

				$scope.numChannels = function() {
					return $scope.channels.length;
				};

				$scope.numMyVideos = function() {
					return $scope.myVideos.length;
				};

				$scope.channelTabSelected = function() {
					return $scope.currentTab == 0;
				};

				$scope.videoTabSelected = function() {
					return $scope.currentTab == 1;
				};

				$scope.myVideosTabSelected = function() {
					return $scope.currentTab == 2;
				};

				$scope.sortDefault = function() {
					function sortFunction(a,b) {
						if (a.defaultSortingIndex < b.defaultSortingIndex) {
							return -1;
						}
						else if (a.defaultSortingIndex > b.defaultSortingIndex) {
							return 1;
						}
						else {
							return 0;
						}
					}

					$scope.channels.sort(sortFunction);
					$scope.videos.sort(sortFunction);
					$scope.myVideos.sort(sortFunction);
				};

				$scope.sortName = function() {
					function sortFunction(a,b) {
						a = a.title.trim().toLowerCase();
						b = b.title.trim().toLowerCase();
						if (a < b) {
							return -1;
						}
						else if (a > b) {
							return 1;
						}
						else {
							return 0;
						}
					}

					$scope.channels.sort(sortFunction);
					$scope.videos.sort(sortFunction);
					$scope.myVideos.sort(sortFunction);
				};

				$scope.sortDate = function() {
					function sortFunction(a,b) {
						a = new Date(a.creationDate);
						b = new Date(b.creationDate);
						if (a > b) {
							return -1;
						}
						else if (a < b) {
							return 1;
						}
						else {
							return 0;
						}
					}

					$scope.channels.sort(sortFunction);
					$scope.videos.sort(sortFunction);
					$scope.myVideos.sort(sortFunction);
				};

				$scope.sortAuthor = function() {
					function sortFunction(a,b) {
						a = a.owner.length && a.owner[0].contactData && a.owner[0].contactData.name;
						b = b.owner.length && b.owner[0].contactData && b.owner[0].contactData.name;
						if (a < b) {
							return -1;
						}
						else if (a > b) {
							return 1;
						}
						else {
							return 0;
						}
					}

					$scope.channels.sort(sortFunction);
					$scope.videos.sort(sortFunction);
					$scope.myVideos.sort(sortFunction);
				};

			}]
		};
	});

})();

