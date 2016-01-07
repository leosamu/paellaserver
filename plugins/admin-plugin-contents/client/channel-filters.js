(function() {
	var app = angular.module('adminPluginVideos');

	
	app.run(['Filters' , function(Filters) {

		Filters.registerFilter('channel',
			{
				"label": "Fecha creación",
				"field": "creationDate",
				"type": "timeInterval"
			}
		);
	}]);
		
})();