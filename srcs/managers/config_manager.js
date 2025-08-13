// Node recquirements
const fs	= require('node:fs');
const path	= require('node:path');

// Chemin du fichier index.html à modifier
const INDEX_HTML_PATH = path.resolve(__dirname, '../../docs/index.html');

/**
 * Lit et modifie le bloc <script id="stats-json"> dans index.html
 * @returns {Object} Les données JSON actuelles
 */
function getStatsJson() {
	const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
	const match = html.match(/<script id="stats-json" type="application\/json">([\s\S]*?)<\/script>/);
	if (!match) throw new Error('Bloc <script id="stats-json"> introuvable');
	return JSON.parse(match[1]);
}

function setStatsJson(newData) {
	const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
	const newJson = JSON.stringify(newData, null, 2);
	const newHtml = html.replace(/(<script id="stats-json" type="application\/json">)[\s\S]*?(<\/script>)/,
		`$1\n  ${newJson}\n  $2`);
	fs.writeFileSync(INDEX_HTML_PATH, newHtml, 'utf8');
}

// Discord requirements
const {
	ChannelType,
	PermissionFlagsBits,
	MessageFlags,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	SelectMenuBuilder,
	EmbedBuilder,
	ComponentType,
	StringSelectMenuBuilder
} = require('discord.js');

// Custom module
const ds = require('../services/data_service.js');
const setup_content = require('../contents/setup_content.js');
const { getSetupEmbed } = require('../contents/setup_content.js');

function createSetupEmbed(language, client, stepKey = 'welcome_embed') {
	const messages = getSetupEmbed(language, stepKey);
	const embed = new EmbedBuilder()
		.setColor(0x5865F2);
	if (messages.title) embed.setTitle(messages.title);
	if (messages.description) embed.setDescription(messages.description);
	if (Array.isArray(messages.fields)) {
		embed.addFields(messages.fields);
	} else if (messages.name && messages.value) {
		embed.addFields([{ name: messages.name, value: messages.value }]);
	}
	if (messages.footer) {
		embed.setFooter({ text: messages.footer, iconURL: client.user.displayAvatarURL() });
	} else {
		embed.setFooter({ text: 'Deep-Character • Configuration', iconURL: client.user.displayAvatarURL() });
	}
	embed.setTimestamp();
	return embed;
}

