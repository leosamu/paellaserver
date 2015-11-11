(function() {
	var plugin = angular.module('adminPluginConfig');

	
	plugin.controller("AdminRepositoriesNewController", ["$scope", "MessageBox", "RepositoryCRUD", 
	function($scope, MessageBox, RepositoryCRUD) {
	
		$scope.repository = {}		
				
		$scope.createRepository = function() {
			RepositoryCRUD.save($scope.repository).$promise
			.then(
				function() {
					window.history.back();
				},
				function() {
					return MessageBox("Crear un repositorio", "Ha ocurrido un error");
				}
			);					
		}	
	
	}]);

	
	plugin.controller("AdminRepositoriesEditController", ["$scope", "$routeParams", "$base64", "MessageBox", "RepositoryCRUD", 
	function($scope, $routeParams, $base64, MessageBox, RepositoryCRUD) {
	
	
		$scope.repository = RepositoryCRUD.get({id: $routeParams.id});
		
		
		$scope.updateRepository = function() {
			RepositoryCRUD.update($scope.repository).$promise.
			then(
				function() {
					window.history.back();
				},
				function() {
					return MessageBox("Editar un repositorio", "Ha ocurrido un error");
				}
			);
		}	
	
	}]);
	
	
	plugin.controller("AdminRepositoriesListController", ["$scope", "$modal", "$base64", "$timeout", "MessageBox", "RepositoryCRUD", "AdminState", 
	function($scope, $modal, $base64, $timeout, MessageBox, RepositoryCRUD, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.timeoutReload = null;


		$scope.$watch('currentPage', function(){ $scope.reloadRepositories(); });
		
		$scope.reloadRepositories = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				RepositoryCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage})
				.$promise.then(function(data){
					$scope.repositories = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};

		$scope.deleteRepository = function(id) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteRepository.html',
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
				return RepositoryCRUD.remove({id:id}).$promise;
			})
			.then(
				function() {
					$scope.reloadRepositories();
				},
				function() {
					return MessageBox("Eliminar repositorio", "Ha ocurrido un error");
				}
			);	
		};
	}])	
	
	
})();