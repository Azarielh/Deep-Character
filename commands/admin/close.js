const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const content = require('../../srcs/contents/command_content.js');
const data_service = require('../../srcs/services/data_service.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close')
		.setDescription(content.command_content.fr.close.description)
		.setDescriptionLocalizations({
			'en-US': content.command_content.en.close.description,
			'en-GB': content.command_content.en.close.description
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		await closeChannel(interaction);
	}
};

async function closeChannel(interaction) {
	try {
		const lang = await data_service.get_lang(interaction.guild.id);
		const channel = interaction.channel;
		
		// Create confirmation buttons
		const confirmButton = new ButtonBuilder()
			.setCustomId('confirm_close')
			.setLabel(content.command_content[lang].close.buttons.confirm)
			.setStyle(ButtonStyle.Danger);
		
		const cancelButton = new ButtonBuilder()
			.setCustomId('cancel_close')
			.setLabel(content.command_content[lang].close.buttons.cancel)
			.setStyle(ButtonStyle.Secondary);
		
		const row = new ActionRowBuilder()
			.addComponents(confirmButton, cancelButton);
		
		// Reply with confirmation request
		const confirmMessage = content.command_content[lang].close.confirm;
		const formattedMessage = content.replacePlaceholders(confirmMessage, {
			channel: channel.name
		});
		
		await interaction.reply({
			content: formattedMessage,
			components: [row],
			ephemeral: true
		});
		
		const filter = (buttonInteraction) => {
			return buttonInteraction.user.id === interaction.user.id && 
				   (buttonInteraction.customId === 'confirm_close' || buttonInteraction.customId === 'cancel_close');
		};
		
		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			time: 30000
		});
		
		collector.on('collect', async (buttonInteraction) => {
			try {
				if (buttonInteraction.customId === 'confirm_close') {
					const closingMessage = content.command_content[lang].close.closing;
					const formattedClosingMessage = content.replacePlaceholders(closingMessage, {
						channel: channel.name
					});
					
					await buttonInteraction.update({
						content: formattedClosingMessage,
						components: [],
						ephemeral: true
					});
					setTimeout(async () => {
						try {
							await channel.delete(`Channel fermé par ${interaction.user.tag} via la commande /close`);
						} catch (deleteError) {
							console.error('Error while deleting channel:', deleteError);
						}
					}, 2000);
					
				} else if (buttonInteraction.customId === 'cancel_close') {
					await buttonInteraction.update({
						content: content.command_content[lang].close.cancelled,
						components: [],
						ephemeral: true
					});
				}
				
				collector.stop();
			} catch (error) {
				console.error('Error while processing button interaction:', error);
			}
		});
		
		collector.on('end', async (collected, reason) => {
			if (reason === 'time') {
				try {
					await interaction.editReply({
						content: content.command_content[lang].close.timeout,
						components: [],
						ephemeral: true
					});
				} catch (error) {
					console.error('Error while updating expired message:', error);
				}
			}
		});
		
	} catch (error) {
		console.error('Error while requesting channel closure:', error);
		
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