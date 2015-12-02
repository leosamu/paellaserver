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

	app.controller("AdminUsersEditController", ["$scope","$routeParams", "UserCRUD", function($scope, $routeParams, UserCRUD){	
		$scope.user = UserCRUD.get({id: $routeParams.id});
		
		$scope.createLocalAuth = function() {
			$scope.user.auth.polimedia = {};
			console.log("---");
		}
		
		$scope.updateRole = function() {
			UserCRUD.update($scope.user).$promise.then(function() {
				console.log("update");
			});
		}
	}]);
	
	
	app.controller("AdminUsersListController", ["$scope", "$modal", "$base64", "$timeout", "UserCRUD", "Filters", "AdminState", 
	function($scope, $modal, $base64, $timeout, UserCRUD, Filters, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get('user');
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;
		

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
						console.log("TODO")
						$modalInstance.close();
					};
				}
			});
		};		
	}])
	
	
})();