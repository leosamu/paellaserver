(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('videoItem',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/video-item.html",
			scope: {
				video: "=",
				userChannels:"=",
				currentChannel:"=?",
				isAdmin: "=?",
				isSearch: "=?",
				showParents: "=?",
				currentUser: "=?"
			},
			controller: ['$scope','Video','Channel','ChannelListPopup','Authorization','VideoEditPopup', function ($scope,Video,Channel,ChannelListPopup,Authorization,VideoEditPopup) {
				$scope.parents = [];
				$scope.isAdmin = $scope.isAdmin || false;
				$scope.isSearch = $scope.isSearch || false;
				
				$scope.isEmbed = /embed/i.test(window.location.href);
				$scope.showIfNotEmbed = !$scope.isEmbed;
				
				$scope.showParents = $scope.showParents || true;

				$scope.showParentChannels = function() {
					ChannelListPopup($scope.parents, true);
				};

				$scope.getCurrentChannelTitle = function() {
					return $scope.currentChannel ? $scope.currentChannel.title:"";
				};

				$scope.removeFromCurrentChannel = function() {
					if ($scope.currentChannel) {
						Channel.removeVideo({ id:$scope.currentChannel.id, videoId:$scope.video._id },
							{ id:'@id', videoId:'@videoId'}).$promise
							.then(function(result) {
								location.reload();
							});
					}
				};

				$scope.isVisible = function () {
					if ($scope.video.unprocessed) {
						return false;
					}
					else if ($scope.isSearch) {
						return !$scope.video.hiddenInSearches;
					}
					else {
						return !$scope.video.hidden;
					}
				};

				$scope.allowRemove = function() {
					return Authorization($scope.currentChannel,$scope.currentUser).canWrite() &&
						$scope.currentChannel &&
						$scope.currentChannel.title &&
						$scope.currentChannel.title!="";
				};

				$scope.allowEdit = function() {
					return Authorization($scope.video,$scope.currentUser).canWrite();
				};

				$scope.editVideo = function() {
					var videoData = $scope.video;

					Video.get({ id:videoData._id }).$promise
						.then(function(data) {
							VideoEditPopup(data, true, null, function(newVideoData) {
								newVideoData.id = newVideoData._id;
								Video.update(newVideoData).$promise
									.then(function(result) {
										location.reload();
									});
							});
						});
				};

				$scope.addToChannel = function() {
					ChannelListPopup($scope.userChannels, false, function(parentChannel) {
						Channel.addVideo({ id:parentChannel._id, videoId:$scope.video._id },
							{ id:'@id', videoId:'@videoId'}).$promise
							.then(function(result) {
								location.reload();
							});
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

