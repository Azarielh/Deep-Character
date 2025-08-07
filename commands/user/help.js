const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { command_content } = require('../../srcs/content/command_content.js');
const data_service = require('../../srcs/services/data_service.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
	.setDescription(command_content.fr.help.description)
	.setDescriptionLocalizations({
		'en-US': command_content.en.help.description,
		'en-GB': command_content.en.help.description
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
const helpMsg = command_content[lang].help.user;
	await interaction.reply({
		content: helpMsg,
		ephemeral: true
	});
}

async function sendAdminHelp(interaction, lang) {
const helpMsg = command_content[lang].help.admin;
	await interaction.reply({
		content: helpMsg,
		ephemeral: true
	});
}
