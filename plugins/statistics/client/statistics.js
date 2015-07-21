(function() {
	var statisticsModule = angular.module('statisticsModule',["ngRoute", "statisticsViewModule"]);

	statisticsModule.directive("headerTimeSelector",function(){  
		return{
			restrict : "E",
			templateUrl: "statistics/views/headerTimeSelector.html"
		};
	});

	
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
			when('/statistics/views',{
				templateUrl: 'statistics/views/views/main.html',
				controller: "StatisticsController"
			}).
			when('/statistics/views/video/:id',{
				templateUrl: 'statistics/views/views/video.html',
				controller: "StatisticsController"
			}).
			when('/statistics/views/user/:id',{
				templateUrl: 'statistics/views/views/user.html',
				controller: "StatisticsController"
			}).
			when('/statistics/views/channel/:id',{
				templateUrl: 'statistics/views/views/channel.html',
				controller: "StatisticsController"
			});
	}]);	
	
		
	statisticsModule.controller('StatisticsController',["$scope", "$http", "$routeParams", "Statistics", function($scope, $http, $routeParams, Statistics) {
		
		$scope.reloadStats = function() {
			$scope.$broadcast('reloadStats');
		};
		
		$scope.changeTimeInterval = function(fd, td){
				$scope.fromDate = $scope.fromDateInput = fd;
				$scope.toDate = $scope.toDateInput = td;
				$scope.reloadStats();
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
			if (val == 'yesterday') {
				$scope.changeTimeInterval( moment().subtract(1,'day').startOf('day').toDate(), $scope.toDate = moment().subtract(1,'day').endOf('day').toDate() );
			}
			else if (val == 'lastweek') {
				$scope.changeTimeInterval( moment().subtract(1,'week').startOf('week').toDate(), $scope.toDate = moment().subtract(1,'week').endOf('week').toDate() );
			}
			else if (val == 'lastmonth') {
				$scope.changeTimeInterval( moment().subtract(1,'month').startOf('month').toDate(), $scope.toDate = moment().subtract(1,'month').endOf('month').toDate() );
			}
			else if (val == 'lastyear') {
				$scope.changeTimeInterval( moment().subtract(1,'year').startOf('year').toDate(), $scope.toDate = moment().subtract(1,'year').endOf('year').toDate() );
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
		
	}]);

	
	statisticsModule.factory("Statistics", ['$resource', function ChannelFactory($resource) {
		return $resource("/rest/plugins/statistics/added", {}, {
			count: {url:"/rest/plugins/statistics/added/count"},
			added: {url:"/rest/plugins/statistics/added/video/added"},
			byOwner: {url:"/rest/plugins/statistics/added/video/byOwner", isArray:true}
		});
	}]);		
	
	statisticsModule.controller('VideoaAddedStatisticsController',["$scope", "$routeParams", "Statistics", function($scope, $routeParams, Statistics) {		

		$scope.$parent.header = {
			title: "Main Video Repository Statistics"
		}

		$scope.$on('reloadStats', function() {
			Statistics.count({id:$routeParams.id, fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
				$scope.numVisits = ret.count;
			});
			Statistics.added({id:$routeParams.id, fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
				$scope.videosAdded = ret;
			});
			Statistics.byOwner({id:$routeParams.id, fromDate: $scope.fromDate.getTime(), toDate:$scope.toDate.getTime()}, function(ret){
				$scope.byOwner = ret;
			});
		});
		
		$scope.changeInterval('month');
	}]);	
	
})();