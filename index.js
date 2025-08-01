const fs = require("node:fs"); // import node:fs library
const path = require("node:path"); // import node:path witch improve path relating behaviour
const cron = require("node-cron");
const prompt_manager = require('./srcs/prompt_manager.js');
const data_manager = require('./srcs/data_manager.js');

const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Message,
} = require("discord.js"); // import discord library relative to the bot needs

const { token } = require("./config.json"); // import token

const client = new Client({
  intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands"); // Open and checks for commands files
const commandFolders = fs.readdirSync(foldersPath);

// Check for error in processing commands files while bot is starting
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ("data" in command && "execute" in command) {
	  client.commands.set(command.data.name, command);
	} else {
	  console.log(
		`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
	  );
	}
  }
}

// Send Scheduled inspire command
cron.schedule(
  "*/10 */5 * * *",
  () => {
	const channel = client.channels.cache.get("1072492463127793724"); // This number is channel's ID. I'll have to make it changeable to deploy)
	if (channel) channel.send(prompt_manager.randomPrompt(interaction.guild).Pprompt);
	console.log("bazunga");
  },
  {
	scheduled: true,
	timezone: "Europe/Paris",
  }
);

client.once(Events.ClientReady, (readyClient) => {
  client.guilds.cache.forEach((guild) => {
	// Check for guild folder and create if non existant with associate files
	if (!fs.existsSync(path.join(__dirname, `./guilds/${guild.id}/`))) {
	  fs.mkdirSync(`./guilds/${guild.id}/`); // Make the guild's folder
	  console.log(`Dossier créé : ${guild.id}.json`);

	  data_manager.save_Data(`./guilds/${guild.id}/`, `config_${guild.id}`, {
		// Build the config's file within guild folder
		name: `${guild.name}`,
		ID: `${guild.id}`,
	  });

	  data_manager.save_Data(`./guilds/${guild.id}/`, `data_character_${guild.id}`, {}); // Build the data_caracter's file within guild's folder

	  data_manager.copyInitialPrompts(`./guilds/${guild.id}/`, `prompts_${guild.id}`); // Copy from prompt.json and rename prompt_guild within guild's folder.
	}
	//_______________________________Send a welcome message at first connection on a guild__________________________________________
	// Find a channel named "general"
	if (!fs.existsSync(path.join(__dirname, `./guilds/${guild.id}/`))) {
	  guild.systemChannel.send(
		"Hello, I'm Deep-Character ! My role is to enhance your RPG experience. I'm pleased to be invite on your server and I'm gratefull for it ! My maker still working on me and I know much more fixes and features are yet to come"
	  );
	  return;
	} else if (fs.existsSync(path.join(__dirname, `./guilds/${guild.id}/`))) {
		guild.systemChannel.send("Hello there ! I'm back");
	} else {
	  console.log(`No "general" channel found in ${guild.name}`);
	}
  });
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
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
	  await interaction.followUp({
		content: "There was an error while executing this command!",
		ephemeral: true,
	  });
	} else {
	  await interaction.reply({
		content: "There was an error while executing this command!",
		ephemeral: true,
	  });
	}
  }
});

// Listen for answers to Deep-character message from inspire
client.on("messageCreate", async (message) => {
  if (message.reference) {
	// Check if users message got a reference
	try {
	  const repliedMessage = await message.channel.messages.fetch(
		message.reference.messageId
	  ); // Get the messageId from the message being answered to
	  if (
		repliedMessage.author.bot &&
		repliedMessage.content.startsWith("..")
	  ) {
		// Check if message is from inspire command from Deep-Character
		const data = data_manager.load_UsersData("data_character", guild.id); // load the so named JSON

		const userKey = `${message.author.username}-${message.author.id}`; // create a user key as "pseudo-id"
		// Check if user exist in Database or not
		if (!data[userKey]) {
		  data[userKey] = {};
		}

		// Check if prompt exist within the user's data or not
		let promptMessage = repliedMessage.content
		  .trimStart()
		  .replace(/^(\.\.\s*)/, "");

		if (!data[userKey][promptMessage]) {
		  data[userKey][promptMessage] = [message.content]; // Create the prompt data if does not exist yet
		} else {
		  data[userKey][promptMessage].push(message.content); // Update the answer if prompt data already exist
		}

		data_manager.save_Data("data_character", guild.id, data);

		// Tu peux envoyer une réponse dans le canal si tu le souhaites
		await message.channel.send(
		  `Si seulement tu réalisais les implications de cette réponse :smirk:`
		);
	  }
	} catch (error) {
	  console.error(
		"Erreur lors de la récupération du message d'origine :",
		error
	  );
	}
  }
});
client.login(token);
