(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', '$modal', function(Actions, $q, $modal) {

		Actions.registerAction(
			{
				label: "Get link to videos (media portal)",
				context: "youtube-video",
				isDisabled: function(items) {
					return (items.length == 0);
				},
				
				beforeRun: function(items) {
					var deferred = $q.defer();
					
					var videos = [];
					items.forEach(function(v) {
						videos.push(v._id);
					});
					
					var modalInstance = $modal.open({
						templateUrl:'admin-plugin-youtube/views/modal/video-links-media.html',
						controller:['$scope', '$modalInstance', 'videos', function($scope, $modalInstance, videos){
							$scope.videos = videos;

							$scope.accept = function () {
								$modalInstance.close();
							};								
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
		
		
		Actions.registerAction(
			{
				label: "Get link to videos (youtube portal)",
				context: "youtube-video",
				isDisabled: function(items) {
					return (items.length == 0);
				},
				
				beforeRun: function(items) {
					var deferred = $q.defer();
					
					var videos = [];
					items.forEach(function(v) {
						videos.push(v);
					});
					
					var modalInstance = $modal.open({
						templateUrl:'admin-plugin-youtube/views/modal/video-links-youtube.html',
						controller:['$scope', '$modalInstance', 'videos', function($scope, $modalInstance, videos){
							$scope.videos = videos;

							$scope.accept = function () {
								$modalInstance.close();
							};								
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