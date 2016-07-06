(function() {
	var loginModule = angular.module('loginModule');

	loginModule.controller('AuthorSearchController', ["$scope", "$modalInstance", 'User', function($scope, $modalInstance, User) {
		var searchTimer = null;
		$scope.searching = false;
		$scope.searchDone = false;
		$scope.searchString = "";
		$scope.authorData = {};
		$scope.resultList = [];

		function searchAuthor() {
			User.searchName({search:$scope.searchString}).$promise
				.then(function(data) {
					$scope.resultList = [];
					data.forEach(function(resultItem) {
						$scope.resultList.push({
							id:resultItem.id,
							name:resultItem.name,
							lastName:resultItem.lastName
						});
					});
					$scope.searching = false;
					$scope.searchDone = true;
				});
		}

		$scope.selectResult = function(authorData) {
			$scope.authorData = authorData;
			$modalInstance.close($scope.authorData);
		};

		$scope.doSearch = function() {
			$scope.found = false;
			$scope.searching = true;
			$scope.searchDone = false;
			if (searchTimer) clearTimeout(searchTimer);
			searchTimer = setTimeout(function() {
				searchAuthor();
			}, 1000);
		};

		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.accept = function() {
			$modalInstance.close($scope.authorData);
		};
	}]);

	loginModule.factory('AuthorSearch', ['$modal',function($modal) {
		return function(onSelected) {
			var modalInstance = $modal.open({
				templateUrl:'login/directives/author-search.html',
				controller:'AuthorSearchController',
				resolve:{}
			});

			modalInstance.result.then(function(selected) {
				if (typeof(onSelected)=='function') onSelected(selected);
			});
		};
	}]);
})();
