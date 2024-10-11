const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

	//Créer la commande
module.exports = {
	data: new SlashCommandBuilder()
		.setName('jdé')
		.setDescription('Fait un jet de dé')
	//Ajouter une option requise
		.addNumberOption(option =>
			option.setName('faces')
				.setDescription('Décide combien de face a ton dé?')
				.setRequired(true))
        .addNumberOption(option =>
            option.setName('how_many')
                .setDescription('Combien de dé veux-tu lancer?')
                .setRequired(true)),

	async execute(interaction) {
		let facesroll = interaction.options.getString('faces');
		let how_many_roll = interaction.options.getString('how_many');

		await interaction.reply("Dé 1 :", Math.floor(Math.random() * facesroll));
	}
};