var Catalog = require(__dirname + '/../../../../../models/catalog');
var Video = require(__dirname + '/../../../../../models/video');
var AuthController = require(__dirname + '/../../../../../controllers/auth');
var configure = require("../../../../../configure.js");

var request = require('request')
var Q = require('q');

exports.routes = {
	addVideos: {
		patch: [
			AuthController.CheckRole(['ADMIN']),			
			function(req, res) {
				/*
				body:
				{
					_id: 
					files: [
						{
							name: { type:String },
							tag: { type:String }
						}
					]
				*/			
			
				res.sendStatus(404);
			}			
		]
	}	

}
