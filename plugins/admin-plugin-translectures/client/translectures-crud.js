(function() {
	var app = angular.module('adminPluginTranslectures');

	app.factory('TranslecturesCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin-plugin-translectures/CRUD/translectures/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'},
		});
	}]);
		
})();
	