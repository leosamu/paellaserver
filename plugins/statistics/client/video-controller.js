(function() {
	var statisticsModule = angular.module('statisticsVideoControllerModule',["ngRoute", "catalogModule"]);
		
	statisticsModule.factory("VideoStatistics", ['$resource', function VideoFactory($resource) {
		return $resource("/plugins/statistics/rest/video/:id", {}, {
			byCountry: { url:"/plugins/statistics/rest/video/:id/byCountry", isArray:true },
			byDate: { url:"/plugins/statistics/rest/video/:id/byDate", isArray:true },
			count: {url:"/plugins/statistics/rest/video/:id/count"}
		});
	}]);	
	
	statisticsModule.controller('VideoStatisticsController',["$scope", "$http", "$routeParams", "Video", "VideoStatistics", function($scope, $http, $routeParams, Video, VideoStatistics) {		

		$scope.changeTimeInterval = function(fd, td){
				$scope.fromDate = $scope.fromDateInput = fd;
				$scope.toDate = $scope.toDateInput = td;
				reloadStats();
		};
		
		$scope.changeInterval = function(val){
			if (val == 'today') {
				$scope.changeTimeInterval( moment().startOf('day').toDate(), $scope.toDate = moment().endOf('day').toDate() );
			}
			else if (val == 'week') {
				$scope.changeTimeInterval( moment().startOf('week').toDate(), $scope.toDate = moment().endOf('week').toDate() );
			}
			else if (val == 'month') {
				$scope.changeTimeInterval( moment().startOf('month').toDate(), $scope.toDate = moment().endOf('month').toDate() );
			}
			else if (val == 'year') {
				$scope.changeTimeInterval( moment().startOf('year').toDate(), $scope.toDate = moment().endOf('year').toDate() );
			}
			else if (val == 'course') {
				var f = moment()
				var m = f.month();
				if (m<8) {
					f = f.subtract(1, 'year')
				}
				f.month(8);
				f = f.startOf('month');
				t = moment(f).add(1,'year').subtract(1, 'second');
				$scope.changeTimeInterval(f.toDate(), t.toDate());
			}
			else if (val == 'semester') {
				//$scope.fromDate = moment().startOf('year').toDate();
				//$scope.toDate = moment().endOf('year').toDate();
				//reloadStats();
			}
		};

		// activateChart flips to true once the Google . Loader callback fires
	    $scope.activateChart = false;
	    
		// This is where my data model will be stored.
		$scope.byDateChart = {
		    dataTable: null,
		    options:{
		        legend: { position: 'none' }
		    }
		};
		$scope.byCountryChart = {
		    dataTable: {},
		    options: {}
		};
		
		$scope.changeInterval('today');
			
		google.load('visualization', '1', {
			'packages':['corechart'],
			'callback': function() {				
				// Update the model to activate the chart on the DOM
				// Note the use of $scope.$apply since we're in the 
				// Google Loader callback.	            
				$scope.$apply(function(){
					$scope.activateChart = true;
					reloadStats();
				});				
			}
		});
		
		Video.get({id:$routeParams.id}, function(result) {
			$scope.video = result;
		});

		
		function reloadStats() {
			VideoStatistics.count({id:$routeParams.id, fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
				$scope.numVisits = ret.count;
			});
			
			if ($scope.activateChart === true) {
				VideoStatistics.byDate({id:$routeParams.id, fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
					$scope.byDateChart.dataTable = new google.visualization.DataTable();					
					$scope.byDateChart.dataTable.addColumn('datetime', 'Date');
					$scope.byDateChart.dataTable.addColumn('number', 'Visits');
					 				
					var csv = '"Number of milliseconds since 1st Jan 1970 (GMT)"\t"Number of days since 1st Jan 1900 (GMT)"\t"Number of visits"\n';	
					ret.forEach(function(e){	
						$scope.byDateChart.dataTable.addRow([new Date(e[0]), e[1]]);
						csv = csv + e[0] + '\t ' + ((e[0]/86400000)+25569) + '\t' + e[1] + '\n'
					});					
					$scope.byDateDownload = "data:text/plain;base64," + btoa(csv);
				});
					        
				VideoStatistics.byCountry({id:$routeParams.id, fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
					$scope.byCountryChart.dataTable = new google.visualization.DataTable();
					$scope.byCountryChart.dataTable.addColumn('string', 'Country');
					$scope.byCountryChart.dataTable.addColumn('number', 'Visits');
					
					var csv = '"Country"\t"Number of visits"\n';	
					ret.forEach(function(e) {						
						$scope.byCountryChart.dataTable.addRow([e[0], e[1]]);
						csv = csv + '"' + e[0] + '"\t ' + e[1] + '\n'
					});
					$scope.byCountryDownload = "data:text/plain;base64," + btoa(csv);					
				});
			}
		}
						
	}]);
	
})();