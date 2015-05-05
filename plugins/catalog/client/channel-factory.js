
(function() {
	angular.module('catalogModule')
		.factory("Channel", ['$resource', function ChannelFactory($resource) {
			return $resource("/rest/search", {}, {
				query: { search:'' },
				all: { url:"/rest/channel/:id" }
			});
	}]);
})();