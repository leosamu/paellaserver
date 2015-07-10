var elasticsearch = require('elasticsearch')

exports.routes = {
	byCountry: { get: [
		function(req,res,next) {
			
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
			                "match": {
			                  "video.videoId": {
			                    "query": req.params.id,
			                    "type": "phrase"
			                  }
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