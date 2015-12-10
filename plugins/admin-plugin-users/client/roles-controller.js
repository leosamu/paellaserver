(function() {
	var app = angular.module('adminPluginUsers');

	
	app.controller("AdminRolesNewController", ["$scope", "$window", "MessageBox", "RoleCRUD", function($scope, $window, MessageBox, RoleCRUD) {
		$scope.updating = false;	
		$scope.role = {isAdmin:false}
				
		$scope.addRole = function() {
			RoleCRUD.save($scope.role).$promise
			.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("Role created", "Role has been created.");
					}
				},
				function() {
					return MessageBox("Role create error", "ERROR");
				}
			).finally(function(){
				$scope.updating = false;
			});
		}
	}]);

	app.controller("AdminRolesEditController", ["$scope","$routeParams", "$window", "MessageBox", "RoleCRUD", function($scope, $routeParams, $window, MessageBox, RoleCRUD){	
		$scope.updating = false;
		$scope.role = RoleCRUD.get({id: $routeParams.id});		
		
		$scope.updateRole = function() {
			$scope.updating = true;
			RoleCRUD.update($scope.role).$promise
			.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("Role updated", "Role has been updated.");
					}
				},
				function() {
					return MessageBox("Role update error", "ERROR");
				}
			).finally(function(){
				$scope.updating = false;
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


		$scope.deleteRole = function(role) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteRole.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						$modalInstance.close();
					};
				}
			});
			
			modalInstance.result
			.then(function() {
				return RoleCRUD.remove({id:role._id}).$promise;
			})
			.then(
				function() {
					$scope.reloadRoles();
				},
				function() {
					return MessageBox("Eliminar role", "Ha ocurrido un error");
				}
			);				
		};
	}])
	
	
})();