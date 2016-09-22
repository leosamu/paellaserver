(function() {

	var plugin = angular.module('paellaserver');
	

	/***** Action:
		{
			label: string,		// string to show in UI
			context: [string],	// contexts where the action is visible
			roles: [string],	// roles allowed to run this action
			
			isDisabled: function(items) {} 				// return a value (true/false)  Disabled in UI?

			beforeRun: function(items)					// return a promise [continueRunning, items, actionParams]
			runAction: function(item, actionParams) {}	// return promise
		}
	*/


	/***** Contexts:
		
		user-videos-list
		user-video-detail
		user-channels-list
		user-channel-datil		
	
	*/


	plugin.factory('ItemActions', ['$modal', '$q', 'User', 'runInSequence',  function ($modal, $q, User, runInSequence) {
		var actions = [];
				
		return {
			registerAction: function (action) {
				if (angular.isUndefined(action.roles)) {
					action.roles = [];
				}			
				if (angular.isUndefined(action.isDisabled)) {
					action.isDisabled = function(items) {return false;}
				}			
				if (angular.isUndefined(action.beforeRun)) {
					action.beforeRun = function(items) {return [true, items, undefined];}
				}
				if (angular.isUndefined(action.runAction)) {
					action.runAction = function(item, actionParams) {return;}
				}
				actions.push(action);
			},
						
			$getActionsForUser: function (user, context) {
				var ret = [];
				this.$get(context).forEach(function(a){
					if (a.roles.length >0) {
						var hasRole = a.roles.some(function(ar) {
							return user.roles.some(function(ur) {
								return ( (ar==ur) || (ur.isAdmin) );
							});
						});
						if (hasRole) { ret.push(a); }
					}
					else {
						ret.push(a);
					}
				});
								
				return ret;
			},

			$get: function (context) {
				var ret = [];
				actions.forEach(function(a) {
					var hasContext = a.context.some(function(c) { return c == context; })
					if (hasContext) { ret.push(a); }
				});
				return ret;
			},
			
			runAction: function(action, items) {									
				return User.current().$promise
				.then(function(currentUser) {
					return true; //action.userCanUse(currentUser);
				})
				.then(function(canUse){
					if (canUse) {
						return action.beforeRun(items)
					}
					else {
						return $q.reject("User can not run this action");
					}
				})
				.then(function(value) {
					if (angular.isArray(value)==false) { value = [value]; }
					var continueRunning = value[0]
					var items2 = value[1];
					var actionParams = value[2]
					
					if (!continueRunning) {
						return $q.resolve()					
					}
					else {
						var modalInstance = $modal.open({
							templateUrl:"app/directives/item-actions.html",
							size: '',
							backdrop: 'static',
							keyboard: false,
							resolve: {
								action: function() { return action; },
								items: function () { return items2;	}
							},
							controller: function ($scope, $modalInstance, items, action) {
													
								$scope.action = action;
								$scope.successError = 0;
								$scope.successCompleted = 0;
								$scope.totalActions = items.length;
								$scope.finished = false;
				
								$scope.accept = function () {
									$modalInstance.close();
								};						
		
								
								function runInSequence2(arr, doSomethingAsync) {
									return arr.reduce(function (promise, item) {	
										return promise.then(function(result) {        
											var p = doSomethingAsync(item);			
											function next(v) {
												return result.concat(p);	        
											}
											return p.then(next, next);
										});
									}, $q.when([]));
								}

								runInSequence(items, function(i){									
									return $q.when(action.runAction(i, actionParams))
									.then(
										function(value)  { $scope.successCompleted = $scope.successCompleted + 1; },
										function(reason) { $scope.successError = $scope.successError + 1; }
									);																		
								})
								.finally(
									function() { $scope.finished = true; }
								);				
							}
						});	
						
						return modalInstance.result;
					}						
				});
			
			}
		};
	}]);
	
	
	plugin.directive('itemActionsDropdown', function(){
		return {
			restrict: 'E',
			scope: {
				elements: "=",
				type: "=",
				size: "="
			},		
			templateUrl: 'app/directives/item-actions-dropdown.html',
			controller: ["$scope", "ItemActions", "User", function($scope, ItemActions, User) {
	
				$scope.$watch('type', function(context){
					User.current().$promise
					.then(function(user){
						$scope.actions = ItemActions.$getActionsForUser(user, context);
					});
				
				});
			
				function getSelectedItems(){
					var selectedElements= [];
					if ($scope.elements) {
						$scope.elements.forEach(function(e){
							if (e.selected) {
								selectedElements.push(e);
							}
						});
					}
					return selectedElements;
				}
				
				$scope.isDisabled = function(action) {
					return action.isDisabled(getSelectedItems());					
				};
				
				$scope.doAction = function(action) {
					var selectedElements = getSelectedItems();
					if (action.isDisabled(selectedElements) == false){
						ItemActions.runAction(action, selectedElements);
					}
				};	
			}]
		};
	});	
	
	
	
})();