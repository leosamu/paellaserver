(function() {
	var plugin = angular.module('adminPluginConfig');


	
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
			
			modalInstance.result.then(function(){
				return MessageBox("Eliminar catalogo", "Operación no implementada");
			});
		};
	}])	
	
	
})();