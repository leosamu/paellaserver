(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', '$modal', function(Actions, $q, $modal) {

		Actions.registerAction(
			{
				label: "Get link to download mp4",
				context: "video",
				isDisabled: function(items) {
					return (items.length == 0);
				},
				
				beforeRun: function(items) {
					var deferred = $q.defer();
					
					var videos = items;
					
					var modalInstance = $modal.open({
						templateUrl:'admin-plugin-contents/views/modal/video-download-mp4.html',
						controller:['$scope', '$modalInstance', 'videos', function($scope, $modalInstance, videos){
							$scope.videos = videos;

							$scope.accept = function () {
								$modalInstance.close();
							};
							
							$scope.getMP4Url = function(video) {
								var url = "";
								try {
									url = video.repository.server + video.repository.endpoint + video._id + "/polimedia/" + video.source.videos[0].src;
								}
								catch(e) {}
								
								return url;
							}
						}],
						resolve:{
							videos: function() {
								return videos;
							}
						},
						backdrop: true
					});
		
					modalInstance.result.finally(function(result) {
						deferred.reject();
					});
													
					return deferred.promise;					
				},
				
				runAction: function(item, params) {
					var deferred = $q.defer();
					deferred.resolve();
					return deferred.promise;
				}
			}
		);
	}]);	
})();