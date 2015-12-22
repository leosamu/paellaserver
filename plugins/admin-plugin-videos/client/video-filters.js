(function() {
	var app = angular.module('adminPluginVideos');

	
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
				"label": "Catalogo",
				"field": "catalog",
				"type": "enum",
				"values": [
					{
						"value": "polimedia", "label": "Polimedia (Valencia)"
					},
					{
						"value": "polimedia_gandia", "label": "Polimedia (Gandia)"
					},
					{
						"value": "polimedia_alcoi", "label": "Polimedia (Alcoi)"
					},
					{
						"value": "ice", "label": "ICE"
					},
					{
						"value": "arqt", "label": "ARQT"
					},
					{
						"value": "tv", "label": "TV"
					}
				]
			}
		);
		
		Filters.registerFilter("video",
			{
				"label": "Tipo",
				"field": "source.type",
				"type": "enum",
				"values": [
					{
						"value": "polimedia", "label": "Video del portal"
					},
					{
						"value": "external", "label": "Externo"
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
				"label": "Pendiente de subir",
				"field": "unprocessed",
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
				"type": "enum",
				"values": [
					{
						"value": {$ne: null}, "label": "Si"
					},
					{
						"value": null, "label": "No"
					}
				]
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