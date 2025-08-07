const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { config_manager } = require('../../srcs/managers/config_manager.js');
const content = require('../../srcs/contents/command_content.js');
const data_service = require('../../srcs/services/data_service.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription(content.command_content.fr.setup.description)
		.setDescriptionLocalizations({
			'en-US': content.command_content.en.setup.description,
			'en-GB': content.command_content.en.setup.description
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		await setup(interaction);
	}
};

async function setup(interaction) {
	try {
		const lang = await data_service.get_lang(interaction.guild.id);
		
		// Check if there's already a setup channel open
		const existingSetupChannel = interaction.guild.channels.cache.find(
			channel => channel.name.includes('deep-character setup')
		);

		if (existingSetupChannel) {
			const message = content.command_content[lang].setup.already_exists;
			const formattedMessage = content.replacePlaceholders(message, {
				channel: existingSetupChannel
			});
			
			await interaction.reply({
				content: formattedMessage,
				ephemeral: true
			});
			return;
		}

		// Reply immediately to avoid timeout
		await interaction.reply({
			content: content.command_content[lang].setup.creating,
			ephemeral: true
		});

		// Create setup channel via config_manager
		const setupChannel = await config_manager(interaction.guild, interaction.client);

		// Update response with created channel
		const successMessage = content.command_content[lang].setup.success;
		const formattedMessage = content.replacePlaceholders(successMessage, {
			channel: setupChannel
		});
		
		await interaction.editReply({
			content: formattedMessage,
			ephemeral: true
		});

	} catch (error) {
		console.error('Error while creating setup channel:', error);
		
		const lang = await data_service.get_lang(interaction.guild.id).catch(() => 'fr');
		const errorMessage = content.command_content[lang].errors.general;
		
		if (interaction.replied || interaction.deferred) {
			await interaction.editReply({
				content: errorMessage,
				ephemeral: true
			});
		} else {
			await interaction.reply({
				content: errorMessage,
				ephemeral: true
			});
		}
	}
}