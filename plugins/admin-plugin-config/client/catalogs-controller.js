(function() {
	var plugin = angular.module('adminPluginConfig');


	plugin.controller("AdminCatalogsNewController", ["$scope", "$modal", "MessageBox", "CatalogCRUD", 
	function($scope, $modal, MessageBox, CatalogCRUD) {
		$scope.updating = false;
		$scope.catalog = {};
		
		$scope.createCatalog = function() {
			$scope.updating = true
			CatalogCRUD.save($scope.catalog).$promise
			.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("Catalogo creado", "El catalogo se ha creado correctamente.");
					}
				},
				function() {
					return MessageBox("Error", "Ha ocurrido un error al crear el catalogo.");
				}
			).finally(function(){
				$scope.updating = false;
			});			
		}	
	}]);


	plugin.controller("AdminCatalogsEditController", ["$scope", "$routeParams", "$modal", "$base64", "$timeout", "$window", "MessageBox", "CatalogCRUD", "AdminState", 
	function($scope, $routeParams, $modal, $base64, $timeout, $window, MessageBox, CatalogCRUD, AdminState) {
		$scope.updating = false;	
		$scope.catalog = CatalogCRUD.get({id: $routeParams.id});
		
		
		$scope.updateCatalog = function() {
			$scope.updating = true;
			CatalogCRUD.update($scope.catalog).$promise
			.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("Catalogo actualizado", "El catalogo se ha actualizado correctamente.");
					}
				},
				function() {
					return MessageBox("Error", "Ha ocurrido un error al actualizar el catalogo.");
				}
			).finally(function(){
				$scope.updating = false;
			});
		};			
	
	}]);
	
	
	plugin.controller("AdminCatalogsListController", ["$scope", "$modal", "$base64", "$timeout", "MessageBox", "CatalogCRUD", "AdminState", 
	function($scope, $modal, $base64, $timeout, MessageBox, CatalogCRUD, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.timeoutReload = null;


		$scope.$watch('currentPage', function(){ $scope.reloadCatalogs(); });
		
		$scope.reloadCatalogs = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				CatalogCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage})
				.$promise.then(function(data){
					$scope.catalogs = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};

		$scope.deleteCatalog = function(id) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteCatalog.html',
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
				return CatalogCRUD.remove({id:id}).$promise;
			})
			.then(
				function() {
					$scope.reloadCatalogs();
				},
				function() {
					return MessageBox("Eliminar catalogo", "Ha ocurrido un error");
				}
			);	
		};
	}])	
	
	
})();