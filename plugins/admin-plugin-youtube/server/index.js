var Scheduler = require(__dirname + '/../../../services/scheduler.js');
var Task = require(__dirname + '/../../../models/task.js');
var Channel = require(__dirname + '/../../../models/channel.js');


Scheduler.scheduleJob("Synchronize Youtube channels", "0 45 3 * * *", function(){

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

