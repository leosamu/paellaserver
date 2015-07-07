(function() {
	var statisticsModule = angular.module('statisticsModule',["ngRoute"]);
	
	statisticsModule.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/statistics',{
				templateUrl: 'statistics/views/main.html',
				controller: "StatisticsController"
			});
	}]);	
	
	
	
	statisticsModule.controller('StatisticsController',["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {
		
		$scope.kibanaR = {
		  "took": 14,
		  "timed_out": false,
		  "_shards": {
		    "total": 5,
		    "successful": 5,
		    "failed": 0
		  },
		  "hits": {
		    "total": 167,
		    "max_score": 0,
		    "hits": []
		  },
		  "aggregations": {
		    "2": {
		      "buckets": [
		        {
		          "key_as_string": "2015-07-05T22:00:00.000Z",
		          "key": 1436133600000,
		          "doc_count": 22
		        },
		        {
		          "key_as_string": "2015-07-05T22:30:00.000Z",
		          "key": 1436135400000,
		          "doc_count": 15
		        },
		        {
		          "key_as_string": "2015-07-05T23:00:00.000Z",
		          "key": 1436137200000,
		          "doc_count": 10
		        },
		        {
		          "key_as_string": "2015-07-05T23:30:00.000Z",
		          "key": 1436139000000,
		          "doc_count": 11
		        },
		        {
		          "key_as_string": "2015-07-06T00:00:00.000Z",
		          "key": 1436140800000,
		          "doc_count": 10
		        },
		        {
		          "key_as_string": "2015-07-06T00:30:00.000Z",
		          "key": 1436142600000,
		          "doc_count": 14
		        },
		        {
		          "key_as_string": "2015-07-06T01:00:00.000Z",
		          "key": 1436144400000,
		          "doc_count": 9
		        },
		        {
		          "key_as_string": "2015-07-06T01:30:00.000Z",
		          "key": 1436146200000,
		          "doc_count": 2
		        },
		        {
		          "key_as_string": "2015-07-06T02:00:00.000Z",
		          "key": 1436148000000,
		          "doc_count": 4
		        },
		        {
		          "key_as_string": "2015-07-06T02:30:00.000Z",
		          "key": 1436149800000,
		          "doc_count": 12
		        },
		        {
		          "key_as_string": "2015-07-06T03:00:00.000Z",
		          "key": 1436151600000,
		          "doc_count": 8
		        },
		        {
		          "key_as_string": "2015-07-06T03:30:00.000Z",
		          "key": 1436153400000,
		          "doc_count": 19
		        },
		        {
		          "key_as_string": "2015-07-06T04:00:00.000Z",
		          "key": 1436155200000,
		          "doc_count": 11
		        },
		        {
		          "key_as_string": "2015-07-06T04:30:00.000Z",
		          "key": 1436157000000,
		          "doc_count": 7
		        },
		        {
		          "key_as_string": "2015-07-06T05:00:00.000Z",
		          "key": 1436158800000,
		          "doc_count": 3
		        },
		        {
		          "key_as_string": "2015-07-06T05:30:00.000Z",
		          "key": 1436160600000,
		          "doc_count": 3
		        },
		        {
		          "key_as_string": "2015-07-06T06:00:00.000Z",
		          "key": 1436162400000,
		          "doc_count": 7
		        }
		      ]
		    }
		  }
		};
		
		
var data = [
  {
    "key" : "Quantity",
    "bar": true,
    "values" : [ ]
  }
]


	console.log(data[0].values);
	
    var chart;
    nv.addGraph(function() {
        chart = nv.models.historicalBarChart();
        chart
        	.forceY([0,50])
            .margin({left: 100, bottom: 100})
            .useInteractiveGuideline(true)
            .duration(250)
            ;

        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis
            .axisLabel("Time (s)")
            //.tickFormat(d3.format(',.1f'));
			.tickFormat(function(d) { return d3.time.format('%H:%m')(new Date(d)) });
			
        chart.yAxis
            .axisLabel('Voltage (v)')
            .tickFormat(d3.format(',.2f'));

        chart.showXAxis(true);

        d3.select('#test1')
            .datum(kibanaData())
            .transition()
            .call(chart);

        nv.utils.windowResize(chart.update);
        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        return chart;
    });

    //Simple test data generators
    function sinAndCos() {
        var sin = [],
            cos = [];

        for (var i = 0; i < 100; i++) {
            sin.push({x: i, y: Math.sin(i/10)});
            cos.push({x: i, y: .5 * Math.cos(i/10)});
        }

        return [
            {values: sin, key: "Sine Wave", color: "#ff7f0e"},
            {values: cos, key: "Cosine Wave", color: "#2ca02c"}
        ];
    }

    function sinData() {
        var sin = [];

        for (var i = 0; i < 100; i++) {
            sin.push({x: i, y: Math.sin(i/10) * Math.random() * 100});
        }

		console.log(sin);
        return [{
            values: sin,
            key: "Sine Wave",
            color: "#ff7f0e"
        }];
    }


    function kibanaData() {
        var sin = [];

        $scope.kibanaR["aggregations"]["2"]["buckets"].forEach(function(a,i){	
			sin.push({x: a.key, y:a.doc_count});			
		});

		console.log(sin);
        return [{
            values: sin,
            key: "Sine Wave",
            color: "#ff7f0e"
        }];
    }





		
	}]);
	
	
})();