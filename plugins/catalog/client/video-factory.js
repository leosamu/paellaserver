
(function() {
	angular.module('catalogModule')
		.factory("Video", ['$resource', function VideoFactory($resource) {
			return $resource("/rest/video/:id", {}, {
				parents: { url:"/rest/video/:id/parents" },
				count: { url:"/rest/videos/count" }
			});
		}]);
})();
