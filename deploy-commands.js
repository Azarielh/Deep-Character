const { REST, Routes } = require('discord.js');
const { clientId, token, guildId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const is_test_mode = process.argv.includes('--test');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		const route = is_test_mode ? Routes.applicationGuildCommands(clientId, guildId)
									: Routes.applicationCommands(clientId);
		
		const deployType = is_test_mode ? `TEST sur la guild ${guildId}` : 'GLOBAL';
		console.log(`Started refreshing ${commands.length} application (/) commands in ${deployType} mode.`);
		
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			route, // ✅ Utilise la variable route !
			{ body: commands },
		);
		
		console.log(`Successfully reloaded ${data.length} application (/) commands in ${deployType} mode.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();