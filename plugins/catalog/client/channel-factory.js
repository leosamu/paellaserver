
(function() {
	angular.module('catalogModule')
		.factory("Channel", ['$resource', function ChannelFactory($resource) {
			return $resource("/rest/channel/:id", { }, {
				search: { url:"/rest/search", search:'' },
				all: { url:"/rest/channel/:id" },
				parents: { url:"/rest/channel/:id/parents" },
				userChannels: { url:"/rest/user/:userId/channels", isArray:true },
				addChannel: { url:"/rest/channel/:id/addchannel/:childId", method:'PATCH' },
                addVideo: { url:"/rest/channel/:id/addvideo/:videoId", method:'PATCH' },
				get:{}
			});
		}]);
})();