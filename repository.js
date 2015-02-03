
var express = require("express");

exports.setup = function(router,app) {
	var Repository = require(__dirname + '/models/repository');
	Repository.find()
       	.exec(function(err,data) {
       		data.forEach(function(repo) {
            	if (repo.path[0]=='/') app.use(repo.endpoint,express.static(repo.path));
            	else app.use(repo.endpoint,express.static(__dirname + '/' + repo.path));
       		});
        });
}
