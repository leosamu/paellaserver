(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', 'ChannelCRUD', '$modal', function(Actions, $q, ChannelCRUD, $modal) {

		Actions.registerAction(
			{
				label: "Get link to videos",
				context: "channel",
				beforeRun: function(items) {
					var deferred = $q.defer();
					
					var promises = [];
					items.forEach(function(ch){
						var p = ChannelCRUD.get({id: ch._id}).$promise;
						promises.push(p);
					});
					
					$q.all(promises)
					.then(function(resolve){
						var videos = [];
						resolve.forEach(function(ch){						
							if (ch.videos) {
								ch.videos.forEach(function(v) {
									videos.push(v._id);
								});
							}
						});
						
						var modalInstance = $modal.open({
							templateUrl:'admin-plugin-contents/views/modal/video-links.html',
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