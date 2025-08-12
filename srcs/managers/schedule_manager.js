const cron = require("node-cron");
const prompt_service = require('../services/prompt_service.js');
const ds = require('../services/data_service.js');
/**
 * Initialize and handle all scheduled task
 * @param {Client} client
 */
function schedule_manager(client) {
   console.log("Initializing scheduled task manager...");
	try {
//	Scheduled Inspire - Toutes les 5 minutes
/*	Struct in config
	"Frequence_for_inspire": {
	"min": "de 0 à 59",
	"hour": "de 0 à 23",
	"month_day": "de 1 à 31",
	"Month":, "from 1 to 12",
	"weekday": "de 0 à 7" // can be wrote 1-5 which means from monday to friday or 1 for monday. Note that 0 or 7 both means sunday.
*/
	cron.schedule(
		"*/5 * * * *",
		() => {
			console.log('[CRON] Tick toutes les 5 minutes');
			client.guilds.cache.forEach(guild => {
				let config = null;
				try {
					config = ds.does_file_exist(guild.id, 'config');
				} catch (e) {
				  console.error(`[CRON] Erreur d'accès au fichier de config pour la guild ${guild.id}:`, e);
				}
				if (config?.switch_cron_inspire == 'off')
					return ;
				if (config?.promptChannel) {
					const channel = client.channels.cache.get(config.promptChannel);
					if (channel) {
						try {
							const randomPrompt = prompt_service.randomPrompt(guild.id);
							console.log(`[CRON] Envoi dans ${channel.id} (${guild.name}) :`, randomPrompt);
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
	} catch (error) {
		console.error(`[CRON ERROR]`, error);
	}
	
   console.log("✅ Scheduled tasks initialized successfully!");
}

module.exports = schedule_manager;