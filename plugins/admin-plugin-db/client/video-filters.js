(function() {
	var app = angular.module('adminPluginDB');

	
	app.run(['Filters' , function(Filters) {

		Filters.registerFilter("video",
			{
				"label": "Fecha creación",
				"field": "creationDate",
				"type": "timeInterval"
			}
		);
		
		Filters.registerFilter("video",
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
		Filters.registerFilter("video",
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
		
		Filters.registerFilter("video",
			{
				"label": "Youtube",
				"field": "pluginData.youtube.id",
				"type": "exists",
			}
		);
		
		/*
		Filters.registerFilter("video",
			{
				"label": "Autor",
				"field": "owner",
				"type": "author"
			}
		);	
		*/
	}]);
	
		
})();