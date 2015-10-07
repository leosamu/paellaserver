(function() {
	var app = angular.module('adminModule');

	
	app.config(['VideoFiltersProvider' , function(VideoFiltersProvider) {

		VideoFiltersProvider.registerFilter(
			{
				"label": "Fecha creación",
				"field": "creationDate",
				"type": "timeInterval"
			}
		);
		
		VideoFiltersProvider.registerFilter(
			{
				"label": "Tipo",
				"field": "source.type",
				"type": "enum",
				"values": [
					{
						"value": "polimedia", "label": "Polimedia"
					},
					{
						"value": "politube", "label": "Politube"
					},
					{
						"value": "external", "label": "Externo"
					},
					{
						"value": "live", "label": "Live"
					},
					{
						"value": "ice", "label": "ICE"
					},
					{ 
						"value": "tv", "label":"TV"
					}
				]
			}
		);
		VideoFiltersProvider.registerFilter(
			{
				"label": "OA",
				"field": "pluginData.OA.isOA",
				"type": "enum",
				"values": [
					{
						"value": true, "label": "Si"
					},
					{
						"value": false, "label": "No"
					}
				]
			}
		);
		
		/*
		VideoFiltersProvider.registerFilter(
			{
				"label": "Autor",
				"field": "owner",
				"type": "author"
			}
		);	
		*/
	}]);
	
		
})();