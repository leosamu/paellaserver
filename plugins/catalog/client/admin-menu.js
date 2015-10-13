(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('adminMenu',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/admin-menu.html",
			scope: {
				currentUser:"=",
				currentChannel:"="
			},
			controller: ['$scope','$translate',
				'Channel',
				'Video',
				'ChannelEditPopup',
				'VideoEditPopup',
				'Authorization',
				'ChannelListPopup',
				'AuthorSearch',
				'User',
				'UploadQueue',
				function ($scope,$translate,Channel,Video,ChannelEditPopup,VideoEditPopup,Authorization,ChannelListPopup,AuthorSearch,User,UploadQueue) {
				$scope.status = {
					isopen: false
				};

				$scope.showMenu = function() {
					return $scope.currentUser!=null;
				};

				$scope.createChannel = function() {
					ChannelEditPopup(null, function(channelData) {
						Channel.create(channelData).$promise
							.then(function(data) {
								location.reload();
							});
					});
				};

				$scope.removeChannel = function() {
					if (Authorization($scope.currentChannel, $scope.currentUser).canWrite() &
						confirm($translate.instant("confirm_channel_remove_message"))) {
						Channel.remove($scope.currentChannel).$promise
							.then(function(result) {
								location.href = '/';
							});
					}
				};

				$scope.editChannel = function() {
					if (Authorization($scope.currentChannel, $scope.currentUser).canWrite() && $scope.currentChannel) {
						ChannelEditPopup($scope.currentChannel, function (channelData) {
							if (channelData.owner && channelData.owner.forEach) {
								channelData.owner.forEach(function(item, index, array) {
									array[index] = item._id;
								});
							}
							Channel.update(channelData).$promise
								.then(function(result) {
									location.reload();
								});
						})
					}
				};

				$scope.canWriteChannel = function() {
					return $scope.currentChannel &&
						$scope.currentChannel.id &&
						Authorization($scope.currentChannel, $scope.currentUser).canWrite();
				};

				$scope.canUploadPolimedia = function() {
					return Authorization(null,$scope.currentUser).haveRole(['ADMIN','POLIMEDIA']);
				};

				$scope.createPolimedia = function() {
					VideoEditPopup(null, true, 'polimedia', function(videoData) {
						Video.create(videoData).$promise
							.then(function(data) {
								// Show video data
								UploadQueue().addVideo(data);
							});
					});
				};

				$scope.editVideo = function(videoData) {
					switch (typeof(videoData)) {
						case 'string':
							var id = videoData;
							break;
						case 'object':
							var id = videoData.id || videoData._id;
							break;
						default:
							// TODO: error
					}

					Video.get({ id:id }).$promise
						.then(function(data) {
							VideoEditPopup(data, true, null, function(newVideoData) {
								newVideoData.id = id;
								Video.update(newVideoData).$promise
									.then(function(result) {
										location.reload();
									});
							});
						});
				};

				$scope.showUnprocessedVideos = function() {
					Video.unprocessed().$promise
						.then(function(data) {
							ChannelListPopup(data, false, function(selectedVideo) {
								$scope.editVideo(selectedVideo);
							});
						});
				};

				$scope.showVideosByAuthor = function() {
					AuthorSearch(function(selectedAuthor) {
						User.videos({ id:selectedAuthor.id }).$promise
							.then(function(data) {
								ChannelListPopup(data, false, function(selectedVideo) {
									$scope.editVideo(selectedVideo);
								});
							});
					});
				};
			}]
		};
	});

})();

