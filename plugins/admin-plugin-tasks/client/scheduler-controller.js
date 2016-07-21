(function() {
	var plugin = angular.module('adminPluginTasks');
	
	
	plugin.controller("AdminSchedulerListController", ["$scope", "$modal", "$base64", "$timeout", "ScheduledTaskCRUD", "MessageBox", "Filters", "AdminState", 
	function($scope, $modal, $base64, $timeout, ScheduledTaskCRUD, MessageBox, Filters, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.timeoutReload = null;



		$scope.$watch('currentPage', function(){ $scope.reloadTasks(); });
		
		$scope.$watch('state.scheduledTaskFilters', function(){ 
			if ($scope.state.scheduledTaskFilters) {
				var final_query = Filters.makeQuery($scope.state.scheduledTaskFilters.filters || [], $scope.state.scheduledTaskFilters.searchText);
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
				ScheduledTaskCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data) {
					$scope.scheduledTasks = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});				
			}, 500);
		};
		

		$scope.scheduledTime = function(t) {
			return prettyCron.toString(t.scheduler);				
		}

		
		$scope.nextScheduledRun = function(t) {
			if (t.enabled) {
				return prettyCron.getNext(t.scheduler);				
			}
			return "-";
		}

		$scope.editTask = function(t) {
			var modalInstance = $modal.open({
				templateUrl: 'editScheduledTask.html',
				size: 'lg',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.task = t;
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
				return ScheduledTaskCRUD.update(t).$promise
			})
			.then(function() {
				$scope.reloadTasks();
			});		
		}
	}])	
	
})();