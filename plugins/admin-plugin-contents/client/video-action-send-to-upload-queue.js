(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', 'UploadQueue', function(Actions, $q, UploadQueue) {

		Actions.registerAction(
			{
				context: "video",			
				label: "Send to upload queue",
				isDisabled: function(items) {
					return (items.length == 0);
				},
				
				beforeRun: function(items) {
					items.forEach(function(v){
						UploadQueue().addVideo({
							_id: v._id,
							title: v.title
						});
					});
					
					var deferred = $q.defer();
					deferred.reject("");
					return deferred.promise;
				}
			}
		);				
	}]);	
})();