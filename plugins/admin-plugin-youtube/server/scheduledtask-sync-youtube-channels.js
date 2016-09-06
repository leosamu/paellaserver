var Scheduler = require(__dirname + '/../../../services/scheduler.js');
var Task = require(__dirname + '/../../../models/task.js');
var Channel = require(__dirname + '/../../../models/channel.js');
var ScheduledTask = require(__dirname + '/../../../models/scheduledtask.js');



var repoSizeScheduled = "Synchronize Youtube channels";


ScheduledTask.findOne({_id:repoSizeScheduled}, function(err, task){
	if (!task) {
		task = new ScheduledTask({
			_id: repoSizeScheduled,
			scheduler: "45 3 * * *",
			enabled: true,
			params: {
				priority: 100
			}			
		});
		task.save();
	}

	Scheduler.scheduleJob(task._id, task.scheduler, function() {
		Channel.find({catalog:'youtube', 'pluginData.youtube.id': {$exists: true}}, function(err, channels){
			if (!err && channels) {
				channels.forEach(function(c){				
					var task = new Task({
						task: 'uploadToYoutube',
						error: false,
						targetType: 'channel',
						targetId: c._id,
						parameters: "",
						priority: 100,
						description: "Synchronize '" + c._id + "' channel to Youtube"
					});				
					//task.save();				
				})
			}
		});
	});
});



