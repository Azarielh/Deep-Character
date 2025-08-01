const fs = require("node:fs");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const prompt_manager = require('../../srcs/prompt_manager.js');

const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Message,
} = require("discord.js"); // import discord library relative to the bot needs

const client = new Client({
  intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
  ],
});

//Créer la commande
module.exports = {
  data: new SlashCommandBuilder()
	.setName("add")
	.setDescription("Add a new prompt")
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	//Ajouter une option requise
	.addStringOption((option) =>
	  option
		.setName("prompt")
		.setDescription("écris le prompt à ajouter")
		.setRequired(true)
	),
  async execute(interaction) {
	// Get input from user
	const dpprompt = interaction.options.getString("prompt");
	// Check if command used within a guild
	const guild = interaction.guild; // Get guild from interaction
	if (!guild) {
	  await interaction.reply("This command can only be used within a server");
	  return;
	}
	// Faire patienter l'user
	await interaction.reply("Oui maître, j" + "'" + "enregistre votre demande");
	//Ajouter le nouveau prompt au json
	prompt_manager.addit(dpprompt, guild);
	await wait(1_000);
	// Notify the user
	await interaction.editReply(
	  "**Super ! J'ai bien ajouté** " + '"__' + dpprompt + '__"'
	);
  },
};
