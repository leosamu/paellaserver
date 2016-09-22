(function() {
	var plugin = angular.module('userAdminModule');

	plugin.run(['ItemActions', 'ChannelsSelect', '$http', '$q', 'runInSequence', 'Channel', function(ItemActions, ChannelsSelect, $http, $q, runInSequence, Channel) {

		ItemActions.registerAction(
			{
				label: "Add videos to channels",
				context: ["user-videos-list"],
				
				roles: [],
				isDisabled: function(items) {
					return (items.length <=0);
				},
				
				beforeRun: function(items) {
					return ChannelsSelect()
					.then(
						function(selectedChannels) {
							if (selectedChannels.length == 0) {
								return false;
							}
							return [true, items, selectedChannels];
						},
						function() {
							return false;
						}
					);
				},
				
				runAction: function(video, channels) {
					return runInSequence(channels, function(ch){						
						return Channel.addVideo({id:ch._id, videoId:video._id}).$promise;
					})
					.then(function(r){
						return $q.all(r);
					});					
				}
			}
		);
	}]);

	
})();