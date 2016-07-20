(function() {
	var app = angular.module('adminPluginUsers');

	
	app.controller("AdminUsersNewController", ["$scope", "RoleCRUD", function($scope, RoleCRUD){	
		$scope.role = {isAdmin:false}
				
		$scope.addRole = function() {
			RoleCRUD.save($scope.role).$promise.then(function() {
				console.log("create");
			});
		}
	}]);

	app.controller("AdminUsersEditController", ["$scope","$routeParams", "$window", "UserCRUD", "MessageBox", function($scope, $routeParams, $window, UserCRUD, MessageBox){
		$scope.updating = false;
		$scope.user = UserCRUD.get({id: $routeParams.id});
		
		$scope.dynamicRoles = UserCRUD.dynamicRoles({id: $routeParams.id})

		
		$scope.createLocalAuth = function() {
			$scope.user.auth.polimedia = {};
		}
		
		$scope.updateRole = function() {
			$scope.updating = true;
			UserCRUD.update($scope.user).$promise
			.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("Update User", "The user has been updated.");
					}
				},
				function() {
					return MessageBox("Error", "An error has happened updating the user.");
				}
			).finally(function(){
				$scope.updating = false;
			});
		}
	}]);
	
	
	app.controller("AdminUsersListController", ["$scope", "$modal", "$base64", "$timeout", "UserCRUD", "Filters", "AdminState", "MessageBox",
	function($scope, $modal, $base64, $timeout, UserCRUD, Filters, AdminState, MessageBox) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get('user');
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;
		
		
		$scope.$watch('selectAll', function(value, old){
			if (value != old) {
				try{
					$scope.users.list.forEach(function(v){
						v.selected = value;
					});
				}
				catch(e) {}
			}
		});		

		$scope.$watch('state.userFilters', function(){ 
			if ($scope.state.userFilters) {
				var final_query = Filters.makeQuery($scope.state.userFilters.filters || [], $scope.state.userFilters.searchText);
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

		$scope.switchUser = function(id) {
			UserCRUD.switchUser({_id:id}).$promise.then(
				function(){
					MessageBox("User switch", "User switched correctly")
					.then(function(){
						window.location.href = '/';
					});	
				},
				function(){
					MessageBox("Error", "An error has happened switching to other user.");
				}
			)
		}

		$scope.deleteUser = function(id) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteUser.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						MessageBox("TODO", "Feature not implemented yed.");
						$modalInstance.close();
					};
				}
			});
		};		
	}])
	
	
})();