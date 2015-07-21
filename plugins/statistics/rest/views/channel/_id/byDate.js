var elasticsearch = require('elasticsearch')
var ChannelController = require(__dirname + '/../../../../../../controllers/channels');

exports.routes = {
	byCountry: { get: [
		ChannelController.LoadChannel,		
		function(req,res,next) {			
			
			var q = [];
			req.data.videos.forEach(function(v){
				q.push("video.videoId:\""+v._id+"\"")
			});			
			var query = q.join(" OR ");
			
			var byCountrySearch = {
			  "size": 0,
			  "aggs": {
			    "2": {
			      "date_histogram": {
			        "field": "date",
			        "interval": "30m",
			        "pre_zone": "+02:00",
			        "pre_zone_adjust_large_interval": true,
			        "min_doc_count": 1,
			        "extended_bounds": {
			          "min": 1436392800000,
			          "max": 1436479199999
			        }
			      }
			    }
			  },
			  "query": {
			    "filtered": {
			      "query": {
			        "query_string": {
			          "query": "event.type:\"paella:loadComplete\"",
			          "analyze_wildcard": true
			        }
			      },
			      "filter": {
			        "bool": {
			          "must": [
		  	            {
			              "query": {
			                "query_string": {
			                  "query": query,
			                  "analyze_wildcard": true
			                }
			              }
			            },				          
			            {
			              "query": {
			                "query_string": {
			                  "analyze_wildcard": true,
			                  "query": "*"
			                }
			              }
			            },
			            {
			              "range": {
			                "date": {
			                  "gte": req.query.fromDate, //1436392800000,
			                  "lte": req.query.toDate //1436479199999
			                }
			              }
			            }
			          ],
			          "must_not": []
			        }
			      }
			    }
			  },
			  "highlight": {
			    "pre_tags": [
			      "@kibana-highlighted-field@"
			    ],
			    "post_tags": [
			      "@/kibana-highlighted-field@"
			    ],
			    "fields": {
			      "*": {}
			    }
			  }
			};
			
			var f = new Date(parseInt(req.query.fromDate));
			var t = new Date(parseInt(req.query.toDate));
			
			var index = 'media2events-*'
			if (f.getUTCFullYear() == t.getUTCFullYear()) {
				if (f.getUTCMonth() == t.getUTCMonth()) {
					index = 'media2events-' + f.getUTCFullYear() + "." + ("0" + (f.getUTCMonth()+1)).slice(-2);
				}
				else {
					index = 'media2events-' + f.getUTCFullYear() + ".*";
				}
			}
			else {
				var ii = [];
				
				for(var y = f.getUTCFullYear(); y <= t.getUTCFullYear(); y++ ) {
					ii.push("media2events-" + y + ".*")
				}
				index = ii.join(",");
			}
						
			var client = new elasticsearch.Client({host: 'localhost:9200'});			
			client.search({
				index: index,
				body: byCountrySearch
			}, function (error, response) {
				if (error) {
					res.status(501);
					res.end();				
				}
				else {
					try {
						var ret = [];
						response.aggregations["2"].buckets.forEach(function(e){
							ret.push([e.key, e.doc_count]);
						});
						
						res.json(ret);					
					}
					catch(e) {
						res.status(501);
						res.end();						
					}
				}
			});
		}
	]}
};