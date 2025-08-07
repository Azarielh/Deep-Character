const { SlashCommandBuilder } = require("discord.js");
const prompt_service = require('../../srcs/services/prompt_service.js');
const content = require('../../srcs/contents/command_content.js');
const data_service = require('../../srcs/services/data_service.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("inspire")
		.setDescription(content.command_content.fr.inspire.description)
		.setDescriptionLocalizations({
			'en-US': content.command_content.en.inspire.description,
			'en-GB': content.command_content.en.inspire.description
		})
		.addStringOption(option =>
			option.setName('index')
				.setDescription(content.command_content.fr.inspire.options.index)
				.setDescriptionLocalizations({
					'en-US': content.command_content.en.inspire.options.index,
					'en-GB': content.command_content.en.inspire.options.index
				})
				.setRequired(false)
		),

	async execute(interaction) {
		await inspire(interaction);
	}
};

async function inspire(interaction) {
	const guild = interaction.guild;
	const Pnumber = interaction.options.getString("index");
	const lang = data_service.get_lang(guild.id);

	if (!guild) {
		await interaction.reply(content.command_content[lang].errors.guild_not_configured);
		return;
	}

	try {
		if (Pnumber) {
			const prompt = prompt_service.getPromptByIndex(parseInt(Pnumber), guild);
			await interaction.reply({
				content: `${Pnumber} : ${prompt.Pprompt}`
			});
		} else {
			const prompt = prompt_service.randomPrompt(guild.id);
			await interaction.reply({
				content: `${prompt.num} 🏷️${content.green(prompt.tag)} :\n${prompt.Pprompt}`
			});
		}
	} catch (error) {
		console.error('Error in inspire command:', error);
		await interaction.reply(content.command_content[lang].inspire.messages.invalid_index);
	}
}