var elasticsearch = require('elasticsearch')

exports.routes = {
	byCountry: { get: [
		function(req,res,next) {
			
			var filters_must = [
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
			];
			
			if (req.query.id) {			
				filters_must.push({
					"query": {
						"match": {
						  "video.videoId": {
						    "query": req.query.id,
						    "type": "phrase"
						  }
						}
					}
				});
			}
			
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
			          "must": filters_must,
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