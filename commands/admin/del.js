// const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
// const wait = require("node:timers/promises").setTimeout;
// const prompt_service = require('../../srcs/services/prompt_service.js');
// const content = require('../../srcs/contents/command_content.js');
// const data_service = require('../../srcs/services/data_service.js');

// module.exports = {
//   data: new SlashCommandBuilder()
// 	.setName("del")
// 	.setDescription(content.command_content.fr.del.description)
// 	.setDescriptionLocalizations({
// 		'en-US': content.command_content.en.del.description,
// 		'en-GB': content.command_content.en.del.description
// 	})
// 	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
// 	.addStringOption((option) =>
// 		option
// 			.setName("index")
// 			.setDescription(content.command_content.fr.del.options.index)
// 			.setDescriptionLocalizations({
// 				'en-US': content.command_content.en.del.options.index,
// 				'en-GB': content.command_content.en.del.options.index
// 			})
// 			.setRequired(true)
// 	),
// 	async execute(interaction) {
// 		await add(interaction);
// 	}
// };

// async function add(interaction) {
// 	const guild = interaction.guild;
// 	const dpprompt = interaction.options.getString("index");
// 	const lang = data_service.get_lang(guild.id);
	
// 	if (!guild) {
// 		await interaction.reply(content.command_content[lang].add.messages.guildOnly);
// 		return;
// 	}
	
// 	await interaction.reply(content.command_content[lang].add.messages.processing);
	
// 	try {
// 		prompt_service.addit(tag, dpprompt, guild);
// 		await wait(500);
// 		await interaction.editReply(content.command_content[lang].add.messages.success(dpprompt));
// 	} catch (error) {
// 		console.error('Error in add command:', error);
// 		await interaction.editReply(content.command_content[lang].add.messages.error);
// 	}
// }