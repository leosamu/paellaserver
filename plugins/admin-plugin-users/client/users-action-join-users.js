(function() {
	var app = angular.module('adminPluginUsers');
	
	
	app.run(['Actions', '$q', '$modal', 'MessageBox', 'UserCRUD', function(Actions, $q, $modal, MessageBox, UserCRUD) {

		Actions.registerAction(
			{
				context: "user",			
				label: "Join users",
				beforeRun: function(items) {
					var deferred = $q.defer();
					
					if (items.length < 2) {
						MessageBox("Join users", "You must select at least two users to join.").finally(function(){
							deferred.reject();
						});
					}
					else {
						var modalInstance = $modal.open({
							resolve: {
								users: function() {
									return items;
								}
							},
							size: 'lg',
							backdrop: true,
							templateUrl:'admin-plugin-users/views/modal/user-action-join-users.html',
							controller:['$scope', '$modalInstance', 'users', function($scope, $modalInstance, users){
								$scope.users = users;
								$scope.updating = false;
								
								$scope.$watch('selectedUser', function() {
									if ($scope.selectedUser) {
										$scope.editUser=JSON.parse(JSON.stringify($scope.selectedUser));
									}
								});
	
								$scope.cancel = function () {
									$modalInstance.dismiss();
								};								
								$scope.accept = function () {
									if ($scope.editUser) {
										$scope.updating = true;																				
										var remove = []
										items.forEach(function(e){
											if (e._id != $scope.editUser._id) {
												remove.push(e._id);
											}
										});									
									
										var obj = {
											_id: $scope.editUser._id,
											user: $scope.editUser,
											remove: remove
										};
										
										UserCRUD.joinUsers(obj).$promise.then(
											function(){
												MessageBox("Join users", "Users joined correctly.")
												.finally(function(){
													$modalInstance.close();
												});												
											},
											function(){
												MessageBox("Join users", "Error joining users.")
												.finally(function(){
													$modalInstance.close();
												});
											}
										);										
									}
									else {
										$modalInstance.dismiss();
									}
								};								
							}]											
						});
			
						modalInstance.result.finally(function() {
							deferred.reject();
						});
					}
													
					return deferred.promise;	
				},
								
				runAction: function(v) {
					var deferred = $q.defer();
					deferred.resolve();
					return deferred.promise;
				}
			}
		);
				
	}]);	
})();