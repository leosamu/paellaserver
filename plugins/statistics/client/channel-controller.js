(function() {
	var statisticsModule = angular.module('statisticsChannelControllerModule',["ngRoute", "catalogModule"]);
	
		statisticsModule.factory("ChannelStatistics", ['$resource', function ChannelFactory($resource) {
			return $resource("/plugins/statistics/rest/channel/:id", {}, {
				byCountry: { url:"/plugins/statistics/rest/channel/:id/byCountry", isArray:true },
				byDate: { url:"/plugins/statistics/rest/channel/:id/byDate", isArray:true },
				count: {url:"/plugins/statistics/rest/channel/:id/count"}
			});
		}]);	
		
		statisticsModule.controller('ChannelStatisticsController',["$scope", "$http", "$routeParams", "Channel", "ChannelStatistics", function($scope, $http, $routeParams, Channel, ChannelStatistics) {		
		
		Channel.all({id:$routeParams.id}, function(result) {
			$scope.channel = result;
		});
		ChannelStatistics.count({id:$routeParams.id}, function(ret){
			$scope.numVisits = ret.count;
		});

		
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
			
		google.load('visualization', '1', {
            'packages':['corechart'],
            'callback': function() {
				ChannelStatistics.byDate({id:$routeParams.id}, function(ret){
					$scope.byDateChart.dataTable = new google.visualization.DataTable();					
					$scope.byDateChart.dataTable.addColumn('datetime', 'Date');
					$scope.byDateChart.dataTable.addColumn('number', 'Visits');
					 				
					var csv = "";	
					ret.forEach(function(e){	
						$scope.byDateChart.dataTable.addRow([new Date(e[0]), e[1]]);
						csv = csv + e[0] + ', ' + e[1] + '\n'
					});					
					$scope.byDateDownload = "data:text/plain;base64," + btoa(csv);
				});
					        
				ChannelStatistics.byCountry({id:$routeParams.id}, function(ret){
					$scope.byCountryChart.dataTable = new google.visualization.DataTable();
					$scope.byCountryChart.dataTable.addColumn('string', 'Country');
					$scope.byCountryChart.dataTable.addColumn('number', 'Visits');
					
					var csv = "";	
					ret.forEach(function(e) {						
						$scope.byCountryChart.dataTable.addRow([e[0], e[1]]);
						csv = csv + '"' + e[0] + '", ' + e[1] + '\n'
					});
					$scope.byCountryDownload = "data:text/plain;base64," + btoa(csv);					
				});
				
				// Update the model to activate the chart on the DOM
				// Note the use of $scope.$apply since we're in the 
				// Google Loader callback.	            
				$scope.$apply(function(){
					$scope.activateChart = true;    
				});	            
			}
        });
	}]);
	
})();