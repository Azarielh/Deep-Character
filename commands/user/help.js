const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const content = require('../../srcs/contents/command_content.js');
const data_service = require('../../srcs/services/data_service.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription(content.command_content.fr.help.description)
		.setDescriptionLocalizations({
			'en-US': content.command_content.en.help.description,
			'en-GB': content.command_content.en.help.description
		}),

	async execute(interaction) {
		await helpCommand(interaction);
	}
};

async function helpCommand(interaction) {
	const lang = await data_service.get_lang(interaction.guild.id);
	const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);

	if (isAdmin) {
		await sendAdminHelp(interaction, lang);
	} else {
		await sendUserHelp(interaction, lang);
	}
}

async function sendUserHelp(interaction, lang) {
	const helpMsg = content.command_content[lang].help.user;
	await interaction.reply({
		content: helpMsg,
		flags: MessageFlags.Ephemeral
	});
}

async function sendAdminHelp(interaction, lang) {
	const helpMsg = content.command_content[lang].help.admin;
	await interaction.reply({
		content: helpMsg,
		flags: MessageFlags.Ephemeral
	});
}