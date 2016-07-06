(function() {
	var plugin = angular.module('adminPluginOA');

	
	plugin.run(['Filters' , function(Filters) {

		Filters.registerFilter("oa",
			{
				"label": "Fecha publicción",
				"field": "pluginDate.publicationDate",
				"type": "timeInterval"
			}
		);
		
		Filters.registerFilter("oa",
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
		
		
		Filters.registerFilter("oa",
			{
				"label": "Subido a Youtube",
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

	}]);		
})();