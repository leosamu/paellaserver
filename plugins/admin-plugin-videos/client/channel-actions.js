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
						var html = "<h1>Listado de videos</h1><ul>";
						resolve.forEach(function(ch){						
							if (ch.videos) {
								ch.videos.forEach(function(v){
									html = html + "<li>https://media.upv.es/player/?id=" + v._id + '</li>';
									console.log(v._id);								
								});
							}
						});
						
						html = html + '</ul>';
						var modalInstance = $modal.open({
							template: html
						});						
					});
										
					
					//deferred.resolve({});
					
//					return modalInstance.result;					
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