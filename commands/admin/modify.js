const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const prompt_service = require('../../srcs/services/prompt_service.js');
const content = require('../../srcs/content/command_content.js');
const data_service = require('../../srcs/services/data_service.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mod")
		.setDescription(content.command_content.fr.modify.description)
		.setDescriptionLocalizations({
			'en-US': content.command_content.en.modify.description,
			'en-GB': content.command_content.en.modify.description
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) =>
			option
				.setName("index")
				.setDescription(content.command_content.fr.modify.options.index)
				.setDescriptionLocalizations({
					'en-US': content.command_content.en.modify.options.index,
					'en-GB': content.command_content.en.modify.options.index
				})
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("prompt")
				.setDescription(content.command_content.fr.modify.options.new_prompt)
				.setDescriptionLocalizations({
					'en-US': content.command_content.en.modify.options.new_prompt,
					'en-GB': content.command_content.en.modify.options.new_prompt
				})
				.setRequired(true)
		),

	async execute(interaction) {
		await modify(interaction);
	}
};

async function modify(interaction) {
	const guild = interaction.guild;
	const Pnum = parseInt(interaction.options.getString("index"));
	const dpprompt = interaction.options.getString("prompt");
	const lang = data_service.get_lang(guild.id);

	if (!guild) {
		await interaction.reply(content.command_content[lang].errors.guild_not_configured);
		return;
	}

	if (!Pnum || !dpprompt) {
		await interaction.reply(content.command_content[lang].modify.messages.invalid_input);
		return;
	}

	await interaction.reply(content.command_content[lang].modify.messages.waiting);

	try {
		prompt_service.change_it(Pnum, dpprompt, guild);
		await wait(500);
		const successMessage = content.replacePlaceholders(
			content.command_content[lang].modify.messages.success,
			{ prompt: dpprompt }
		);
		await interaction.editReply(successMessage);
	} catch (error) {
		console.error('Error in modify command:', error);
		await interaction.editReply(content.command_content[lang].modify.messages.error);
	}
}
