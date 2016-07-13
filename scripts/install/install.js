var mongoose = require("mongoose");
var program = require('commander');
var configFile = require("../../config.json");
var Q = require('q');
const fs = require('fs');
const path = require('path');

/*
program
	.version('0.0.1')
	.usage('[options] value')
	.option('-v, --verbose', 'Verbose')
	.option('-o, --opt [value]', 'Verbose')
	.parse(process.argv);
 */

 
program
	.version('0.0.1')
	.option('-v, --verbose', 'Verbose')


program
	.command('installdb')
	.description('Install the default Data Base')
//	.option("-s, --setup_mode [mode]", "Which setup mode to use")
	.action(function (cmd, env) {		


		mongoose.connect(configFile.db.url, function(err, res) {
			if (err) {
				throw err;
			}
			var P = Q.defer();

			console.log("Conected to DB: " + configFile.db.url);

			var configFolder = path.join(__dirname, "defaultdb");
			fs.readdir(configFolder, function(err, files){
				if (err) {
					throw err;
				}
				
				var filePromises = [];				
				files.forEach(function(file) {
					var fullFileName = path.join(configFolder, file);
					if (path.extname(fullFileName) == '.json') {
						var Pf = Q.defer();					
						filePromises.push(Pf.promise);
					
						var base = path.basename(fullFileName, ".json");						
						var Model = require(path.join(__dirname, '../../models/', base));
						var Data = require(path.join(fullFileName));
						console.log("Loading " + fullFileName)
						var dataPromises = [];
						Data.forEach(function(d){
							var Pd = Q.defer();
							function resolve(err) {
								if (err) { Pd.reject(err);}
								else { Pd.resolve();}
							}
							if (d._id) {
								Model.update({_id: d._id}, d, {upsert: true}, resolve);
							}
							else {
								var item = new Model(d);
								Pd = item.save(resolve);
							}
							
							dataPromises.push(Pd.promise);
						});
						
						Q.all(dataPromises).then(
							function(){							
								Pf.resolve();
							},
							function(err){
								Pf.reject(err);
							}
						);
					}
				});
				Q.all(filePromises)
				.then(function(){
					P.resolve();
				})
				.catch(function(err){
					P.reject(err);
				})
			});
		
			P.promise.catch(
				function(err){
					console.log(err);
				}
			)
			.finally(function(){
				mongoose.disconnect();
			})
		});

		
	});

program.parse(process.argv);


