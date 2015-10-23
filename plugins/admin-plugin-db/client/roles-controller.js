(function() {
	var app = angular.module('adminPluginDB');

	
	app.controller("AdminRolesNewController", ["$scope", "RoleCRUD", function($scope, RoleCRUD){	
		$scope.role = {isAdmin:false}
				
		$scope.addRole = function() {
			RoleCRUD.save($scope.role).$promise.then(function() {
				console.log("create");
			});
		}
	}]);

	app.controller("AdminRolesEditController", ["$scope","$routeParams", "RoleCRUD", function($scope, $routeParams, RoleCRUD){	
		$scope.role = RoleCRUD.get({id: $routeParams.id});
		
		
		$scope.updateRole = function() {
			RoleCRUD.update($scope.role).$promise.then(function() {
				console.log("update");
			});
		}
	}]);
	
	
	app.controller("AdminRolesListController", ["$scope", "$modal", "$base64", "$timeout", "RoleCRUD", "AdminState", 
	function($scope, $modal, $base64, $timeout, RoleCRUD, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.timeoutReload = null;



		$scope.$watch('currentPage', function(){ $scope.reloadRoles(); });
		
		$scope.reloadRoles = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				RoleCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage})
				.$promise.then(function(data){
					$scope.roles = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};


		$scope.deleteRole = function(id) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteRole.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						console.log("TODO")
						$modalInstance.close();
					};
				}
			});
		};
	}])
	
	
})();