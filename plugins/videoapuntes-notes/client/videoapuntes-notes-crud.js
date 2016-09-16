(function() {
	var app = angular.module('videoApuntesNotesModule');
	
	app.factory('videoApuntesNotesCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/videoapuntes-notes/videos/:id/annotations', {},{
			'query' : {method: 'GET', isArray: false, url: '/rest/plugins/videoapuntes-notes/videos/:id/annotation/:annotationId', params: {'id':'@_id', 'annotationId':'@annotationId'} },
			'update' : {method: 'PATCH', isArray: false, url: '/rest/plugins/videoapuntes-notes/videos/:id/annotation/:annotationId', params: {'id':'@_id', 'annotationId':'@annotationId'} },
			'delete' : {method: 'DELETE', isArray: false, url: '/rest/plugins/videoapuntes-notes/videos/:id/annotation/:annotationId', params: {'id':'@_id', 'annotationId':'@annotationId'} },
			'add' : {method: 'POST', isArray: false, url: '/rest/plugins/videoapuntes-notes/videos/:id/annotation', params: {'id':'@_id'} },
			'search': {method: 'GET', isArray: true, url: '/rest/plugins/videoapuntes-notes/videos/:id/annotations', params: {'id':'@_id'} },			
			'recordings' : {method: 'GET', isArray: true, url: '/rest/plugins/videoapuntes-notes/recordings2', params:{'start':'@_start', 'end':'@_end'} }
		});
	}]);
})();