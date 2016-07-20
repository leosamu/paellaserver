var Q = require('q');
var schedule = require('node-schedule');


var jobs = {};


function scheduleJob(name, rule, func) {
	if (name in jobs) {
		return null;
	}
	else {
		var j = schedule.scheduleJob(name, rule, func);
		
		var job = {
			name: name,
			rule: rule,
			job: j
		}
		jobs[name] = job;
		
		return job;
	}
}

function cancelJob(name) {
	if (name in jobs) {
		schedule.cancelJob(jobs[name].job);
		delete jobs[name]
	}
}


function findJob(name) {
	if (name in jobs) {
		return jobs[name];
	}
	return null;
}

function getJobsList() {
	var list = [];
	
	Object.keys(jobs).forEach(function(k) {
		list.push(jobs[k]);
	});
	
	return list;
}


module.exports.scheduleJob = scheduleJob;
module.exports.cancelJob = cancelJob;
module.exports.findJob = findJob;
module.exports.getJobsList = getJobsList;
