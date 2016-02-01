(function() {
	var plugin = angular.module('adminPluginOA');
	
	
	plugin.run(['Actions', '$q', '$modal', 'TaskCRUD', function(Actions, $q, $modal, TaskCRUD) {

		Actions.registerAction(
			{
				context: "oa",			
				label: "Import OA info from riunet",
				
				
				beforeRun: function(items) {
					var deferred = $q.defer();
					
						
					var modalInstance = $modal.open({
						templateUrl:'admin-plugin-oa/views/modal/oa-import-from-riunet.html',
						controller:['$scope', '$modalInstance', function($scope, $modalInstance){
							$scope.fromDate = new Date();
							$scope.toDate = new Date();

							$scope.accept = function () {
								$modalInstance.close({from: $scope.fromDate, to: $scope.toDate});
							};
							$scope.cancel = function () {
								$modalInstance.dismiss();
							};
						}],
						backdrop: true
					});
			
					modalInstance.result
					.then(function(params){
						var fromText = moment(params.from).format("DD-MM-YYYY");
						var toText = moment(params.to).format("DD-MM-YYYY");
						
						var task1 = {
							task: "importOAInfoFromRiunet",
							targetType: "oa",
							parameters: "--from " + fromText + " --to " + toText,
							targetId: null,
							error: false
						};
						//return TaskCRUD.save(task1).$promise;
						var deferred = $q.defer();
						deferred.reject();
						return deferred.promise;						
					})
					.finally(function(){
						deferred.reject();
					});
					
					return deferred.promise;					
				},
				
				runAction: function(item, params) {
					var deferred = $q.defer();
					deferred.reject();
					return deferred.promise;
				}
			}
		);	
				
	}]);	
})();