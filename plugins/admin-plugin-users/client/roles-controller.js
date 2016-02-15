(function() {
	var app = angular.module('adminPluginUsers');



	app.controller("AdminRolesUsersController", ["$scope", "$routeParams", "$window", "$timeout", "$modal", "$base64", "Filters", "AdminState", "MessageBox", "RoleCRUD", "UserCRUD", 
	function($scope, $routeParams, $window, $timeout, $modal, $base64, Filters, AdminState, MessageBox, RoleCRUD, UserCRUD) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get('user');
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;
		
		RoleCRUD.get({id: $routeParams.id})
		.$promise.then(function(role) {
			$scope.role = role;
			$scope.$watch('state.userFilters', function(){ 
				if ($scope.state.userFilters) {
					var final_query = Filters.makeQuery($scope.state.userFilters.filters || [], $scope.state.userFilters.searchText);
					final_query = {$and: [{roles: role}, final_query]}
					
					$scope.filterQuery = $base64.encode(JSON.stringify(final_query));
					$scope.reloadUsers();
				}
			}, true );
	
			$scope.$watch('currentPage', function(){ $scope.reloadUsers(); });
			
			$scope.reloadUsers = function(){
				if ($scope.timeoutReload) {
					$timeout.cancel($scope.timeoutReload);
				}		
				$scope.loadingVideos = true;
				$scope.timeoutReload = $timeout(function() {			
					UserCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
					.$promise.then(function(data){
						$scope.users = data;
						$scope.loadingVideos = false
						$scope.timeoutReload = null;
					});
				}, 500);
			};
	
	
			$scope.removeRoleFromUser = function(user) {
				var modalInstance = $modal.open({
					templateUrl: 'confirmRemoveRole.html',
					size: '',
					backdrop: true,
					controller: function ($scope, $modalInstance) {
						$scope.cancel = function () {
							$modalInstance.dismiss();
						};
						$scope.accept = function () {
							$modalInstance.close(user);
						};
					}
				});
				
				modalInstance.result.then(function(user){
					var idx = user.roles.indexOf($scope.role._id);
					if (idx > -1) {
						user.roles.splice(idx, 1);
					}
					UserCRUD.update(user)
					.$promise.then(
						function(data){ $scope.reloadUsers();},
						function() { return MessageBox("Error removing role ", "ERROR");}
					);
				});

			};
			
		});
	
	}]);
	
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