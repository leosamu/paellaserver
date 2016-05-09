(function() {
	var plugin = angular.module('adminPluginYoutube');


	plugin.run(['Actions', '$q', '$http', function(Actions, $q, $http) {

		Actions.registerAction(
			{
				label: "Copy channel to upload to Youtube",
				context: "channel",
				role: "YOUTUBE_UPLOADER",
				isDisabled: function(selectedChannels) {
					return (selectedChannels.length == 0)
				},
				runAction: function(ch) {				
					return $http.put('/rest/plugins/admin-plugin-youtube/channel/'+ch._id+'/copyToYoutube');
				}
			}
		);

		Actions.registerAction(
			{
				label: "Copy a media channel to upload to Youtube",
				context: "youtube-channel",
				role: "YOUTUBE_UPLOADER",
				isDisabled: function(selectedChannels) {
					return (selectedChannels.length > 0)
				},
				runAction: function(ch) {				
				
				}
			}
		);



	}]);
})();