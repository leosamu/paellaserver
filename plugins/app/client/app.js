
(function() {
	var app = angular.module('paellaserver', [
		"ngRoute",
		"catalogModule",
		"loginModule"
	]);

	app.config(["$routeProvider",
		function($routeProvider) {
			$routeProvider
				.when('/', {
					redirectTo:'/catalog'
				});
		}]);

})();
