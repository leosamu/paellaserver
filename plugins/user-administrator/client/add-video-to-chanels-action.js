(function() {
	var plugin = angular.module('userAdminModule');

	plugin.run(['ItemActions', 'ChannelsSelect', '$http', '$q', function(ItemActions, ChannelsSelect, $http, $q) {

		ItemActions.registerAction(
			{
				label: "Add videos to channels",
				context: ["user-videos-list"],
				
				roles: [],
				isDisabled: function(items) {
					return (items.length <=0);
				},
				
				beforeRun: function(items) {
					return ChannelsSelect(true)
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
				
				runAction: function(item, params) {

					var promises = [];
					params.forEach(function(channel){						
						var p = $http.get('/rest/plugins/user-administrator/channels/' + channel._id)
						.then(function successCallback(response) {
							var ch = response.data;
							if (angular.isArray(ch.videos) == false) {
								ch.videos = [];
							}
							if ( ch.videos.some(function(v){return (v._id==item._id);}) == false) {
								ch.videos.push(item._id);
							}
							return $http.put('/rest/plugins/user-administrator/channels/' + channel._id, ch)
						});
						
						promises.push(p);
					});					
					
					return $q.all(promises);
				}
			}
		);
	}]);

	
})();