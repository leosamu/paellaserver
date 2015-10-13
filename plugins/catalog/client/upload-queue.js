(function() {
	var catalogModule = angular.module('catalogModule');


	catalogModule.factory('UploadQueue', [ function UploadQueue() {
		return function(msg) {
			var videoQueue = [];

			function addVideo(videoData) {
				updateQueue();
				videoQueue.push(videoData);
				saveQueue();
			}

			function removeVideo(videoData) {
				updateQueue();
				var videoId = -1;
				videoQueue.some(function(item, index) {
					if ((item._id || item.id) == (videoData._id || videoData.id)) {
						videoId = index;
						return true;
					}
				});

				if (videoId!=-1) {
					videoQueue.splice(videoId,1);
					saveQueue();
				}
			}

			function updateQueue() {
				try {
					videoQueue = JSON.parse($.cookie('uploadQueueData'));
				}
				catch (e) {
					videoQueue = [];
				}
			}

			function saveQueue() {
				$.cookie('uploadQueueData',JSON.stringify(videoQueue));
			}

			return {
				addVideo:function(videoData) {
					addVideo(videoData);
				},

				removeVideo:function(videoData) {
					removeVideo(videoData);
				},

				getQueue:function() {
					updateQueue();
					return videoQueue;
				}
			}
		};
	}]);

	catalogModule.directive('uploadQueue', function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/upload-queue.html",
			scope: {
			},
			controller:["$scope","Upload","UploadQueue",function($scope,Upload,UploadQueue) {
				$scope.queue = [];

				function updateQueue() {
					$scope.queue = UploadQueue().getQueue();
					setTimeout(function() { updateQueue(); }, 2000);
				}

				$scope.removeFromQueue = function(video) {
					UploadQueue().removeVideo(video);
					$scope.queue = UploadQueue().getQueue();
				};

				$scope.upload = function(video,file) {
					var id = video._id || video.id;
					if (id) {
						Upload.upload({
							url:'rest/video/' + id + '/upload',
							file: file
						}).then(function(resp) {
								if (resp.data && resp.data.length) {
									$scope.removeFromQueue(resp.data[0]);
								}
							},
							function(resp) {
								//console.log("error");
							},
							function(evt) {
								//console.log("progress");
							});
					}
				};

				updateQueue();
			}]
		}
	})
})();