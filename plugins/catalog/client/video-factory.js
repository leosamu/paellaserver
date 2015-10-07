
(function() {
	angular.module('catalogModule')
		.factory("Video", ['$resource', function VideoFactory($resource) {
			return $resource("/rest/video/:id", {}, {
				parents: { url:"/rest/video/:id/parents" },
				count: { url:"/rest/videos/count" },
				userVideos: { url:"/rest/user/:userId/videos", isArray:true },
				get: { },
				create: { url:"/rest/video", method:'POST' },
				unprocessed: { url:"/rest/videos/unprocessed", method:'GET', isArray:true },
				update: { method:'PATCH', params:{ 'id':'@id' }},
				query: {url:'/rest/videos', params:{limit:100, skip:0}, isArray:false}
			});
		}]);
})();
