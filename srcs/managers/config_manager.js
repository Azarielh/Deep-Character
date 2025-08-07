// Node recquirements
const fs	= require('node:fs');
const path	= require('node:path');

// Discord requirements
const {
	ChannelType,
	PermissionFlagsBits,
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

// Messages multilingues pour le setup
const embedMessages = {
	fr: {
		title: '# Bienvenue dans Deep-Character Setup!',
		description: '## Ce channel temporaire vous permettra de configurer votre bot Deep-Character.\n',
		fields: [
			{
				name: '### 📋 Que fait ce channel ?',
				value: '• **Configuration des paramètres du bot**\n• **Choix de la langue (français/anglais)**\n• **Initialisation des prompts standards dans la langue choisie.**\n• **Définition des rôles et permissions**\n\n',
				inline: false
			},
			{
				name: '### ⚙️ Comment procéder ?',
				value: '**Utilisez les boutons et menus ci-dessous pour configurer votre bot selon vos préférences. Chaque étape sera guidée.**\n\n',
				inline: false
			},
			{
				name: '### 🗑️ Suppression automatique',
				value: '**Ce channel se supprimera automatiquement une fois la configuration terminée.**\n\n',
				inline: false
			},
			{
				name: '### 🔄 Reconfiguration',
				value: '**Besoin de modifier la configuration plus tard ? Utilisez la commande `/setup` pour rouvrir ce channel.\n\n**',
				inline: false
			},
			{
				name: '## Passons à la toute première étape !',
				value: '**Choisissez la langue de votre serveur à l\aide des drapeaux ci dessous\n\n',
				inline: false
			}
		]
	},
	en: {
		title: '# 🎭 Welcome to Deep-Character Setup!',
		description: '## This temporary channel will allow you to configure your Deep-Character bot.\n',
		fields: [
			{
				name: '### 📋 What does this channel do?',
				value: '• **Bot parameters configuration**\n• **Language choice (French/English)**\n• **Standards prompts in the languages you choosed**\n• **Roles and permissions definition**\n\n',
				inline: false
			},
			{
				name: '### ⚙️ How to proceed?',
				value: '**Use the buttons and menus below to configure your bot according to your preferences. Each step will be guided.**\n\n',
				inline: false
			},
			{
				name: '### 🗑️ Automatic deletion',
				value: '**This channel will automatically delete itself once the configuration is completed.**\n\n',
				inline: false
			},
			{
				name: '### 🔄 Reconfiguration',
				value: '**Need to modify the configuration later? Use the `/setup` command to reopen this channel.**\n\n',
				inline: false
			}
		]
	}
};

const menu_translation = {
    fr: {
		confirm_lang_prompt: 'Veuillez confirmer la langue de votre serveur',
        sel_chan_msg: 'Il faut choisir un salon où je pourrais poster les prompts pour vos joueurs.',
        sel_chan_placeholder: 'Choisissez un salon...',
        continue: 'Continuer',
        cancel: 'Annuler'
    },
    en: {
		confirm_lang_prompt: 'Veuillez confirmer la langue de votre serveur',
        sel_chan_msg: 'Choose a channel',
        sel_chan_placeholder: 'No category', 
        continue: 'Continue',
        cancel: 'Cancel'
    }
};

// Fonction pour créer l'embed de setup
function createSetupEmbed(language, client) {
	const messages = embedMessages[language];
	return new EmbedBuilder()
		.setColor(0x5865F2)
		.setTitle(messages.title)
		.setDescription(messages.description)
		.addFields(messages.fields)
		.setFooter({ 
			text: 'Deep-Character • Configuration',
			iconURL: client.user.displayAvatarURL()
		})
		.setTimestamp();
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
			const frEmbed = createSetupEmbed('fr', client);

			await interaction.update({ embeds: [frEmbed], components: [languageButtons]});
			ds.build_guild_folder(guild.id);
			await ds.save_Data('config', guild.id, { name: guild.name, id: guild.id, lang: 'fr' });
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
					lang: 'en'
				});
			
			// Initialiser les fichiers de données du serveur
			ds.load_data(guild.id, 'data_character');
			ds.load_data(guild.id, 'prompts');
			const enLanguageEmbed = new EmbedBuilder()
				.setColor(0x28a745)
				.setTitle('🇬🇧 English language selected')
				.setDescription('Now that you choosed English, I\'ve assigned a standard prompt\'s file for your guild.\n')
				.addFields(
					{
						name: '📝 About standard prompts',
						value: 'Those prompts are supposed to be universal and should work for any kind of world going from medieval (or earlier) to far future and with or without magic.\n',
						inline: false
					},
					{
						name: '💬 Need help?',
						value: 'Please if you find anything you feel doesn\'t qualify as such standard, feel free to contact me.\n',
						inline: false
					},
					{
						name: '🎯 Next step',
						value: 'From now on you can add your own prompts so you can have specific prompts for your world.\n',
						inline: false
					}
				)
				.setFooter({ 
					text: 'Deep-Character • Configuration - Step 2/3',
					iconURL: client.user.displayAvatarURL()
				})
				.setTimestamp();
			
			await channel.send({ embeds: [enLanguageEmbed] });
			const select_chan = channel_selector('en', guild, channel);
		} else if (interaction.customId === 'channel_selector') {
			const selectedChannelId = interaction.values[0];
			const selectedChannel = guild.channels.cache.get(selectedChannelId);
			
			const config = ds.load_data(guild.id, 'config');
			const language = config.lang || 'fr';
			
			ds.save_Data('config', guild.id, {
				...config,
				promptChannel: selectedChannelId
			});
			
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
				ephemeral: false
			});
			
			// Envoyer le message de clôture après les embeds de fonctionnalités
			await setup_closure_message(language, channel, client);
		} else if (interaction.customId === 'close_setup_channel') {
			await interaction.reply({
				content: '👋 Merci d\'avoir utilisé Deep-Character ! Le channel sera supprimé dans 5 secondes...',
				ephemeral: true
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
			.setPlaceholder(menu_translation[language].sel_chan_placeholder)
			.setMinValues(1)
			.setMaxValues(1)
			.addOptions(channels);
	const select_row = new ActionRowBuilder()
			.addComponents(channel_select_menu);
	await channel.send({
			content: menu_translation[language].sel_chan_msg,
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