(function() {
	var app = angular.module('adminPluginTranslectures');

	app.factory('TranslecturesCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin-plugin-translectures/CRUD/translectures/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'}
		});
	}]);
		


	app.factory('TranslecturesRest', ['$resource', function($resource){
		return $resource('/rest/plugins/admin-plugin-translectures/', {}, {
			'langs':  {method: 'GET', isArray: true, url: '/rest/plugins/admin-plugin-translectures/langs/:id', params: {'id':'@_id'} },
			'status': {method: 'GET', isArray: false, url: '/rest/plugins/admin-plugin-translectures/status/:id', params: {'id':'@_id'} }
		});
	}]);
		
		
})();
	