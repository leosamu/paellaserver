var request = require('request');

var uri ="http://tars01.cc.upv.es/api/v3/speech/status?id=up-b8339d6e-b225-4b6d-a955-acce476d5a74&user=admin&auth_token=33969b3813cb267e7d5ec056012f00967033a7b12f64d0959700fea52bed0218"

var url = "http://tars01.cc.upv.es/api/v3/speech/status"


request.get(uri,
	function(error, response, body) {
		console.log(error);
	}
);