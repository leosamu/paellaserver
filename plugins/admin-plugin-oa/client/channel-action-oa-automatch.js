(function() {
	var app = angular.module('adminPluginOA');
	
	
	app.run(['Actions', '$q', 'ChannelCRUD', '$modal', 'MessageBox', function(Actions, $q, ChannelCRUD, $modal, MessageBox) {

		Actions.registerAction(
			{
				label: "Add OA automatch",
				context: "channel",
				beforeRun: function(items) {
					var deferred = $q.defer();
					
					if (items.length < 1) {
						MessageBox("Add OA automatch", "You must select at least one channel.").finally(function(){
							deferred.reject();
						});
					}
					else {						
						var promises = [];
						items.forEach(function(ch){
							var p = ChannelCRUD.get({id: ch._id}).$promise;
							promises.push(p);
						});
						
						$q.all(promises)
						.then(function(channels){
							
							var modalInstance = $modal.open({
								templateUrl:'admin-plugin-oa/views/modal/oa-automatch.html',
								controller:['$scope', '$modalInstance', 'channels', function($scope, $modalInstance, channels){
									$scope.channels = channels;
	
									$scope.accept = function () {
										$modalInstance.close($scope.channels);
									};								
									$scope.cancel = function () {
										$modalInstance.dismiss();
									};								
								}],
								resolve:{
									channels: function() {
										return channels;
									}
								},
								backdrop: true
							});
				
							modalInstance.result.then(
								function(result) {
									deferred.resolve(result);
								},
								function() {
									deferred.reject();
								}
								);
						});	
					}													
					return deferred.promise;					
				},
				
				runAction: function(item, params) {
					var it = undefined;
					params.forEach(function(p){
						if (p._id == item._id) {
							it = p;	
						}
					});
					
					if (it) {
						return ChannelCRUD.update(it).$promise;
					}
					else {
						var deferred = $q.defer();
						deferred.reject();
						return deferred.promise;
					}
				}
			}
		);
	}]);	
})();