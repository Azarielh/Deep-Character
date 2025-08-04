const fs = require("node:fs");
const { SlashCommandBuilder } = require("discord.js");
const prompt_service = require('../../srcs/services/prompt_service.js');

module.exports = {
data: new SlashCommandBuilder()
	.setName("inspire")
	.setDescription(
		'Questionne les joueurs sur leurs personnage ou le met dans une situation particuliere'
	)
	.addStringOption(option =>
	  option.setName('index')
		.setDescription('numéro du prompt')
		.setRequired(false)
	),

  async execute(interaction) {
	let Pnumber = interaction.options.getString("index");
	try {
		if (Pnumber) {
			const prompt = prompt_service.getPromptByIndex(parseInt(Pnumber), interaction.guild);
			await interaction.reply({content: `${Pnumber} : ${prompt.Pprompt}`});
		} else {
			const prompt = prompt_service.randomPrompt(interaction.guild);
			await interaction.reply({content:`${prompt.num} : ${prompt.Pprompt}`});
	
		}
	} catch(e){
		await interaction.reply("L'index donné est incorrect")
	}
  },
};
