(function() {
	var loginModule = angular.module('loginModule');

	loginModule.directive('authorField', function() {
		return {
			restrict: "E",
			templateUrl:"login/directives/author-field.html",
			scope:{
				id:"=",
				name:"=",
				lastName:"=",
				email:"="
			},
			controller:["$scope", 'User', function($scope, User) {
				var searchTimer = null;
				$scope.searching = false;
				$scope.found = false;
				$scope.searchDone = false;

				function searchAuthor() {
					User.searchMail({email:$scope.email}).$promise
						.then(function(data) {
							if (data.length) {
								$scope.id = data[0].id;
								$scope.name = data[0].name;
								$scope.lastName = data[0].lastName;
							}
							else {
								$scope.id = null;
								$scope.name = null;
								$scope.lastName = null;
							}
							$scope.searching = false;
							$scope.searchDone = true;
							$scope.found = data.length>0;
						});
				}

				$scope.mailChanged = function() {
					$scope.found = false;
					$scope.searching = true;
					$scope.searchDone = false;
					if (searchTimer) clearTimeout(searchTimer);
					searchTimer = setTimeout(function() {
						searchAuthor();
					}, 1000);
				}
			}]
		};
	});
})();