async function config_manager(guild, client) {

	const channel = await guild.channels.create({
						name: 'deep-character setup',
						type: ChannelType.GuildText,
						permissionOverwrites: [
							{
								id: guild.id,
								deny: [PermissionFlagsBits.ViewChannel]
							},
							{
								id: client.user.id,
								allow: [PermissionFlagsBits.ViewChannel]
							}
						]
					});
	// Get guild's admins to grant them permissions to the channel.
	const admins = guild.members.cache.filter(member =>
						member.permissions.has(PermissionFlagsBits.Administrator) &&
						member.id !== guild.ownerId
					);
	for (const [id, member] of admins) {
		await channel.permissionOverwrites.create(member, {
				ViewChannel: true,
				SendMessages: true,
				ReadMessageHistory: true
		});
	}
	const languageButtons = await language_selector(client, channel);
	const collector = channel.createMessageComponentCollector({
	});

	collector.on('collect', async (interaction) => {
		if (interaction.customId === 'setup_lang_fr') {
			const frEmbed = createSetupEmbed('fr', client, 'welcome_embed');

			await interaction.update({ embeds: [frEmbed], components: [languageButtons]});
			ds.build_guild_folder(guild.id);
			await ds.save_Data('config', guild.id, {
				name: guild.name,
				id: guild.id,
				lang: 'fr',
				switch_cron_inspire: 'off',
				promptChannel: null
			});
			ds.load_data(guild.id, 'data_character');
			ds.load_data(guild.id, 'prompts');
						
			const frLanguageEmbed = new EmbedBuilder()
				.setColor(0x28a745)
				.setTitle('🇫🇷 Langue française sélectionnée')
				.setDescription('Maintenant que vous avez choisi le français, j\'ai assigné un fichier de prompts standards pour votre serveur.\n')
				.addFields(
					{
						name: '📝 À propos des prompts standards',
						value: 'Ces prompts sont supposés être universels et devraient fonctionner pour tout type d\'univers allant du médiéval (ou antérieur) au futur lointain, avec ou sans magie.\n',
						inline: false
					},
					{
						name: '💬 Besoin d\'aide ?',
						value: 'Si vous trouvez quelque chose qui ne vous semble pas correspondre à ces standards, n\'hésitez pas à me contacter.\n',
						inline: false
					},
					{
						name: '🎯 Prochaine étape',
						value: 'À partir de maintenant, vous pouvez ajouter vos propres prompts pour avoir des prompts spécifiques à votre univers.\n',
						inline: false
					}
				)
				.setFooter({ 
					text: 'Deep-Character • Configuration - Étape 2/3',
					iconURL: client.user.displayAvatarURL()
				})
				.setTimestamp();

			await channel.send({ embeds: [frLanguageEmbed] });

			const scheduledPromptEmbed = new EmbedBuilder()
				.setColor(0x3498db)
				.setTitle(scheduledPromptName)
				.setDescription(scheduledPromptValue);
			const onOffRow = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId('cron_on')
					.setLabel('Activer')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('cron_off')
					.setLabel('Désactiver')
					.setStyle(ButtonStyle.Danger)
			);
			await channel.send({ embeds: [scheduledPromptEmbed], components: [onOffRow] });

			// Attente du choix ON/OFF avant de poursuivre
			const filter = i => i.customId === 'cron_on' || i.customId === 'cron_off';
			const collectorCron = channel.createMessageComponentCollector({ filter, max: 1, time: 120000 });
			await new Promise((resolve) => {
				collectorCron.on('collect', async (interaction) => {
					const config = ds.load_data(guild.id, 'config');
					let newValue = interaction.customId === 'cron_on' ? 'on' : 'off';
					ds.save_Data('config', guild.id, { ...config, switch_cron_inspire: newValue });
					await interaction.reply({
						content: newValue === 'on' ? '✅ L\'envoi planifié de prompts est activé.' : '⛔ L\'envoi planifié de prompts est désactivé.',
						flags: MessageFlags.Ephemeral
					});
					resolve();
				});
				collectorCron.on('end', collected => {
					if (collected.size === 0) {
						channel.send('⏰ Temps écoulé. Vous pouvez relancer la configuration si besoin.');
						resolve();
					}
				});
			});

			const configAfter = ds.load_data(guild.id, 'config');
			if (configAfter.switch_cron_inspire === 'off') return;

			const select_chan = channel_selector('fr', guild, channel);

		} else if (interaction.customId === 'setup_lang_en') {
			const enEmbed = createSetupEmbed('en', client);
			await interaction.update({
				embeds: [enEmbed],
				components: [languageButtons]
			});
			ds.build_guild_folder(guild.id);
			await ds.save_Data('config', guild.id, {
					name: guild.name,
					id: guild.id,
					lang: 'en',
					switch_cron_inspire: 'off',
					promptChannel: null
				});
			
			// Initialiser les fichiers de données du serveur
			ds.load_data(guild.id, 'data_character');
			ds.load_data(guild.id, 'prompts');
			const enLanguageEmbed = createSetupEmbed('en', client, 'language_confirmation');
			await channel.send({ embeds: [enLanguageEmbed] });

			const scheduledPromptEmbed = createSetupEmbed('en', client, 'scheduled_prompt_info');
			const onOffRow = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId('cron_on')
					.setLabel('Enable')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('cron_off')
					.setLabel('Disable')
					.setStyle(ButtonStyle.Danger)
			);
			await channel.send({ embeds: [scheduledPromptEmbed], components: [onOffRow] });

			// Attente du choix ON/OFF avant de poursuivre
			const filter = i => i.customId === 'cron_on' || i.customId === 'cron_off';
			const collectorCron = channel.createMessageComponentCollector({ filter, max: 1, time: 120000 });
			await new Promise((resolve) => {
				collectorCron.on('collect', async (interaction) => {
					const config = ds.load_data(guild.id, 'config');
					let newValue = interaction.customId === 'cron_on' ? 'on' : 'off';
					ds.save_Data('config', guild.id, { ...config, switch_cron_inspire: newValue });
					await interaction.reply({
						content: newValue === 'on' ? '✅ Scheduled prompt sending is enabled.' : '⛔ Scheduled prompt sending is disabled.',
						flags: MessageFlags.Ephemeral
					});
					resolve();
				});
				collectorCron.on('end', collected => {
					if (collected.size === 0) {
						channel.send('⏰ Time is up. You can restart the configuration if needed.');
						resolve();
					}
				});
			});

			// Si désactivé, on arrête la config ici
			const configAfter = ds.load_data(guild.id, 'config');
			if (configAfter.switch_cron_inspire === 'off') return;

			const select_chan = channel_selector('en', guild, channel);
		} else if (interaction.customId === 'channel_selector') {
			const selectedChannelId = interaction.values[0];
			const selectedChannel = guild.channels.cache.get(selectedChannelId);
			
			const config = ds.load_data(guild.id, 'config');
			const language = config.lang || 'fr';
			
			ds.save_Data('config', guild.id, {
				...config,
				promptChannel: selectedChannelId,
			});
			const configPath = path.resolve(__dirname, '../../config.json');
			const dev_config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
			dev_config.guild_len = (dev_config.guild_len || 0) + 1;
			fs.writeFileSync(configPath, JSON.stringify(dev_config, null, 2), 'utf-8');			
			
			
			// Embed de fin de configuration
			const completionEmbed = new EmbedBuilder()
				.setColor(0x17a2b8)
				.setTitle(language === 'fr' ? '✅ Configuration terminée !' : '✅ Configuration completed!')
				.setDescription(language === 'fr' 
					? `Le salon **${selectedChannel.name}** a été sélectionné pour recevoir les prompts.\n`
					: `The **${selectedChannel.name}** channel has been selected to receive prompts.\n`)
				.addFields(
					{
						name: language === 'fr' ? '⚠️ Limitations actuelles' : '⚠️ Current limitations',
						value: language === 'fr' 
							? 'Actuellement, le bot ne permet pas d\'autres options de configuration disponibles via ce channel. Nous nous en excusons.\n'
							: 'Currently, the bot does not allow other configuration options available through this channel. We apologize for this.\n',
						inline: false
					}
				)
				.setFooter({ 
					text: language === 'fr' ? 'Deep-Character • Configuration - Étape 3/3' : 'Deep-Character • Configuration - Step 3/3',
					iconURL: client.user.displayAvatarURL()
				})
				.setTimestamp();
			
			// Embed des fonctionnalités actuelles et futures
			const featuresEmbed = new EmbedBuilder()
				.setColor(0x6f42c1)
				.setTitle(language === 'fr' ? '🚀 Fonctionnalités & Roadmap' : '🚀 Features & Roadmap')
				.setDescription(language === 'fr' 
					? 'Voici ce qui est disponible maintenant et ce qui arrive bientôt !\n'
					: 'Here\'s what\'s available now and what\'s coming soon!\n')
				.addFields(
					{
						name: language === 'fr' ? '✅ Fonctionnalités actuelles' : '✅ Current features',
						value: language === 'fr' 
							? '• **Envoi de prompts** - `/inspire` - Le bot peut envoyer des prompts aléatoires ou spécifiques pour développer vos personnages\n• **Liste des prompts** - `/list` - Affiche la liste paginée de tous les prompts disponibles\n• **Ajout de prompts** - `/add` - Permet aux admins d\'ajouter de nouveaux prompts personnalisés\n• **Modification de prompts** - `/mod` - Permet aux admins de modifier des prompts existants\n• **Système de dés** - `/roll` - Effectue des jets de dés avec nombre de faces et quantité personnalisables\n• **Configuration personnalisée** - Choix du salon de destination\n'
							: '• **Prompt sending** - `/inspire` - The bot can send random or specific prompts to develop your characters\n• **Prompt listing** - `/list` - Display paginated list of all available prompts\n• **Add prompts** - `/add` - Allows admins to add new custom prompts\n• **Modify prompts** - `/mod` - Allows admins to modify existing prompts\n• **Dice system** - `/roll` - Perform dice rolls with customizable faces and quantity\n• **Custom configuration** - Choice of destination channel\n',
						inline: false
					},
					{
						name: language === 'fr' ? '🔮 Fonctionnalités prévues' : '🔮 Planned features',
						value: language === 'fr' 
							? '• **Création de personnage** - Création complète depuis Discord\n• **Système de tags** - Catégoriser les prompts par tags pour un filtrage avancé\n• **Suivi des réponses** - Accès aux réponses des joueurs pour les MJ\n• **Feedback système** - Communication MJ ↔ Joueurs sur les réponses\n• **Quiz d\'univers** - Jeux de questions personnalisés selon l\'univers du serveur\n• **Système de salaire** - Revenus automatiques selon le métier\n• **Boutique intégrée** - Système d\'achat et vente\n'
							: '• **Character creation** - Complete creation from Discord\n• **Tag system** - Categorize prompts by tags for advanced filtering\n• **Response tracking** - Access to player responses for GMs\n• **Feedback system** - GM ↔ Player communication on responses\n• **Universe quiz** - Custom quiz games based on server\'s universe\n• **Salary system** - Automatic income based on job\n• **Integrated shop** - Buy and sell system\n',
						inline: false
					},
					{
						name: language === 'fr' ? '💡 Une idée ? Un bug ?' : '💡 An idea? A bug?',
						value: language === 'fr' 
							? 'N\'hésitez pas à contacter le développeur pour toute suggestion ou problème rencontré !\n'
							: 'Feel free to contact the developer for any suggestions or issues encountered!\n',
						inline: false
					}
				)
				.setFooter({ 
					text: language === 'fr' ? 'Deep-Character • Développé avec ❤️' : 'Deep-Character • Made with ❤️',
					iconURL: client.user.displayAvatarURL()
				})
				.setTimestamp();
			
			await interaction.reply({
				embeds: [completionEmbed, featuresEmbed],
				flags: MessageFlags.Ephemeral
			});
			
			// Envoyer le message de clôture après les embeds de fonctionnalités
			await setup_closure_message(language, channel, client);
		} else if (interaction.customId === 'close_setup_channel') {
			await interaction.reply({
				content: '👋 Merci d\'avoir utilisé Deep-Character ! Le channel sera supprimé dans 5 secondes...',
				flags: MessageFlags.Ephemeral
			});
			collector.stop('Setup is done');
		}
	});

	collector.on('end', () => {
		setTimeout(() => {
			channel.delete();
			console.log('Collector terminé');
		}, 5000);
	});
	return channel;
}

