const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { ActionRowBuilder } = require('@discordjs/builders');
const msg = require('../../srcs/content/command_content.js');
const btn = require('../../srcs/content/buttons_content.js');
const data_service = require('../../srcs/services/data_service.js');

// Command definition
module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription(msg.command_content.fr.list.description)
		.setDescriptionLocalizations({
			'en-US': msg.command_content.en.list.description,
			'en-GB': msg.command_content.en.list.description
		}),

	async execute(interaction) {
		await list(interaction, 0);
	}
};

// Function to handle listing and pagination
async function list(interaction, startIndex = 0) {
	try {
		let lang = 'fr';
		try {
			lang = await data_service.get_lang(interaction.guild.id);
		} catch (e) {
			console.warn('Langue non trouvée, fallback fr');
		}
		if (!msg.command_content[lang]) {
			console.warn('Langue non supportée, fallback fr');
			lang = 'fr';
		}
		
		// Load prompts dynamically for the guild
		const filepath = path.join(process.cwd(), `./guilds/${interaction.guild.id}/_prompts_${interaction.guild.id}.json`);
		
		if (!fs.existsSync(filepath)) {
			await interaction.reply({
				content: msg.command_content[lang].errors.guild_not_configured,
				flags: 64 // MessageFlags.Ephemeral
			});
			return;
		}
		
		const jsonprompt = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
		
		if (jsonprompt.length === 0) {
			await interaction.reply({
				content: msg.command_content[lang].list.empty,
				flags: 64 // MessageFlags.Ephemeral
			});
			return;
		}
		
		if (startIndex < 0) startIndex = 0;
		if (startIndex >= jsonprompt.length) startIndex = jsonprompt.length - 5;

		const ActualPrompts = jsonprompt.slice(startIndex, startIndex + 5);
		const totalPrompts = jsonprompt.length;

		// Utiliser les fonctions de couleur du système de contenu
		const contentDescription = ActualPrompts.map(prompt => 
			`**${prompt.num}**. 🏷️ ${msg.green(prompt.tag)}\n${prompt.Pprompt}`
		).join('\n\n');
		console.log("contentDescription is set : line 65.");
		// Créer l'embed avec le header multilingue
		const embed = new EmbedBuilder()
			.setTitle(msg.command_content[lang].list.messages.title)
			.setDescription(contentDescription)
			.setColor(0x3498DB)
			.addFields(msg.msg_list_header(lang, Math.floor(startIndex / 5) + 1,Math.floor(totalPrompts/5), totalPrompts));

		const precedent = new ButtonBuilder()
			.setCustomId('precedent')
			.setLabel(btn.buttons_content[lang].generic.previous)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(startIndex <= 0);

		const suivant = new ButtonBuilder()
			.setCustomId('suivant')
			.setLabel(btn.buttons_content[lang].generic.next)
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
		let lang = 'fr';
		try {
			lang = await data_service.get_lang(interaction.guild.id);
		} catch (e) {
			console.warn('Langue non trouvée, fallback fr');
		}
		if (!msg.command_content[lang]) {
			console.warn('Langue non supportée, fallback fr');
			lang = 'fr';
		}

				if (i.customId === 'precedent') {
					startIndex -= 5;
				} else if (i.customId === 'suivant') {
					startIndex += 5;
				}
				
				if (startIndex < 0) startIndex = 0;
				if (startIndex >= jsonprompt.length) startIndex = jsonprompt.length - 5;
		
				const ActualPrompts = jsonprompt.slice(startIndex, startIndex + 5);
				const contentDescription = ActualPrompts.map(prompt => 
					`**${prompt.num}**. 🏷️ ${msg.green(prompt.tag)}\n${prompt.Pprompt}`
				).join('\n\n');
				
				const embed = new EmbedBuilder()
					.setTitle(msg.command_content[lang].list.messages.title)
					.setDescription(contentDescription)
					.setColor(0x3498DB)
					.addFields(msg.msg_list_header(lang, Math.floor(startIndex / 5) + 1,Math.floor(totalPrompts/5), totalPrompts));
				
				await i.deferUpdate();
				
				const precedent = new ButtonBuilder()
					.setCustomId('precedent')
					.setLabel(btn.buttons_content[lang].generic.previous)
					.setStyle(ButtonStyle.Primary)
					.setDisabled(startIndex === 0);

				const suivant = new ButtonBuilder()
					.setCustomId('suivant')
					.setLabel(btn.buttons_content[lang].generic.next)
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

		collector.on('end', async collected => {
				interaction.editReply({
					content: msg.command_content[currentLang].list.timeout,
					components: []
				})
		});
	} catch (error) {
		console.error('Error during pagination:', error);
		
		let langErr = 'fr';
		try {
			langErr = await data_service.get_lang(interaction.guild.id);
		} catch (e) {
			console.error('Error while attemp to update language:', error);
		}
		if (!msg.command_content[langErr]) langErr = 'fr';
			const errorMessage = msg.command_content[langErr].errors.general;
		if (!interaction.replied) {
			await interaction.reply({ content: errorMessage, flags: 64 });
		} else {
			await interaction.followUp({ content: errorMessage, flags: 64 });
		}
	}
}
