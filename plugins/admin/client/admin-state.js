(function() {
	var app = angular.module('adminModule');
	
		
	app.service('AdminState', function () {
		this.itemsPerPage = 10;
	});	
	
})();