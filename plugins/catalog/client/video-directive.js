(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('videoItem',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/video-item.html",
			scope: {
				video: "=",
				isAdmin: "=?",
				isSearch: "=?",
				showParents: "=?"
			},
			controller: ['$scope','Video', function ($scope,Video) {
				$scope.parents = [];
				$scope.isAdmin = $scope.isAdmin || false;
				$scope.isSearch = $scope.isSearch || false;
				$scope.showParents = $scope.showParents || true;

				$scope.isVisible = function () {
					if ($scope.isSearch) {
						return !$scope.video.hiddenInSearches;
					}
					else {
						return !$scope.video.hidden;
					}
				}

				$scope.loadParents = function() {
					Video.parents({id:$scope.video._id}).$promise
						.then(function(result) {
							$scope.parents = result.list;
						});
					$scope.parents = [];
				};

				$scope.openVideo = function() {
					if ($scope.isAdmin || $scope.isVisible()) {
						window.open("player/?id=" + $scope.video._id + "&autoplay=true");
					}
				};

				$scope.ownerName = function() {
					var contactData = $scope.video.owner.length ? $scope.video.owner[0].contactData:{};
					return contactData ? contactData.name + " " + contactData.lastName:"anonymous";
				};

				$scope.thumbnail = function() {
					return $scope.video.thumbnail || 'resources/images/video-placeholder.jpg';
				};
			}]
		};
	});

})();

