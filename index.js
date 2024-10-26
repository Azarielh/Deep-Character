const fs = require('node:fs'); // import node:fs library
const path = require('node:path');// import node:path witch improve path relating behaviour
const cron = require('node-cron');

const { Client, Collection, Events, GatewayIntentBits, Message } = require('discord.js'); // import discord library relative to the bot needs

const { token } = require('./config.json'); // import token
const Rdata = fs.readFileSync("prompts.json"); // import global prompts
const jsonprompt = JSON.parse(Rdata);

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });

//___________________________Randomize prompt for cron_____________________________________________________________
function randomPrompt() {
	return jsonprompt[Math.floor(Math.random() * jsonprompt.length)];
  }


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands'); // Open and checks for commands files
const commandFolders = fs.readdirSync(foldersPath);

//____________________________Setting up function for managing files update____________________________________________

function load_UsersData(type, guildId) { // Guild' file for character's data
	const usersData = path.join(__dirname, `${type}_${guildId}.json`); // will create the file if does not exist
	
	if (fs.existsSync(usersData)) { 	// Check if guild's file exist
		const rawData = fs.readFileSync(usersData);
		return JSON.parse(rawData); // if yes return the guild's file
	} else { // return empty object if file is new
		return {}
	}
}

function copyInitialPrompts(adress, guildId) {
    const initialPromptsFilePath = path.join(__dirname, 'prompts.json');
    const guildPromptsFilePath = path.join(__dirname, `${adress}_${guildId}.json`);
    
    // Copier le fichier prompts.json vers prompts_guildId.json
    if (fs.existsSync(initialPromptsFilePath)) {
        fs.copyFileSync(initialPromptsFilePath, guildPromptsFilePath);
        console.log(`Fichier copié : prompts_${guildId}.json`);    
    } else {
        console.error(`Le fichier initial prompts.json est introuvable.`);
    }
}

function save_Data(adress, name, data) {
	const users_Data = path.join(__dirname, `${adress}_${name}.json`);
	// Save new data in the right guild file
	fs.writeFileSync(users_Data, JSON.stringify(data, null, 2));
	console.log(`Fichier créé : ${adress}_${name}.json`);
}

// Check for error in processing commands files while bot is starting
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
// Send Scheduled inspire command
cron.schedule('* 17 * * *', () =>  {
	const channel = client.channels.cache.get('1072781715585650688'); // This number is channel's ID. I'll have to make it changeable to deploy)
	if (channel)
		channel.send(randomPrompt().Pprompt);
	console.log('bazunga');
}, {
	scheduled: true,
	timezone: "Europe/Paris"
});

client.once(Events.ClientReady, readyClient => {
	client.guilds.cache.forEach(guild => {
        const guildId = guild.id; // get guildId
		const guildKey = `${guild.name}${guildId}`; // create a guild key as "name-id"

		// Check for guild folder and create if non existant with associate files
		if (!fs.existsSync(path.join(__dirname, `./guilds/${guildKey}/`))) {

			fs.mkdirSync(`./guilds/${guildKey}/`); // Make the guild's folder
			console.log(`Dossier créé : ${guildKey}.json`);
			
			save_Data(`./guilds/${guildKey}/`,`config_${guildId}`, { // Build the config's file within guild folder
				name: `${guild.name}`,
				ID: `${guildId}`
			})

			save_Data(`./guilds/${guildKey}/`,`data_character_${guildId}`, {}); // Build the data_caracter's file for this guild

            copyInitialPrompts(`./guilds/${guildKey}/`,`prompts_${guildId}`); // Copy from prompt.json and rename prompt_guildId.json so each guild has its own prompt file.
        }
	});
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
}); 

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Listen for answers to Deep-character message from inspire
client.on('messageCreate', async (message) => {
    if (message.reference) {     // Check if users message got a reference
        try {
            const repliedMessage = await message.channel.messages.fetch(message.reference.messageId); // Get the messageId from the message being answered to
			if (repliedMessage.author.bot && repliedMessage.content.startsWith('..')) {   // Check if message is from inspire command from Deep-Character
				const data = load_UsersData('data_character', guildId); // load the so named JSON
				
				const userKey = `${message.author.username}-${message.author.id}`; // create a user key as "pseudo-id"
				// Check if user exist in Database or not
				if (!data[userKey]) {
					data[userKey] = {};
				}

				// Check if prompt exist within the user's data or not
				let promptMessage = repliedMessage.content.trimStart().replace(/^(\.\.\s*)/, '');

				if (!data[userKey][promptMessage]) {
					data[userKey][promptMessage] = [message.content]; // Create the prompt data if does not exist yet
				} else {
					data[userKey][promptMessage].push(message.content); // Update the answer if prompt data already exist
				}
				
				save_Data('data_character',guildId ,data);

			    // Tu peux envoyer une réponse dans le canal si tu le souhaites
				await message.channel.send(`Si seulement tu réalisais les implications de cette réponse :smirk:`);
			}
        } catch (error) {
            console.error('Erreur lors de la récupération du message d\'origine :', error);
        }
    }
});
client.login(token);