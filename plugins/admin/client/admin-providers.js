(function() {
	var app = angular.module('adminModule');
	
		
	app.provider('ChannelFilters', function () {		
		var filters = [];
		
		return {		
			registerFilter: function (filter) {
				filters.push(filter);
			},
			
			$get: function () {
				return filters;
			}
		};
	});
	
			
	app.provider('VideoFilters', function () {		
		var filters = [];
		
		return {		
			registerFilter: function (filter) {
				filters.push(filter);
			},
			
			$get: function () {
				return filters;
			}
		};
	});	


	app.factory('Actions', ['$modal', function ($modal) {
		var actions = [];
		
		return {
			registerAction: function (action) {
				actions.push(action);
			},
			
			runAction: function(action, items) {
			
				function doAction(actionParams) {			
					var modalInstance = $modal.open({
						templateUrl: 'runVideoAction.html',
						size: '',
						backdrop: 'static',
						keyboard: false,
						resolve: {
							action: function() {
								return action;
							},
							selectedVideos: function () {
								return items;
							}
						},
						controller: function ($scope, $modalInstance, selectedVideos, action) {
							$scope.action = action;
							$scope.totalActions = selectedVideos.length;
							$scope.successError = 0;
							$scope.successCompleted = 0;
							
							if ( $scope.totalActions > 0) {					
								selectedVideos.forEach(function(v){
									var p = action.runAction(v, actionParams)
									p.then(function() {
										$scope.successCompleted = $scope.successCompleted + 1;
									},
									function(){								
										$scope.successError = $scope.successError + 1;
									});
								});
							}
							
							$scope.accept = function () {
								$modalInstance.close();
							};
						}
					});	
				};					
				
				if (action.beforeRun) {	
					action.beforeRun("video", items).then(function(actionParams) {
						doAction(actionParams);
					});
				}
				else {
					doAction();
				}
			},
			
			$get: function (context) {
				var ret = [];
				actions.forEach(function(a) {
					if (a.context == context) { ret.push(a); }
				});
				return ret;
			}
		};
	}]);
	
})();