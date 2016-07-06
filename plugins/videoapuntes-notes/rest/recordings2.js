var mongoose = require('mongoose');
var request = require('request');
var moment = require('moment');

var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');



exports.routes = {
	listRecordings: { get:[
		// TODO: Authenticate
		function(req, res) {			
			var recordingFrom = moment().startOf('day').toDate();
			if (req.query.start) {
				recordingFrom = moment(decodeURIComponent(req.query.start));
				if (recordingFrom.isValid() == false) {
					recordingFrom = moment(parseInt(decodeURIComponent(req.query.start)));
				}
				if (recordingFrom.isValid() == false) {
					return res.sendStatus(404);
				}				
			}
			
			var recordingTo = moment(recordingFrom).endOf('day').toDate();
			if (req.query.end) {
				recordingTo = moment(decodeURIComponent(req.query.end));
				if (recordingTo.isValid() == false) {
					recordingTo = moment(parseInt(decodeURIComponent(req.query.end)));
				}
				if (recordingTo.isValid() == false) {
					return res.sendStatus(404);
				}				
			}
			
			
			var email = "carbagi@ade.upv.es";			
			recordingFrom = recordingFrom.toDate();
			recordingTo = recordingTo.toDate();
			
			request.post({
				url: "https://videoapuntes.upv.es/rest/videoapuntes-notes?email="+email+"&recordingFrom="+recordingFrom+"&recordingTo=" + recordingTo
			}, function(error, response, body) {
				if (error) {
					res.status(500).send(error);
				}
				else if (response.statusCode == 200) {				
					res.send(JSON.parse(body));
				}
				else {
					console.log(body);
					res.sendStatus(500);
				}
			});							
		}				
	]}
};



