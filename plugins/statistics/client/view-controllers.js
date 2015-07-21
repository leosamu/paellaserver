(function() {
	var statisticsModule = angular.module('statisticsViewModule',["ngRoute", "catalogModule"]);
		
	statisticsModule.factory("VideoStatistics", ['$resource', function VideoFactory($resource) {
		return $resource("/rest/plugins/statistics/views/video", {}, {
			byAuthor: { url:"/rest/plugins/statistics/views/video/byAuthor", isArray:true },
			byCatalog: { url:"/rest/plugins/statistics/views/video/byCatalog", isArray:true },
			byCountry: { url:"/rest/plugins/statistics/views/video/byCountry", isArray:true },
			byDate: { url:"/rest/plugins/statistics/views/video/byDate", isArray:true },
			count: {url:"/rest/plugins/statistics/views/video/count"}
		});
	}]);	
	
	statisticsModule.factory("ChannelStatistics", ['$resource', function ChannelFactory($resource) {
		return $resource("/rest/plugins/statistics/views/channel/:id", {}, {
			byCountry: { url:"/rest/plugins/statistics/views/channel/:id/byCountry", isArray:true },
			byDate: { url:"/rest/plugins/statistics/views/channel/:id/byDate", isArray:true },
			count: {url:"/rest/plugins/statistics/views/channel/:id/count"}
		});
	}]);		
	

	statisticsModule.controller('ViewVideoStatisticsController',["$scope", "$routeParams", "Video", "VideoStatistics", function($scope, $routeParams, Video, VideoStatistics) {		
		$scope.$on('reloadStats', function() {
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
		
		$scope.changeInterval('today');
			
		google.load('visualization', '1', {
			'packages':['corechart'],
			'callback': function() {				
				// Update the model to activate the chart on the DOM
				// Note the use of $scope.$apply since we're in the 
				// Google Loader callback.	            
				$scope.$apply(function(){
					$scope.activateChart = true;
					$scope.$parent.reloadStats();
				});	
			}
		});
		
		Video.get({id:$routeParams.id}, function(result) {
			$scope.$parent.header = {
				title: result.title,
				link: "/player/?autoplay=true&id="+result._id,
			}			
		});
	}]);	
	
	statisticsModule.controller('ViewMainStatisticsController',["$scope", "$routeParams", "Video", "VideoStatistics", function($scope, $routeParams, Video, VideoStatistics) {		
		$scope.$on('reloadStats', function() {
			VideoStatistics.count({fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
				$scope.numVisits = ret.count;
			});
			
			if ($scope.activateChart === true) {
				VideoStatistics.byDate({fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
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
					        
				VideoStatistics.byCountry({fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
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
				
				VideoStatistics.byCatalog({fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
					$scope.byCatalog = ret;
					
					var csv = '"Catalog"\t"Number of visits"\n';	
					ret.forEach(function(e) {												
						csv = csv + '"' + e[0] + '"\t ' + e[1] + '\n'
					});
					$scope.byCatalogDownload = "data:text/plain;base64," + btoa(csv);					
					
				});				
				VideoStatistics.byAuthor({fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
					$scope.byAuthor = ret;
					
					var csv = '"Author"\t"Number of visits"\n';	
					ret.forEach(function(e) {												
						csv = csv + '"' + e[0] + '"\t ' + e[1] + '\n'
					});
					$scope.byAuthorDownload = "data:text/plain;base64," + btoa(csv);
				});				
			}
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
		
		$scope.changeInterval('today');
			
		google.load('visualization', '1', {
			'packages':['corechart'],
			'callback': function() {				
				// Update the model to activate the chart on the DOM
				// Note the use of $scope.$apply since we're in the 
				// Google Loader callback.	            
				$scope.$apply(function(){
					$scope.activateChart = true;
					$scope.$parent.reloadStats();
				});	
			}
		});
		
		$scope.$parent.header = {
			title: "Video Views Statistics"
		}		
	}]);



	statisticsModule.controller('ViewChannelStatisticsController',["$scope", "$routeParams", "Channel", "ChannelStatistics", function($scope, $routeParams, Channel, ChannelStatistics) {
		
		$scope.$on('reloadStats', function() {
			ChannelStatistics.count({id:$routeParams.id, fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
				$scope.numVisits = ret.count;
			});			
			
			if ($scope.activateChart === true) {
				ChannelStatistics.byDate({id:$routeParams.id, fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
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
					        
				ChannelStatistics.byCountry({id:$routeParams.id, fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
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
			}
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
		
		$scope.changeInterval('today');
					
		google.load('visualization', '1', {
			'packages':['corechart'],
			'callback': function() {
				// Update the model to activate the chart on the DOM
				// Note the use of $scope.$apply since we're in the 
				// Google Loader callback.	            
				$scope.$apply(function(){
					$scope.activateChart = true;
					$scope.$parent.reloadStats();
				});
			}
		});
        
		Channel.all({id:$routeParams.id}, function(result) {
			$scope.$parent.header = {
				title: result.title,
				link: "#/catalog/channel/"+result._id,
			}								
		});

	}]);





})();