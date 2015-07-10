(function() {
	var statisticsModule = angular.module('statisticsModule',["ngRoute", "statisticsVideoControllerModule", "statisticsChannelControllerModule"]);
	
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
	
	
	
	
	statisticsModule.config(['$routeProvider','$compileProvider', function($routeProvider, $compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension):/);
		
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
	
	
	statisticsModule.controller('StatisticsController',["$scope", "$http", "$routeParams", "Video", "VideoStatistics", function($scope, $http, $routeParams, Video, VideoStatistics) {
	}]);	
	
})();