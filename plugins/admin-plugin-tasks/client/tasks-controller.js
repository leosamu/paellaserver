(function() {
	var plugin = angular.module('adminPluginTasks');
	
	
	plugin.controller("AdminTasksListController", ["$scope", "$modal", "$base64", "$timeout", "MessageBox", "TaskCRUD", "Filters", "AdminState", 
	function($scope, $modal, $base64, $timeout, MessageBox, TaskCRUD, Filters, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.timeoutReload = null;



		$scope.$watch('currentPage', function(){ $scope.reloadTasks(); });
		
		$scope.$watch('state.taskFilters', function(){ 
			if ($scope.state.taskFilters) {
				var final_query = Filters.makeQuery($scope.state.taskFilters.filters || [], $scope.state.taskFilters.searchText);
				$scope.filterQuery = $base64.encode(unescape(encodeURIComponent(JSON.stringify(final_query))));
				$scope.reloadTasks();
			}
		}, true );		
		
		
		$scope.reloadTasks = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				TaskCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.tasks = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};


		$scope.deleteTask = function(task) {
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
			
			modalInstance.result
			.then(function() {
				return TaskCRUD.remove({id:task._id}).$promise;
			})
			.then(function() {
				$scope.reloadTasks();
			});
		};
	}])
	
	
})();