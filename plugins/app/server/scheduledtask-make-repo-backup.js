var Scheduler = require(__dirname + '/../../../services/scheduler.js');
var Task = require(__dirname + '/../../../models/task.js');
var Repository = require(__dirname + '/../../../models/repository.js');
var ScheduledTask = require(__dirname + '/../../../models/scheduledtask.js');


var repoSizeScheduled = "Make Repositories Backup";


ScheduledTask.findOne({_id:repoSizeScheduled}, function(err, task){
	if (!task) {
		task = new ScheduledTask({
			_id: repoSizeScheduled,
			scheduler: "0 3 * * 0",
			enabled: true,
			params: {
				priority: 100
			}			
		});
		task.save();
	}

	Scheduler.scheduleJob(task._id, task.scheduler, function() {
		/*
		Repository.find({}, function(err, repos){		
			if (!err && repos) {
				repos.forEach(function(r){				
					var task = new Task({
						task: 'calculateRepositorySize',
						error: false,
						targetType: 'repository',
						targetId: r._id,
						parameters: "",
						priority: task.params.priority,
						description: "Calculate '" + r._id + "' repository size"
					});
					
					//task.save();
				})
			}
		});
		*/
	});
});

