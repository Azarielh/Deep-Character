const { SlashCommandBuilder } = require('discord.js');
const content = require('../../srcs/content/command_content.js');
const data_service = require('../../srcs/services/data_service.js');

async function rollDice(interaction) {
	try {
		const lang = await data_service.get_lang(interaction.guild.id);
		
		const facesroll = interaction.options.getNumber('faces');
		const how_many_roll = interaction.options.getNumber('how_many') || 1;
		const result = [];

		// Roll the dice
		for (let nb = 0; nb < how_many_roll; nb++) {
			result.push(Math.floor(Math.random() * facesroll + 1));
		}

		// Create message with placeholders
		const message = content.command_content[lang].roll.simple_format;
		const formattedMessage = content.replacePlaceholders(message, {
			faces: facesroll,
			results: result.join(', ')
		});

		await interaction.reply(formattedMessage);
	} catch (error) {
		console.error('Error while rolling dice:', error);
		
		const lang = await data_service.get_lang(interaction.guild.id).catch(() => 'fr');
		const errorMessage = content.command_content[lang].errors.general || 'Une erreur est survenue.';
		
		if (interaction.deferred) {
			await interaction.editReply(errorMessage);
		} else {
			await interaction.reply({ content: errorMessage, ephemeral: true });
		}
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription(content.command_content.fr.roll.description)
		.setDescriptionLocalizations({
			'en-US': content.command_content.en.roll.description,
			'en-GB': content.command_content.en.roll.description
		})
		.addNumberOption(option =>
			option.setName('faces')
				.setDescription(content.command_content.fr.roll.options.faces)
				.setDescriptionLocalizations({
					'en-US': content.command_content.en.roll.options.faces,
					'en-GB': content.command_content.en.roll.options.faces
				})
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('how_many')
				.setDescription(content.command_content.fr.roll.options.dice)
				.setDescriptionLocalizations({
					'en-US': content.command_content.en.roll.options.dice,
					'en-GB': content.command_content.en.roll.options.dice
				})
				.setRequired(false)),

	async execute(interaction) {
		await rollDice(interaction);
	}
};
