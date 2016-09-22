
(function() {
	angular.module('catalogModule')
		.factory("Channel", ['$resource', function ChannelFactory($resource) {
			return $resource("/rest/channel/:id", { }, {
				search: { url:"/rest/search", search:'' },
				all: { url:"/rest/channel/:id" },
				parents: { url:"/rest/channel/:id/parents" },
				create: { url:"/rest/channel", method:'POST' },
				update: { method:'PATCH', params:{ 'id':'@id' } },
				remove: { method:'DELETE', params:{ 'id':'@id'} },
				userChannels: { url:"/rest/user/:userId/channels", isArray:true },
				addChannel: { url:"/rest/channel/:id/addchannel/:childId", method:'PATCH' },
                addVideo: { url:"/rest/channel/:id/addvideo/:videoId", method:'PATCH', params:{ 'id':'@id', 'videoId':'@videoId' } },
				removeChannel: { url:"/rest/channel/:id/removechannel/:childId", method:'PATCH' },
				removeVideo: { url:"/rest/channel/:id/removevideo/:videoId", method:'PATCH' },
				get:{}
			});
		}]);
})();