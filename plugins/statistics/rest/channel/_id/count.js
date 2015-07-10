var elasticsearch = require('elasticsearch')
var ChannelController = require(__dirname + '/../../../../../controllers/channels');

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
			  "aggs": {},
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
			                  "gte": 1436392800000,
			                  "lte": 1436479199999
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
			
			var client = new elasticsearch.Client({host: 'localhost:9200'});			
			client.search({
				index: 'media2events-*',
				body: byCountrySearch
			}, function (error, response) {
				if (error) {
					res.status(501);
					res.end();				
				}
				else {
					try {
						res.json({count: response.hits.total});
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