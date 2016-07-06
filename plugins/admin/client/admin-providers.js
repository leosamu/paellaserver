(function() {
	
	var app = angular.module('adminModule');	


	app.factory('Filters', function () {
		var filters = {};
		
		return {		
			registerFilter: function (context, filter) {
				if (!(context in filters)) {
					filters[context] = [];
				}
				filters[context].push(filter);
			},
			
			makeQuery : function(selectedFilters, searchText) {
				var querys = [];
				var final_query = {}
			
				selectedFilters.forEach(function(f){
					if (f.filter.type == 'enum') {
						var q = {};
						q[f.filter.field] =  f.value.value;
						querys.push(q);
					}
					else if (f.filter.type == 'text') {
						var q = {};
						a[f.filter.field] =  { $regex: f.value.value, $options: 'i' }
						querys.push(q);
					}				
					else if (f.filter.type == 'timeInterval') {
						var q1 = {}, q2 = {};
						q1[f.filter.field] = {"$gte": f.value.value.start };
						q2[f.filter.field] = {"$lte": moment(f.value.value.end).endOf('day').toDate() };					
						querys.push(q1);
						querys.push(q2);
					}
					else {
						console.log("Tipo de filtro no definido: " + f.filter.type)
					}
				});
				
				if (searchText) {
					querys.push({"$text": { $search: searchText } });
				}
				
				if (querys.length > 0) {
					final_query = {"$and": querys};
				}
				
				return final_query;
			},
			
			$get: function (context) {
				return filters[context] || [];
			}
		};
	});


	app.factory('Actions', ['$modal', '$q', function ($modal, $q) {
		var actions = [];
		
		return {
			registerAction: function (action) {
				actions.push(action);
			},

			runActionById: function(actionId, items) {
				var action = null;
				actions.forEach(function(a){
					if (a.id == actionId) {
						action = a;
					}
				});
				
				if (action){
					return this.runAction(action, items);
				}
				else {
					var deferred = $q.defer();
					deferred.resolve();
					return deferred.promise;
				}
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
					
					return modalInstance.result;
				};					
				
				if (action.beforeRun) {	
					return action.beforeRun(items).then(
						function(actionParams) {
							return doAction(actionParams);
						},
						function() {
							var deferred = $q.defer();
							deferred.resolve();
							return deferred.promise;
						}
					);
				}
				else {
					return doAction();
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