async function language_selector(client, channel)
{	// Message de bienvenue expliquant le fonctionnement du channel
	const welcomeEmbed = createSetupEmbed('fr', client);

	// Boutons pour choisir la langue
	const languageButtons = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('setup_lang_fr')
				.setLabel('Français')
				.setEmoji('🇫🇷')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('setup_lang_en')
				.setLabel('English')
				.setEmoji('🇬🇧')
				.setStyle(ButtonStyle.Secondary)
		);

	await channel.send({ 
		embeds: [welcomeEmbed], 
		components: [languageButtons] 
	});
	return languageButtons;
}

async function channel_selector(language, guild, channel) {
	const channels = await guild.channels.cache
		.filter(ch => ch.type === ChannelType.GuildText)
		.sort((a, b) => a.position - b.position)
		.map(ch => ({
			label: ch.name,
			value: ch.id,
			description: ch.parent ? `📁 ${ch.parent.name}` : undefined
		}));
	const channel_select_menu = new StringSelectMenuBuilder()
			.setCustomId('channel_selector')
			.setPlaceholder(setup_content.menu_translation[language].sel_chan_placeholder)
			.setMinValues(1)
			.setMaxValues(1)
			.addOptions(channels);
	const select_row = new ActionRowBuilder()
			.addComponents(channel_select_menu);
	await channel.send({
			content: setup_content.menu_translation[language].sel_chan_msg,
			components: [select_row]
		});
	return select_row;
}

