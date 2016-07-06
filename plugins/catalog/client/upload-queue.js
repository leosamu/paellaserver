(function() {
	var catalogModule = angular.module('catalogModule');


	catalogModule.factory('UploadQueue', [ function UploadQueue() {
		return function(msg) {
			var videoQueue = [];

			function addVideo(videoData) {
				updateQueue();
				videoQueue.push({
					_id:videoData._id,
					title:videoData.title
				});
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

			function setProgress(id,event) {
				updateQueue();
				if (videoQueue.some(function(video) {
					if (video.id==id || video._id==id) {
						video.progress = event.loaded / event.total;
						return true;
					}
				})) {
					saveQueue();
				}
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
				},

				progress:function(id,event) {
					setProgress(id,event);
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
			controller:["$scope","$timeout","Upload","UploadQueue",function($scope,$timeout,Upload,UploadQueue) {
				$scope.queue = [];

				function doUpdateQueue() {
					$scope.queue = UploadQueue().getQueue();
				}

				function updateQueue() {
					doUpdateQueue();
					$timeout(function() { updateQueue(); }, 2000);
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
								var url = evt.config.url;
								var id = url.replace('rest/video/','').replace('/upload','');
								UploadQueue().progress(id,evt);
								doUpdateQueue();
							});
					}
				};

				updateQueue();
			}]
		}
	})
})();