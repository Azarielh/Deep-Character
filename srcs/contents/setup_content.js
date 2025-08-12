/**
 * Bot setup/configuration process specific content
 * Includes all embeds, messages and texts used during installation
 */

const setup_content = {
    fr: {
        // Main welcome embed
        welcome_embed: {
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
            ],
            footer: 'Deep-Character • Configuration'
        },
        
        // Language confirmation messages
        language_confirmation: {
            title: '🇫🇷 Langue française sélectionnée',
            description: 'Maintenant que vous avez choisi le français, j\'ai assigné un fichier de prompts standards pour votre serveur.\n',
            prompts_info: {
                name: '📝 À propos des prompts standards',
                value: 'Ces prompts sont supposés être universels et devraient fonctionner pour tout type d\'univers allant du médiéval (ou antérieur) au futur lointain, avec ou sans magie.\n'
            },
            help_info: {
                name: '💬 Besoin d\'aide ?',
                value: 'Si vous trouvez quelque chose qui ne vous semble pas correspondre à ces standards, n\'hésitez pas à me contacter.\n'
            },
            next_step: {
                name: '🎯 Prochaine étape',
                value: 'À partir de maintenant, vous pouvez ajouter vos propres prompts pour avoir des prompts spécifiques à votre univers.\n'
            },
            footer: 'Deep-Character • Configuration - Étape 2/3'
        },
        
        // Message d'information sur l'envoi planifié de prompts
        scheduled_prompt_info: {
            name: '⏰ Envoi planifié de prompts',
            value: `Vous pouvez activer l'envoi automatique de prompts dans le salon choisi.\nCette fonctionnalité permet à Deep-Character de poster régulièrement des prompts de développement pour vos personnages, sans intervention manuelle.\n\n💡 Cette option est particulièrement pertinente si de nombreux prompts ont été ajoutés par le staff du serveur, afin de proposer des idées variées et adaptées à votre univers.\nPlus vous ajoutez de prompts spécifiques à votre communauté, plus les suggestions automatiques seront riches et immersives pour vos joueurs !`
        },
        // Channel selection messages
        channel_selection: {
            prompt: 'Il faut choisir un salon où je pourrais poster les prompts pour vos joueurs.',
            confirm_lang_prompt: 'Veuillez confirmer la langue de votre serveur'
        },
        
        // Configuration completion embed
        completion: {
            title: '✅ Configuration terminée !',
            description: 'Le salon **{channelName}** a été sélectionné pour recevoir les prompts.\n',
            limitations: {
                name: '⚠️ Limitations actuelles',
                value: 'Actuellement, le bot ne permet pas d\'autres options de configuration disponibles via ce channel. Nous nous en excusons.\n'
            },
            footer: 'Deep-Character • Configuration - Étape 3/3'
        },
        
        // Features embed
        features: {
            title: '🚀 Fonctionnalités & Roadmap',
            description: 'Voici ce qui est disponible maintenant et ce qui arrive bientôt !\n',
            current_features: {
                name: '✅ Fonctionnalités actuelles',
                value: '• **Envoi de prompts** - `/inspire` - Le bot peut envoyer des prompts aléatoires ou spécifiques pour développer vos personnages\n• **Liste des prompts** - `/list` - Affiche la liste paginée de tous les prompts disponibles\n• **Ajout de prompts** - `/add` - Permet aux admins d\'ajouter de nouveaux prompts personnalisés\n• **Modification de prompts** - `/mod` - Permet aux admins de modifier des prompts existants\n• **Système de dés** - `/roll` - Effectue des jets de dés avec nombre de faces et quantité personnalisables\n• **Configuration personnalisée** - Choix du salon de destination\n'
            },
            planned_features: {
                name: '🔮 Fonctionnalités prévues',
                value: '• **Création de personnage** - Création complète depuis Discord\n• **Système de tags** - Catégoriser les prompts par tags pour un filtrage avancé\n• **Suivi des réponses** - Accès aux réponses des joueurs pour les MJ\n• **Feedback système** - Communication MJ ↔ Joueurs sur les réponses\n• **Quiz d\'univers** - Jeux de questions personnalisés selon l\'univers du serveur\n• **Système de salaire** - Revenus automatiques selon le métier\n• **Boutique intégrée** - Système d\'achat et vente\n'
            },
            contact: {
                name: '💡 Une idée ? Un bug ?',
                value: 'N\'hésitez pas à contacter le développeur pour toute suggestion ou problème rencontré !\n'
            },
            footer: 'Deep-Character • Développé avec ❤️'
        },
        
        // Closure message
        closure: {
            title: '🎉 Configuration terminée avec succès !',
            description: 'Votre bot Deep-Character est maintenant configuré et prêt à être utilisé sur votre serveur !\n',
            configured_items: {
                name: '✅ Ce qui a été configuré',
                value: '• **Langue du serveur** définie\n• **Prompts standards** initialisés\n• **Channel de destination** sélectionné\n'
            },
            reconfiguration: {
                name: '🔄 Reconfiguration future',
                value: 'Si vous souhaitez modifier ces paramètres plus tard, utilisez simplement la commande `/setup` pour rouvrir ce processus de configuration.\n'
            },
            cleanup: {
                name: '🗑️ Nettoyage',
                value: 'Vous pouvez maintenant fermer ce channel de configuration temporaire en cliquant sur le bouton ci-dessous.\n'
            },
            footer: 'Deep-Character • Prêt à l\'utilisation'
        },
        
        // System messages
        system: {
            closing_message: '👋 Merci d\'avoir utilisé Deep-Character ! Le channel sera supprimé dans 5 secondes...',
            collector_ended: 'Collector terminé'
        }
    },
    en: {
        // Main welcome embed
        welcome_embed: {
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
            ],
            footer: 'Deep-Character • Configuration'
        },
        
        // Language confirmation messages
        language_confirmation: {
            title: '🇬🇧 English language selected',
            description: 'Now that you choosed English, I\'ve assigned a standard prompt\'s file for your guild.\n',
            prompts_info: {
                name: '📝 About standard prompts',
                value: 'Those prompts are supposed to be universal and should work for any kind of world going from medieval (or earlier) to far future and with or without magic.\n'
            },
            help_info: {
                name: '💬 Need help?',
                value: 'Please if you find anything you feel doesn\'t qualify as such standard, feel free to contact me.\n'
            },
            next_step: {
                name: '🎯 Next step',
                value: 'From now on you can add your own prompts so you can have specific prompts for your world.\n'
            },
            footer: 'Deep-Character • Configuration - Step 2/3'
        },
        // Scheduled prompt info message
        scheduled_prompt_info: {
            name: '⏰ Scheduled prompt sending',
            value: `You can enable automatic prompt sending in the selected channel.\nThis feature allows Deep-Character to regularly post character development prompt for your players, without manual intervention.\n\n💡 This option is especially relevant if many prompts have been added by your server staff, to provide varied and universe-specific ideas.\nThe more custom prompts you add for your community, the richer and more immersive the automatic suggestions will be!`
        },
        // Channel selection messages
        channel_selection: {
            prompt: 'Choose a channel',
            confirm_lang_prompt: 'Please confirm your server language'
        },
        
        // Configuration completion embed
        completion: {
            title: '✅ Configuration completed!',
            description: 'The **{channelName}** channel has been selected to receive prompts.\n',
            limitations: {
                name: '⚠️ Current limitations',
                value: 'Currently, the bot does not allow other configuration options available through this channel. We apologize for this.\n'
            },
            footer: 'Deep-Character • Configuration - Step 3/3'
        },
        
        // Features embed
        features: {
            title: '🚀 Features & Roadmap',
            description: 'Here\'s what\'s available now and what\'s coming soon!\n',
            current_features: {
                name: '✅ Current features',
                value: '• **Prompt sending** - `/inspire` - The bot can send random or specific prompts to develop your characters\n• **Prompt listing** - `/list` - Display paginated list of all available prompts\n• **Add prompts** - `/add` - Allows admins to add new custom prompts\n• **Modify prompts** - `/mod` - Allows admins to modify existing prompts\n• **Dice system** - `/roll` - Perform dice rolls with customizable faces and quantity\n• **Custom configuration** - Choice of destination channel\n'
            },
            planned_features: {
                name: '🔮 Planned features',
                value: '• **Character creation** - Complete creation from Discord\n• **Tag system** - Categorize prompts by tags for advanced filtering\n• **Response tracking** - Access to player responses for GMs\n• **Feedback system** - GM ↔ Player communication on responses\n• **Universe quiz** - Custom quiz games based on server\'s universe\n• **Salary system** - Automatic income based on job\n• **Integrated shop** - Buy and sell system\n'
            },
            contact: {
                name: '💡 An idea? A bug?',
                value: 'Feel free to contact the developer for any suggestions or issues encountered!\n'
            },
            footer: 'Deep-Character • Made with ❤️'
        },
        
        // Closure message
        closure: {
            title: '🎉 Configuration completed successfully!',
            description: 'Your Deep-Character bot is now configured and ready to be used on your server!\n',
            configured_items: {
                name: '✅ What has been configured',
                value: '• **Server language** set\n• **Standard prompts** initialized\n• **Destination channel** selected\n'
            },
            reconfiguration: {
                name: '🔄 Future reconfiguration',
                value: 'If you want to modify these settings later, simply use the `/setup` command to reopen this configuration process.\n'
            },
            cleanup: {
                name: '🗑️ Cleanup',
                value: 'You can now close this temporary configuration channel by clicking the button below.\n'
            },
            footer: 'Deep-Character • Ready to use'
        },
        
        // System messages
        system: {
            closing_message: '👋 Thank you for using Deep-Character! The channel will be deleted in 5 seconds...',
            collector_ended: 'Collector ended'
        }
    }
};

/**
 * Get a setup embed according to language
 * @param {string} language - Language code (fr/en)
 * @param {string} embedType - Embed type (welcome_embed, language_confirmation, etc.)
 * @returns {Object} Embed object
 */
function getSetupEmbed(language, embedType) {
    return setup_content[language]?.[embedType] || setup_content['fr'][embedType];
}

/**
 * Get a setup message according to language
 * @param {string} language - Language code (fr/en)
 * @param {string} category - Message category
 * @param {string} key - Specific message key
 * @returns {string} Message text
 */
function getSetupMessage(language, category, key) {
    return setup_content[language]?.[category]?.[key] || setup_content['fr'][category][key];
}

module.exports = {
    setup_content,
    getSetupEmbed,
    getSetupMessage
};