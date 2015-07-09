(function() {
	var statisticsModule = angular.module('statisticsModule',["ngRoute", "catalogModule"]);
	
	statisticsModule.factory("VideoStatistics", ['$resource', function VideoFactory($resource) {
		return $resource("/plugins/statistics/rest/video/:id", {}, {
			byCountry: { url:"/plugins/statistics/rest/video/:id/byCountry", isArray:true },
			byDate: { url:"/plugins/statistics/rest/video/:id/byDate", isArray:true },
			count: {url:"/plugins/statistics/rest/video/:id/count"}
		});
	}]);	
	
	statisticsModule.directive("googleChart",function(){  
	    return{
	        restrict : "A",
	        link: function($scope, $elem, $attr){
	            var model;
	
	            // Function to run when the trigger is activated
	            var initChart = function() {
	
	                // Run $eval on the $scope model passed 
	                // as an HTML attribute
	                model = $scope.$eval($attr.ngModel);
	                
	                // If the model is defined on the scope,
	                // grab the dataTable that was set up
	                // during the Google Loader callback
	                // function, and draw the chart
	                if (model) {
	                    var dt = model.dataTable,
	                        options = model.options,
	                        chartType = $attr.googleChart;
	
	                    if (model.title) {
	                        options.title = model.title;
	                    }
	                    
	                    var googleChart = new google.visualization[chartType]($elem[0]);
	                    googleChart.draw(dt,options)
	                }
	            };	

	            $scope.$watchCollection($attr.ngModel, function(val){
	                if ($scope[$attr.trigger] === true) {
	                    initChart(); 
	                }
	            });
	            // Watch the scope value placed on the trigger attribute
	            // if it ever flips to true, activate the chart
	            $scope.$watch($attr.trigger, function(val){
	                if (val === true) {
	                    initChart(); 
	                }
	            });	            
	            
				//create trigger to resizeEnd event     
				$(window).resize(function() {
					var resizeTimer = $scope[$attr.ngModel].resizeTimer;
				    if(resizeTimer) clearTimeout(resizeTimer);
				    resizeTimer = setTimeout(function() {
       				    if ($scope[$attr.trigger] === true) {
		                    initChart(); 
						}
				    }, 500);
				});	            
	        }
	    }
	});	
	
	
	
	
	statisticsModule.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/statistics',{
				templateUrl: 'statistics/views/main.html',
				controller: "StatisticsController"
			}).
			when('/statistics/video/:id',{
				templateUrl: 'statistics/views/video.html',
				controller: "VideoStatisticsController"
			}).
			when('/statistics/channel/:id',{
				templateUrl: 'statistics/views/channel.html',
				controller: "ChannelStatisticsController"
			});
	}]);	
	
	
	
	statisticsModule.controller('VideoStatisticsController',["$scope", "$http", "$routeParams", "Video", "VideoStatistics", function($scope, $http, $routeParams, Video, VideoStatistics) {

		Video.get({id:$routeParams.id}, function(result) {
			$scope.video = result;
		});
		VideoStatistics.count({id:$routeParams.id}, function(ret){
			$scope.numVisits = ret.count;
			$scope.loaded.count = true;
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
				VideoStatistics.byDate({id:$routeParams.id}, function(ret){
					$scope.byDateChart.dataTable = new google.visualization.DataTable();					
					$scope.byDateChart.dataTable.addColumn('datetime', 'Date');
					$scope.byDateChart.dataTable.addColumn('number', 'Num');
					 					
					ret.forEach(function(e){	
						$scope.byDateChart.dataTable.addRow([new Date(e[0]), e[1]]);
					});
				});
					        
				VideoStatistics.byCountry({id:$routeParams.id}, function(ret){
					$scope.byCountryChart.dataTable = new google.visualization.DataTable();
					$scope.byCountryChart.dataTable.addColumn('string', 'Country');
					$scope.byCountryChart.dataTable.addColumn('number', 'Num');
					
					ret.forEach(function(e) {						
						$scope.byCountryChart.dataTable.addRow([e[0], e[1]]);
					});
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
	
	
	statisticsModule.controller('StatisticsController',["$scope", "$http", "$routeParams", "Video", "VideoStatistics", function($scope, $http, $routeParams, Video, VideoStatistics) {
	}]);
	
	statisticsModule.controller('ChannelStatisticsController',["$scope", "$http", "$routeParams", "Video", "VideoStatistics", function($scope, $http, $routeParams, Channel, ChannelStatistics) {
		Channel.get({id:$routeParams.id}, function(result) {
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
					$scope.byDateChart.dataTable.addColumn('number', 'Num');
					 					
					ret.forEach(function(e){	
						$scope.byDateChart.dataTable.addRow([new Date(e[0]), e[1]]);
					});
				});
					        
				ChannelStatistics.byCountry({id:$routeParams.id}, function(ret){
					$scope.byCountryChart.dataTable = new google.visualization.DataTable();
					$scope.byCountryChart.dataTable.addColumn('string', 'Country');
					$scope.byCountryChart.dataTable.addColumn('number', 'Num');
					
					ret.forEach(function(e) {						
						$scope.byCountryChart.dataTable.addRow([e[0], e[1]]);
					});
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