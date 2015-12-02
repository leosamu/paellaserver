(function() {
	var plugin = angular.module('adminModule');
	
	
	function hasRole(role){								
		return function(element){
			return ((element._id == role) || element.isAdmin );
		};
	}	
	
	plugin.directive('actionsDropdown', function(){
		return {
			restrict: 'E',
			scope: {
				elements: "=",
				type: "="
			},		
			templateUrl: 'admin/views/directives/actions-dropdown.html',
			controller: ["$scope", "Actions", "User", function($scope, Actions, User) {
	
				$scope.$watch('type', function(value){
					User.current().$promise.then(function(u) {
						$scope.actions = [];
						
						Actions.$get(value).forEach(function(a){
							if (a.role) {																
								if ( u.roles.some(hasRole(a.role)) ){
									$scope.actions.push(a);
								};
							}
							else {
								$scope.actions.push(a);
							}
						});					
					});
				});
			
				$scope.doAction = function(action) {			
					var selectedElements= [];			
					$scope.elements.forEach(function(e){
						if (e.selected) {
							selectedElements.push(e);
						}
					});												
					Actions.runAction(action, selectedElements);
				};	
			}]
		};
	});
	
})();