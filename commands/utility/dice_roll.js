const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');

	//Créer la commande
module.exports = {
	data: new SlashCommandBuilder()
		.setName('jd')
		.setDescription('Fait un jet de dé')
	// Set number option 
		.addNumberOption(option =>
			option.setName('faces')
				.setDescription('Décide combien de face a ton dé?')
				.setRequired(true)),
        // .addNumberOption(option =>
        //     option.setName('how_many')
        //         .setDescription('Combien de dé veux-tu lancer?')
        //         .setRequired(true)),

	async execute(interaction) {
		console.log("coucou");
		let facesroll = interaction.options.getNumber('faces');
		// let how_many_roll = interaction.options.getString('how_many');
		// let roll = 1;
		await interaction.reply(`**D${facesroll}  :  ** ${Math.floor(Math.random() * facesroll) + 1}`);
	}
};