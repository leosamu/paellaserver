
(function() {
	var app = angular.module('paellaserver', [
		"ngRoute",
		"catalogModule"
	]);

	app.config(["$routeProvider",
		function($routeProvider) {
			$routeProvider.
				when('/', {
					redirectTo:'/catalog'
				});
		}]);

})();
