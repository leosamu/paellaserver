
(function() {
	var app = angular.module('paellaserver', [
		"ngRoute",
		'pascalprecht.translate',
		'unescoModule',
		"catalogModule",
		"statisticsModule",
		"loginModule",
		"legalModule"
	]);

	app.config(["$routeProvider","$translateProvider",
		function($routeProvider,$translateProvider,$cookiesProvider) {
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

			var defaultLanguage = $.cookie('language') ||  navigator.language.substring(0, 2);
			loadDictionary('es');
			loadDictionary('en');
			loadDictionary('ca');
			loadDictionary('tlh');
			$translateProvider.preferredLanguage(defaultLanguage);
			document.head.setAttribute("lang",defaultLanguage);
		}]);

})();
