var mongoose = require('mongoose');

var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');
var dummyreocording  = [{'_id':'3a0a9920-31cc-11e4-9c5c-db15cd9c177e',
					     'presenter' : {
						 		'name' : 'José Felipe Villanueva López',
						 		 'email' : 'jovillo0@upvnet.upv.es'
    									},
    					 'startRecord':'2015-05-04T06:30:00.000Z',
    					 'duration':130,
    					 'title':'Econometría Presentación',
    					 'privacy' : {
						        'type' : 'sakai',
						        'sakai' : 'GRA_11762_2014'
						 },
    					 'schoolroom' : {
	    					 'name':{
		    					 'campus' : 'Valencia',
								 'department' : 'ETSIT',
			    				 'building' : '4D',
								 'schoolroom' : 'B5'	 
	    					 },
	    					 'space':'V.4D.0.039',
	    					 'lat':0.123,
	    					 'lon':0.133
    					 }},
    					 {'_id':'3933c120-31cc-11e4-9c5c-db15cd9c177e',
						    'presenter' : {
						'name' : 'José Felipe Villanueva López',
						'email' : 'jovillo0@upvnet.upv.es'
						    },
						    'startRecord':'2015-05-05T06:30:00.000Z',
						    'duration':130,
						    'title':'Econometría Presentación',
						    'privacy' : {
						       'type' : 'sakai',
						       'sakai' : 'GRA_11762_2014'
						},
						    'schoolroom' : {
						   	'name':{
						   	'campus' : 'Valencia',
						'department' : 'ETSIT',
						   	'building' : '4D',
						'schoolroom' : 'B5'	 
						   	},
						   	'space':'V.4D.0.039',
						   	'lat':0.123,
						   	'lon':0.133
						    }},
						    {'_id':'38cb3b50-31cc-11e4-9c5c-db15cd9c177e',
						    'presenter' : {
						'name' : 'José Felipe Villanueva López',
						'email' : 'jovillo0@upvnet.upv.es'
						    },
						    'startRecord':'2015-05-06T06:30:00.000Z',
						    'duration':130,
						    'title':'Econometría Presentación',
						    'privacy' : {
						       'type' : 'public',
						},
						    'schoolroom' : {
						   	'name':{
						   	'campus' : 'Valencia',
						'department' : 'ETSIT',
						   	'building' : '4D',
						'schoolroom' : 'B5'	 
						   	},
						   	'space':'V.4D.0.039',
						   	'lat':0.123,
						   	'lon':0.133
						    }}]
exports.routes = {
	listRecordings: { get:[
		CommonController.Paginate,
		function(req, res, next) {
			//if (req.query.filters) {
				req.data = dummyreocording;
			//}
			next();
		},				
		CommonController.JsonResponse] }
};