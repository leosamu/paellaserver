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
			'search' : {method: 'GET', isArray: false, url: '/rest/plugins/admin/CRUD/search/channels' },
			'addVideo' : {method: 'PATCH', isArray: false, url: '/rest/plugins/admin/CRUD/channels/:parent/addVideo/:video', params: {'video':'@video', 'parent':'@parent'} },
			'removeVideo' : {method: 'PATCH', isArray: false, url: '/rest/plugins/admin/CRUD/channels/:parent/removeVideo/:video', params: {'video':'@video', 'parent':'@parent'} },
			'addChannel' : {method: 'PATCH', isArray: false, url: '/rest/plugins/admin/CRUD/channels/:parent/addChannel/:channel', params: {'channel':'@channel', 'parent':'@parent'} },
			'removeChannel' : {method: 'PATCH', isArray: false, url: '/rest/plugins/admin/CRUD/channels/:parent/addChannel/:channel', params: {'channel':'@channel', 'parent':'@parent'} }
		});
	}]);

	app.factory('UserCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/users/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'},
			'joinUsers': {method: 'PATCH', url:'/rest/plugins/admin/CRUD/users/:id/joinUsers'},
			'switchUser': {method: 'POST', url:'/rest/plugins/admin/CRUD/users/:id/switchUser'},
			'dynamicRoles': {method: 'GET', url:'/rest/plugins/admin/CRUD/users/:id/dynamicRoles', isArray: true}
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
	