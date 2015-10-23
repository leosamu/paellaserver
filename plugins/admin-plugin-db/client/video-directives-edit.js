(function() {
	var app = angular.module('adminPluginDB');

	app.directive('languageSelect', function(){
		return {
			restrict: 'E',
			scope: {
				language: "="	
			},
			controller: ['$scope', function($scope){
				$scope.langs= [
					{ "id":"es", "name":"es" },
					{ "id":"en", "name":"en" },
					{ "id":"it", "name":"it" },
					{ "id":"fr", "name":"fr" },
					{ "id":"pt", "name":"pt" },
					{ "id":"de", "name":"de" },
					{ "id":"ca", "name":"ca" },
					{ "id":"af", "name":"af" },
					{ "id":"lt", "name":"lt" },
					{ "id":"nl", "name":"nl" },
					{ "id":"da", "name":"da" },
					{ "id":"hu", "name":"hu" },
					{ "id":"ja", "name":"ja" },
					{ "id":"ru", "name":"ru" },
					{ "id":"cs", "name":"cs" },
					{ "id":"no", "name":"no" },
					{ "id":"fi", "name":"fi" },
					{ "id":"kk", "name":"kk" },
					{ "id":"ar", "name":"ar" }
				];

			}],
			templateUrl: 'admin-plugin-db/views/directives/language-select.html'
		};
	});

	
	app.directive('ownersSelectOrCreate', function(){
		return {
			restrict: 'E',
			scope: {
				owners: "="	
			},
			controller: ['$scope', '$modal', function($scope, $modal) {
				$scope.changeOwner = function() {
				
					var modalInstance = $modal.open({
						templateUrl: 'admin-plugin-db/views/modal/select-owner.html',
						size: '',
						backdrop: 'static',
						keyboard: false,
						resolve: {
							owners: function() {
								return $scope.owners;
							}
						},
						controller: function ($scope, $modalInstance, owners) {
							$scope.cancel = function () {
								$modalInstance.dismiss();
							};						
							$scope.accept = function () {
								if ($scope.ownerId == null){
									console.log("TODO: Create a new user");
									//TODO: Quitar esto cuando este terminado
									$modalInstance.dismiss();
								}
								else {							
									var ret =[{
										_id: $scope.ownerId,
										contactData: {
											name: $scope.ownerName,
											lastName: $scope.ownerLastName,
											email: $scope.ownerEmail
										}
									}];
									$modalInstance.close(ret);
								}
							};
						}
					});
					
					modalInstance.result.then(function (owners) {
						$scope.owners = owners;
					});
				};
			}],
			templateUrl: 'admin-plugin-db/views/directives/owners-select-or-create.html'
		};
	});

	app.directive("videoEditBasic", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="	
			},
			templateUrl: 'admin-plugin-db/views/directives/video-edit-basic.html'
		}
	});
	
	
	app.directive("videoEditAdvanced", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="	
			},
			templateUrl: 'admin-plugin-db/views/directives/video-edit-advanced.html'
		}
	});
		
	app.directive("videoEditVideos", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="	
			},
			templateUrl: 'admin-plugin-db/views/directives/video-edit-videos.html'
		}
	});
	
	app.directive("videoEditPermissions", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="	
			},
			controller: ['$scope', function($scope){
				$scope.addRole = function() {
					$scope.video.permissions.push({
						role: $scope.addRoleText,
						read: $scope.addRoleRead,
						write: $scope.addRoleWrite
					});
					$scope.addRoleText = null;
					$scope.addRoleRead = false;
					$scope.addRoleWrite = false;
				};
				
				$scope.deletePermission = function(p) {
					console.log(p);
				}
			}],
			templateUrl: 'admin-plugin-db/views/directives/video-edit-permissions.html'
		}
	});	
	
	
})();