async function setup_closure_message(language, channel, client) {
	const closureEmbed = new EmbedBuilder()
		.setColor(0x2ecc71)
		.setTitle(language === 'fr' ? '🎉 Configuration terminée avec succès !' : '🎉 Configuration completed successfully!')
		.setDescription(language === 'fr' 
			? 'Votre bot Deep-Character est maintenant configuré et prêt à être utilisé sur votre serveur !\n'
			: 'Your Deep-Character bot is now configured and ready to be used on your server!\n')
		.addFields(
			{
				name: language === 'fr' ? '✅ Ce qui a été configuré' : '✅ What has been configured',
				value: language === 'fr' 
					? '• **Langue du serveur** définie\n• **Prompts standards** initialisés\n• **Channel de destination** sélectionné\n'
					: '• **Server language** set\n• **Standard prompts** initialized\n• **Destination channel** selected\n',
				inline: false
			},
			{
				name: language === 'fr' ? '🔄 Reconfiguration future' : '🔄 Future reconfiguration',
				value: language === 'fr' 
					? 'Si vous souhaitez modifier ces paramètres plus tard, utilisez simplement la commande `/setup` pour rouvrir ce processus de configuration.\n'
					: 'If you want to modify these settings later, simply use the `/setup` command to reopen this configuration process.\n',
				inline: false
			},
			{
				name: language === 'fr' ? '🗑️ Nettoyage' : '🗑️ Cleanup',
				value: language === 'fr' 
					? 'Vous pouvez maintenant fermer ce channel de configuration temporaire en cliquant sur le bouton ci-dessous.\n'
					: 'You can now close this temporary configuration channel by clicking the button below.\n',
				inline: false
			}
		)
		.setFooter({ 
			text: language === 'fr' ? 'Deep-Character • Prêt à l\'utilisation' : 'Deep-Character • Ready to use',
			iconURL: client.user.displayAvatarURL()
		})
		.setTimestamp();
	
	const closeButton = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('close_setup_channel')
				.setLabel(language === 'fr' ? 'Fermer ce salon' : 'Close this channel')
				.setEmoji('🗑️')
				.setStyle(ButtonStyle.Danger)
		);
	
	await channel.send({
		embeds: [closureEmbed],
		components: [closeButton]
	});
}

module.exports = {
	config_manager
}