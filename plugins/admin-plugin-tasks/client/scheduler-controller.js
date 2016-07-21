(function() {
	var plugin = angular.module('adminPluginTasks');
	
	
	plugin.controller("AdminSchedulerListController", ["$scope", "$modal", "$base64", "$timeout", "$http", "MessageBox", "Filters", "AdminState", 
	function($scope, $modal, $base64, $timeout, $http, MessageBox, Filters, AdminState) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.timeoutReload = null;



		$scope.$watch('currentPage', function(){ $scope.reloadJobs(); });
		
		$scope.$watch('state.jobsFilters', function(){ 
			if ($scope.state.jobsFilters) {
				var final_query = Filters.makeQuery($scope.state.jobsFilters.filters || [], $scope.state.jobsFilters.searchText);
				$scope.filterQuery = $base64.encode(unescape(encodeURIComponent(JSON.stringify(final_query))));
				$scope.reloadJobs();
			}
		}, true );		
		
		
		$scope.reloadJobs = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {
			
				$http.get('/rest/plugins/admin/CRUD/schedule')				
				.then(
					function successCallback(response) {
						$scope.jobs = response.data;
						$scope.loadingVideos = false
						$scope.timeoutReload = null;
					},
					function errorCallback(response) {
						$scope.loadingVideos = false
						$scope.timeoutReload = null;
					}
				);
				/*			
				TaskCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.tasks = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
				*/
			}, 500);
		};

	}])
	
	
})();