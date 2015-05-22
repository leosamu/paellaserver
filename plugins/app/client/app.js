
(function() {
	var app = angular.module('paellaserver', [
		"ngRoute",
		'pascalprecht.translate',
		"catalogModule",
		"loginModule"
	]);

	app.config(["$routeProvider","$translateProvider",
		function($routeProvider,$translateProvider) {
			$routeProvider
				.when('/', {
					redirectTo:'/catalog'
				});

			function loadDictionary(localization) {
				$.ajax('app/i18n/' + localization + '.json')
					.success(function(data) {
						$translateProvider.translations(localization,data);
					});
			}

			loadDictionary('es');
			loadDictionary('en');
			$translateProvider.preferredLanguage('es');
		}]);

})();
