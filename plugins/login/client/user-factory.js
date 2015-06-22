
(function() {
	angular.module('loginModule')
		.factory("User", ['$resource', function UserFactory($resource) {
			return $resource("/rest/currentUser", {}, {
				current: { method:'GET' }
			});
		}]);
})();
