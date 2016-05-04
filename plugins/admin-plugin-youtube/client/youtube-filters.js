(function() {
	var app = angular.module('adminPluginYoutube');

	
	app.run(['Filters' , function(Filters) {
		
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
		
		
		Filters.registerFilter("channel",
			{
				"label": "Youtube",
				"field": "pluginData.youtube",
				"type": "enum",
				"values": [
					{
						"value": {$exists: true}, "label": "Si"
					},
					{
						"value": {$exists: false}, "label": "No"
					}
				]
			}
		);		
		
	}]);
	
		
})();