var mongoose = require('mongoose');
var request = require('request');
var moment = require('moment');

var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');



exports.routes = {
	listRecordings: { get:[
		// TODO: Authenticate
		AuthController.EnsureAuthenticatedOrDigest,
		function(req, res) {			
			var recordingFrom = moment().startOf('day');
			if (req.query.start) {
				recordingFrom = moment(decodeURIComponent(req.query.start));
				if (recordingFrom.isValid() == false) {
					recordingFrom = moment(parseInt(decodeURIComponent(req.query.start)));
				}
				if (recordingFrom.isValid() == false) {
					return res.sendStatus(404);
				}				
			}
			
			var recordingTo = moment(recordingFrom).endOf('day');
			if (req.query.end) {
				recordingTo = moment(decodeURIComponent(req.query.end));
				if (recordingTo.isValid() == false) {
					recordingTo = moment(parseInt(decodeURIComponent(req.query.end)));
				}
				if (recordingTo.isValid() == false) {
					return res.sendStatus(404);
				}				
			}
			recordingFrom = recordingFrom.toDate();
			recordingTo = recordingTo.toDate();			
			
			var email = req.user.contactData.email;			
			var url = "https://videoapuntes.upv.es/rest/videoapuntes-notes?email="+email+"&recordingFrom="+recordingFrom.getTime()+"&recordingTo=" + recordingTo.getTime();

			request.post({
				url: url
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



