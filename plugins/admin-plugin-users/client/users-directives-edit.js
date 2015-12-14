(function() {
	var app = angular.module('adminPluginUsers');
	
	app.directive("userEditBasic", function(){
		return {
			restrict: 'E',
			scope: {
				user: "="	
			},
			templateUrl: 'admin-plugin-users/views/directives/user-edit-basic.html'
		}
	});
	
	
	app.directive("userEditAuth", function(){
		return {
			restrict: 'E',
			scope: {
				user: "="	
			},
			templateUrl: 'admin-plugin-users/views/directives/user-edit-auth.html'
		}
	});	
	
})();