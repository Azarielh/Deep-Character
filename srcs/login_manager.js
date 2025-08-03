const chalk = require('chalk');
const { config_manager } = require('./config_manager.js');
const dm	=	require('./data_manager.js');

/**
 * @brief The login_manager is in charge of :
 *							- Create guild's folders and files if none existant
 *							- If necessarry, it will update guild's owner and guild's admin list
 *							- Load them if existant
 *							- Send hello message
 * @param client 
 */
async function login_manager(client) {
	const guilds = Array.from(client.guilds.cache.values());

  // ✅ Traitement parallèle de toutes les guildes
	await Promise.all(guilds.map(async (guild) => {
		try {
			const files_status = dm.file_set_exist(guild.id);

			if (!dm.build_guild_folder(guild.id))
				config_manager(guild, client);
			//FIXME: Messages de bienvenue manquants (else branch supprimée)
	} catch (error) {
	  console.error(`Erreur lors de l'initialisation de la guild ${guild.name}:`, error);
	}
  }));
}

module.exports = { login_manager };
