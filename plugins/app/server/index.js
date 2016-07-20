var Scheduler = require(__dirname + '/../../../services/scheduler.js');
var Task = require(__dirname + '/../../../models/task.js');
var Repository = require(__dirname + '/../../../models/repository.js');



Scheduler.scheduleJob("Calculate Repositories Size", "0 30 0 * * *", function(){

	Repository.find({}, function(err, repos){
		if (!err && repos) {
			repos.forEach(function(r){				
				var task = new Task({
					task: 'calculateRepositorySize',
					error: false,
					targetType: 'repository',
					targetId: r._id,
					parameters: "",
					priority: 100,
					description: "Calculate '" + r._id + "' repository size"
				});				
				
				task.save();
			})
		}
	});
});





Scheduler.scheduleJob("Make Repositories Backup", "0 0 3 * * 7", function(){
	
});
