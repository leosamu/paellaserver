(function() {
	var app = angular.module('adminModule');

	app.factory('VideoCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/videos/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'},
			'parents' : {method: 'GET', isArray: false, url: '/rest/plugins/admin/CRUD/videos/:id/parents' },
			'search' : {method: 'GET', isArray: false, url: '/rest/plugins/admin/CRUD/search/videos' }
		});
	}]);

	app.factory('ChannelCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/channels/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'},
			'parents' : {method: 'GET', isArray: false, url: '/rest/plugins/admin/CRUD/channels/:id/parents' },			
			'search' : {method: 'GET', isArray: false, url: '/rest/plugins/admin/CRUD/search/channels' }
		});
	}]);

	app.factory('UserCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/users/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'},
			'joinUsers': {method: 'PATCH', url:'/rest/plugins/admin/CRUD/users/:id/joinUsers'}
		});
	}]);

	app.factory('RepositoryCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/repositories/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'},
			'save': {method: 'POST', params: {'id': null}}
		});
	}]);

	app.factory('TaskCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/tasks/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'}
		});
	}]);

	app.factory('RoleCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/roles/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'},
			'save': {method: 'POST', params: {'id': null}}
		});
	}]);
	
	app.factory('CatalogCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/catalogs/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'},
			'save': {method: 'POST', params: {'id': null}}
		});
	}]);
	
})();
	