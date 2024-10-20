const fs = require('node:fs'); // import node:fs library
const path = require('node:path');// import node:path witch improve path relating behaviour
const { Client, Collection, Events, GatewayIntentBits, Message } = require('discord.js'); // import discord library relative to the bot needs
const { token } = require('./config.json'); // import config.json where token and guilds data are stocked

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands'); // Open and checks for commands files
const commandFolders = fs.readdirSync(foldersPath);

const users_Data = path.join(__dirname, 'data_character.json'); // Get the so named file

function load_UsersData() {
	if (fs.existsSync(users_Data)) {
		const rawData = fs.readFileSync(users_Data);
		return JSON.parse(rawData);
	}
	return {};
}

function save_UsersData(data) {
	fs.writeFileSync(users_Data, JSON.stringify(data, null, 2));
}

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

client.once(Events.ClientReady, readyClient => {
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

// Gestion des messages texte, y compris les réponses à des messages
client.on('messageCreate', async (message) => {
    // Vérification si c'est une réponse
    if (message.reference) {
        try {
            // Récupérer le message auquel on a répondu
            const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
            // Check if message is from inspire command from this bot
			if (repliedMessage.author.bot && repliedMessage.content.startsWith('..')) {
				const data = load_UsersData(); // load the so named JSON
				
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
				
				save_UsersData(data);

			    // Tu peux envoyer une réponse dans le canal si tu le souhaites
				await message.channel.send(`Si seulement tu réalisais les implications de cette réponse :smirk:`);
			}
        } catch (error) {
            console.error('Erreur lors de la récupération du message d\'origine :', error);
        }
    }
});
client.login(token);