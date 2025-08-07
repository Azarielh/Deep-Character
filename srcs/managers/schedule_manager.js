const cron = require("node-cron");
const prompt_service = require('../services/prompt_service.js');
const ds = require('../services/data_service.js');
/**
 * Initialize and handle all scheduled task
 * @param {Client} client
 */
function schedule_manager(client) {
   console.log("Initializing scheduled task manager...");
//	Scheduled Inspire - Toutes les 5 minutes
	cron.schedule(
		"*/5 * * * *",
		() => {
			client.guilds.cache.forEach(guild => {
				const config = ds.does_file_exist(guild.id, 'config');
				if (config?.promptChannel) {
					const channel = client.channels.cache.get(config.promptChannel);
					if (channel) {
						try {
							const randomPrompt = prompt_service.randomPrompt(guild);
							channel.send({content: `${randomPrompt.num} : ${randomPrompt.Pprompt}`});
						} catch (error) {
							console.error('Erreur dans le cron job:', error);
						}
					} else {
				   console.log(`⚠️ Channel not found for guild ${guild.name}`);
					}
				} else {
			   console.log(`⚠️ No config or promptChannel for guild ${guild.name}`);
				}
			});
		},
		{
			scheduled: true,
			timezone: "Europe/Paris",
		}
	);
	
   console.log("✅ Scheduled tasks initialized successfully!");
}

module.exports = schedule_manager;