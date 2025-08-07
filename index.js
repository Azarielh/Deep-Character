const fs	=		require("node:fs"); // import node:fs library
const path	=		require("node:path"); // import node:path witch improve path relating behaviour
const data_service		 =	require('./srcs/services/data_service.js');
const { login_manager }	 =	require('./srcs/managers/login_manager.js');
const schedule_manager	 =	require('./srcs/managers/schedule_manager.js');
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
  
  console.log(`📁 Chargement du dossier: ${folder}`);
  console.log(`📄 Fichiers trouvés: ${commandFiles.join(', ')}`);
  
  for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ("data" in command && "execute" in command) {
	  client.commands.set(command.data.name, command);
	  console.log(`✅ Commande chargée: ${command.data.name} depuis ${folder}/${file}`);
	} else {
	  console.log(
		`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
	  );
	}
  }
}

client.once(Events.ClientReady, (readyClient) => {
	login_manager(client);
	schedule_manager(client);
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) =>
{
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
	
	const errorResponse = {
	  content: "There was an error while executing this command!",
	  ephemeral: true
	};
	
	if (interaction.replied || interaction.deferred) {
	  await interaction.followUp(errorResponse);
	} else {
	  await interaction.reply(errorResponse);
	}
  }
});

// Listen for answers to Deep-character message from inspire
client.on("messageCreate", async (message) => {
  console.log("🔵 Message reçu:", message.content.substring(0, 50));
  
  if (message.reference) {
    console.log("🟡 Message avec référence détecté");
    
    try {
      const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
      console.log("🟢 Message original récupéré:", repliedMessage.content.substring(0, 50));
      console.log("🔸 Auteur est bot:", repliedMessage.author.bot);
      console.log("🔸 Test regex /^\\d/:", /^\d/.test(repliedMessage.content));
      
      if (repliedMessage.author.bot && /^\d/.test(repliedMessage.content)) {
        console.log("✅ CONDITIONS REMPLIES - Traitement en cours");
        
        const data = data_service.load_data(message.guild.id, "data_character");
        console.log("📂 Données chargées:", Object.keys(data).length, "utilisateurs");

		const userKey = `${message.author.username}-${message.author.id}`; // create a user key as "pseudo-id"
		console.log("👤 Clé utilisateur:", userKey);
		
		// Check if user exist in Database or not
		if (!data[userKey]) {
		  data[userKey] = {};
		  console.log("🆕 Nouvel utilisateur créé");
		} else {
		  console.log("👤 Utilisateur existant trouvé");
		}

		// Check if prompt exist within the user's data or not
		let promptMessage = repliedMessage.content
		  .trimStart()
		  .replace(/^(\.\.\s*)/, "");
		console.log("📝 Prompt nettoyé:", promptMessage);

		if (!data[userKey][promptMessage]) {
		  data[userKey][promptMessage] = [message.content]; // Create the prompt data if does not exist yet
		  console.log("🆕 Nouveau prompt créé");
		} else {
		  data[userKey][promptMessage].push(message.content); // Update the answer if prompt data already exist
		  console.log("➕ Réponse ajoutée au prompt existant");
		}

		data_service.save_Data("data_character", message.guild.id, data);
		console.log("💾 Données sauvegardées");

		// Tu peux envoyer une réponse dans le canal si tu le souhaites
		await message.channel.send(
		  `Si seulement tu réalisais les implications de cette réponse :smirk:`
		);
		console.log("✅ Message de confirmation envoyé");
      } else {
        console.log("❌ Conditions non remplies");
        if (!repliedMessage.author.bot) console.log("   - Message pas d'un bot");
        if (!/^\d/.test(repliedMessage.content)) console.log("   - Message ne commence pas par un chiffre");
      }
    } catch (error) {
      console.error("💥 Erreur:", error);
    }
  } else {
    console.log("⚪ Message sans référence");
  }
});
client.login(token);