const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');

/**
 * @brief tap jd to roll any number of dice you want. Of course, you can choose how many faces your dice have.
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Fait un jet de dé')
		// Set number option 
		.addNumberOption(option =>
			option.setName('faces')
				.setDescription('Décide combien de face a ton dé?')
				.setRequired(true))
        .addNumberOption(option =>
            option.setName('how_many')
                .setDescription('Combien de dé veux-tu lancer?')
                .setRequired(false)),

	async execute(interaction) {
		let facesroll = interaction.options.getNumber('faces');
		let how_many_roll = interaction.options.getNumber('how_many') || 1; // Si non spécifié, on lance 1 dé par défaut
		let result = [];

		// Lancer les dés
		for (let nb = 0; nb < how_many_roll; nb++) {
			result.push(Math.floor(Math.random() * facesroll + 1));
		}

		// Réponse
		await interaction.reply(`**D${facesroll} ** : ${result.join(', ')}`);
	}
};
