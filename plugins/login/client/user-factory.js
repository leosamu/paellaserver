
(function() {
	angular.module('loginModule')
		.factory("User", ['$resource', function UserFactory($resource) {
			return $resource("/rest/currentUser", {}, {
				current: { method:'GET' },
				searchMail: { url:'/rest/user/searchMail/:mail', method:'GET', isArray:true },
				searchName: { url:'/rest/user/searchName/?search=:search', method:'GET', isArray:true },
				find: { method:'GET', url:"/rest/user/:id/allData" },
				create: { url:"/rest/user", method:'POST' },
				videos: { url:"/rest/user/:id/videos", params:{ ":id":"@id" }, isArray:true }
			});
		}]);
})();
