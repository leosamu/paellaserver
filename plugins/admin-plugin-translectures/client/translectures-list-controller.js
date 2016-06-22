(function() {
	var plugin = angular.module('adminPluginTranslectures');

		
	plugin.controller("AdminTranslecturesListController", ["$scope", "$modal", "$base64", "$timeout", "MessageBox", "TranslecturesCRUD", "AdminState", 
	function($scope, $modal, $base64, $timeout, MessageBox, TranslecturesCRUD, AdminState) {
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
				TranslecturesCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage})
				.$promise.then(function(data){
					$scope.tasks = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};


		$scope.deleteServer = function(task) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteServer.html',
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
				return TranslecturesCRUD.remove({id:task._id}).$promise;
			})
			.then(
				function() {
					$scope.reloadTasks();
				},
				function(){
					MessageBox("Error", "No se ha podido borrar el servidor");
				}	
			);
		};
	}])	
	
	
	
	
})();