const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { ActionRowBuilder } = require('@discordjs/builders');
const content = require('../../srcs/content/command_content.js');
const data_service = require('../../srcs/services/data_service.js');

// Command definition
module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription(content.command_content.fr.list.description)
		.setDescriptionLocalizations({
			'en-US': content.command_content.en.list.description,
			'en-GB': content.command_content.en.list.description
		}),

	async execute(interaction) {
		await list(interaction, 0);
	}
};

// Function to handle listing and pagination
async function list(interaction, startIndex = 0) {
	try {
		const lang = await data_service.get_lang(interaction.guild.id);
		
		// Load prompts dynamically for the guild
		const filepath = path.join(process.cwd(), `./guilds/${interaction.guild.id}/_prompts_${interaction.guild.id}.json`);
		
		if (!fs.existsSync(filepath)) {
			await interaction.reply({
				content: content.command_content[lang].errors.guild_not_configured,
				ephemeral: true
			});
			return;
		}
		
		const jsonprompt = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
		
		if (jsonprompt.length === 0) {
			await interaction.reply({
				content: content.command_content[lang].list.empty,
				ephemeral: true
			});
			return;
		}
		
		if (startIndex < 0) startIndex = 0;
		if (startIndex >= jsonprompt.length) startIndex = jsonprompt.length - 5;

		const ActualPrompts = jsonprompt.slice(startIndex, startIndex + 5);
		const totalPrompts = jsonprompt.length;

		// Utiliser les fonctions de couleur du système de contenu
		const contentDescription = ActualPrompts.map(prompt => 
			`**${prompt.num}**. 🏷️ ${content.green(prompt.tag)}\n${prompt.Pprompt}`
		).join('\n\n');

		// Créer l'embed avec le header multilingue
		const embed = new EmbedBuilder()
			.setTitle(content.command_content[lang].list.embed.title)
			.setDescription(contentDescription)
			.setColor(0x3498DB)
			.addFields(content.msg_list_header(lang, startIndex + 1, startIndex + ActualPrompts.length, totalPrompts));

		const precedent = new ButtonBuilder()
			.setCustomId('precedent')
			.setLabel(content.command_content[lang].list.buttons.previous)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(startIndex <= 0);

		const suivant = new ButtonBuilder()
			.setCustomId('suivant')
			.setLabel(content.command_content[lang].list.buttons.next)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(startIndex + 5 >= totalPrompts);

		const row = new ActionRowBuilder().addComponents(precedent, suivant);

		if (interaction.isCommand()) {
			await interaction.reply({
				embeds: [embed],
				components: [row]
			});
		}

		const filter = i => i.customId === 'precedent' || i.customId === 'suivant';
		const collector = interaction.channel.createMessageComponentCollector({ 
			filter,
			time: 300000 // 5 minutes
		});

		collector.on('collect', async i => {
			try {
				// Reload prompts for updated data
				const filepath = path.join(process.cwd(), `./guilds/${interaction.guild.id}/_prompts_${interaction.guild.id}.json`);
				const jsonprompt = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
				const totalPrompts = jsonprompt.length;
				
				if (i.customId === 'precedent') {
					startIndex -= 5;
				} else if (i.customId === 'suivant') {
					startIndex += 5;
				}
				
				if (startIndex < 0) startIndex = 0;
				if (startIndex >= jsonprompt.length) startIndex = jsonprompt.length - 5;
		
				const ActualPrompts = jsonprompt.slice(startIndex, startIndex + 5);
				const contentDescription = ActualPrompts.map(prompt => 
					`**${prompt.num}**. 🏷️ ${content.green(prompt.tag)}\n${prompt.Pprompt}`
				).join('\n\n');
				
				const embed = new EmbedBuilder()
					.setTitle(content.command_content[lang].list.embed.title)
					.setDescription(contentDescription)
					.setColor(0x3498DB)
					.addFields(content.msg_list_header(lang, startIndex + 1, startIndex + ActualPrompts.length, totalPrompts));
				
				await i.deferUpdate();
				
				const precedent = new ButtonBuilder()
					.setCustomId('precedent')
					.setLabel(content.command_content[lang].list.buttons.previous)
					.setStyle(ButtonStyle.Primary)
					.setDisabled(startIndex === 0);

				const suivant = new ButtonBuilder()
					.setCustomId('suivant')
					.setLabel(content.command_content[lang].list.buttons.next)
					.setStyle(ButtonStyle.Primary)
					.setDisabled(startIndex + 5 >= totalPrompts);

				const row = new ActionRowBuilder().addComponents(precedent, suivant);

				await i.editReply({
					embeds: [embed],
					components: [row]
				});
			} catch (error) {
				console.error('Error during pagination update:', error);
			}
		});

		collector.on('end', collected => {
			if (collected.size === 0) {
				interaction.editReply({
					content: content.command_content[lang].list.timeout,
					components: []
				}).catch(console.error);
			}
		});
	} catch (error) {
		console.error('Error during pagination:', error);
		
		const lang = await data_service.get_lang(interaction.guild.id).catch(() => 'fr');
		const errorMessage = content.command_content[lang].errors.general;
		
		if (!interaction.replied) {
			await interaction.reply({ content: errorMessage, ephemeral: true });
		} else {
			await interaction.followUp({ content: errorMessage, ephemeral: true });
		}
	}
}
