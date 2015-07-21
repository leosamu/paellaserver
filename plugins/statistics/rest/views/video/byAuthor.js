var User = require(__dirname + '/../../../../../models/user.js');
var elasticsearch = require('elasticsearch');
var Q = require('q');

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
						
			var byCountrySearch = JSON.stringify({
			  "size": 0,
			  "aggs": {
			    "2": {
			      "terms": {
			        "field": "video.owner.id",
			        "size": 10,
			        "order": {
			          "_count": "desc"
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
			});
			
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
						var P = null;
						var ret = [];
						response.aggregations["2"].buckets.forEach(function(e){
							//console.log("--");
							/*
							if (P == null) {
								console.log("1");
								P = User.findOne({_id: e.key}, function(err, user){
									console.log("1. " + e.key);
									ret.push([e.key, e.doc_count]);								
								});
							}
							
							else {
								console.log("uu");
								
								P.then(function(){
									console.log("ii");
									return User.findOne({_id: e.key}, function(err, user){
										console.log(e.key);
										ret.push([e.key, e.doc_count]);
									});
								});								
							}
							*/
						});
						/*
						P.then(function(){
							console.log("end");
							res.json(ret);							
						});
						*/
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