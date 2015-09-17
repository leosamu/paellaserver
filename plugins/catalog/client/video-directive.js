(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('videoItem',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/video-item.html",
			scope: {
				video: "=",
				userChannels:"=",
				isAdmin: "=?",
				isSearch: "=?",
				showParents: "=?"
			},
			controller: ['$scope','Video','Channel','ChannelListPopup', function ($scope,Video,Channel,ChannelListPopup) {
				$scope.parents = [];
				$scope.isAdmin = $scope.isAdmin || false;
				$scope.isSearch = $scope.isSearch || false;
				$scope.showParents = $scope.showParents || true;

				$scope.showParentChannels = function() {
					ChannelListPopup($scope.parents, true);
				};

				$scope.isVisible = function () {
					if ($scope.isSearch) {
						return !$scope.video.hiddenInSearches;
					}
					else {
						return !$scope.video.hidden;
					}
				};

				$scope.addToChannel = function() {
					ChannelListPopup($scope.userChannels, false, function(parentChannel) {
						Channel.addVideo({ id:parentChannel._id, videoId:$scope.video._id },
							{ id:'@id', videoId:'@videoId'}).$promise
							.then(function(result) {
								console.log(result);
							});

//						alert("Añadir video " + $scope.video.title + " al canal " + parentChannel.title);
					});
				};

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

