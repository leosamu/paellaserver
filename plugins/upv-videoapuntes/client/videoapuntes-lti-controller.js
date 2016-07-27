(function() {
	var plugin = angular.module('pluginUPVVideoapuntes');

		
	plugin.controller("VideoapuntesLTIStudentController", ["$scope", "$routeParams", "$http", "$location", function($scope, $routeParams, $http, $location) {
		$scope.loading = true;
		$scope.subjectFound = false;		
			
		$http.get('/rest/plugins/upv-videoapuntes/sakai/' + $routeParams.id + "/channel")
		.then(
			function(res){
				$scope.channelId = res.data.channel;
				$scope.loading = false;
				$scope.subjectFound = true;
			},
			function(){
				$scope.loading = false;				
			}
		)				
				
		$scope.goToSubjectRecordings = function() {
			$location.path('/catalog/channel/' + $scope.channelId)
		}
	}]);
	
	
	plugin.controller("VideoapuntesLTITeacherController", ["$scope", "$routeParams", "$http", "$location", function($scope, $routeParams, $http, $location) {
		$scope.loading = true;
		$scope.subjectFound = false;		
			
		$http.get('/rest/plugins/upv-videoapuntes/sakai/' + $routeParams.id + "/channel")
		.then(
			function(res){
				$scope.channelId = res.data.channel;
				$scope.loading = false;
				$scope.subjectFound = true;
			},
			function(){
				$scope.loading = false;				
			}
		)				
				
		$scope.applyARecording = function() {
			console.log("apply");
		};
		
		$scope.goToSubjectRecordings = function() {
			$location.path('/catalog/channel/' + $scope.channelId)
		}
	}]);	
	
	
})();