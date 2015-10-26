(function() {
	var plugin = angular.module('adminPluginTasks');

	
	
	
	plugin.controller("AdminTasksListController", ["$scope", "$modal", "$base64", "$timeout", "MessageBox", "TaskCRUD", "AdminState", 
	function($scope, $modal, $base64, $timeout, MessageBox, TaskCRUD, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.timeoutReload = null;



		$scope.$watch('currentPage', function(){ $scope.reloadTasks(); });
		
		$scope.reloadTasks = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				TaskCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage})
				.$promise.then(function(data){
					$scope.tasks = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};


		$scope.deleteTask = function(id) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteTask.html',
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
				return MessageBox("Eliminar tarea", "Operación no implementada");
			});
		};
	}])
	
	
})();