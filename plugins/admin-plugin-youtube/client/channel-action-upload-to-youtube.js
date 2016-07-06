(function() {
	var plugin = angular.module('adminPluginYoutube');


	plugin.run(['Actions', '$q', '$http', function(Actions, $q, $http) {

		Actions.registerAction(
			{
				label: "Upload channel to Youtube",
				context: "channel",
				role: "YOUTUBE_UPLOADER",
				isDisabled: function(selectedChannels) {
					var disabled = true;
					if (selectedChannels.length > 0) {
						disabled = false;
						selectedChannels.forEach(function(ch){
							if (ch.catalog != 'youtube') {
								disabled = true;
							}
						});
					}
					return disabled;
				},
				runAction: function(ch) {
					return $http.put('/rest/plugins/admin-plugin-youtube/channel/'+ch._id+'/uploadToYoutube');				
				}
			}
		);
	}]);
})();