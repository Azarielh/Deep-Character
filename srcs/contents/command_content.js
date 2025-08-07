/**
 * Slash commands content and their messages
 * Includes responses, errors, confirmations and command descriptions
 */

const command_content = {
	fr: {
		// /inspire command
		inspire: {
			description: 'Envoie un prompt de développement de personnage',
			options: {
				index: 'Index du prompt spécifique à envoyer (optionnel)'
			},
			messages: {
				invalid_index: 'L\'index donné est incorrect.',
				no_prompts: 'Aucun prompt disponible.',
				error_loading: 'Erreur lors du chargement des prompts.'
			}
		},
		
		// /add command
		add: {
			description: 'Ajoute un nouveau prompt au système',
			options: {
				tag: 'Type de prompt à ajouter',
				prompt: 'Le texte du prompt à ajouter'
			},
			messages: {
				guildOnly: 'Cette commande ne peut être utilisée que dans un serveur.',
				processing: 'Oui maître, j\'enregistre votre demande',
				success: (prompt) => `**Super ! J'ai bien ajouté** "${prompt}"`,
				error: 'Erreur lors de l\'ajout du prompt.',
				invalid_input: 'Erreur : Les options fournies sont invalides'
			}
		},
		
		// /modify command
		modify: {
			description: 'Modifie un prompt existant',
			options: {
				index: 'Index du prompt à modifier',
				new_prompt: 'Nouveau texte du prompt'
			},
			messages: {
				waiting: 'Oui maître, j\'enregistre votre demande',
				success: '**Super ! J\'ai bien modifié** "{prompt}"',
				error: 'Une erreur est survenue lors de la modification du prompt',
				invalid_input: 'Erreur : Les options fournies sont invalides'
			}
		},
		
		// /list command
		list: {
			description: 'Affiche la liste paginée des prompts disponibles',
			options: {
				page: 'Numéro de page à afficher (optionnel)'
			},
			messages: {
				title: 'Liste des prompts disponibles',
				no_prompts: 'Aucun prompt disponible.',
				page_info: 'Page {current} sur {total}',
				total_prompts: 'Total : {count} prompts',
				invalid_page: 'Numéro de page invalide.',
				navigation_hint: 'Utilisez les boutons pour naviguer entre les pages.'
			}
		},
		
		// /vote command
		vote: {
			description: 'Lance un vote avec options personnalisées',
			options: {
				question: 'Question du vote',
				option1: 'Première option',
				option2: 'Deuxième option',
				option3: 'Troisième option (optionnel)',
				option4: 'Quatrième option (optionnel)'
			},
			messages: {
				title: '📊 Vote : {question}',
				no_votes: 'Aucun vote pour le moment.',
				vote_cast: 'Votre vote a été enregistré !',
				already_voted: 'Vous avez déjà voté !',
				results: 'Résultats du vote',
				closed: 'Ce vote est terminé.'
			}
		},
		
		// /roll command
		roll: {
			description: '🎲 Lance des dés',
			options: {
				dice: 'Nombre de dés à lancer',
				faces: 'Nombre de faces par dé'
			},
			messages: {
				result: '🎲 Résultat du lancer : **{result}**',
				details: 'Dés lancés : {dice}d{faces}',
				individual_results: 'Résultats individuels : {results}',
				total: 'Total : **{total}**',
				invalid_dice: '❌ Nombre de dés invalide (1-20).',
				invalid_faces: '❌ Nombre de faces invalide (2-1000).',
				simple_format: '**D{faces}** : {results}'
			}
		},
		
		// /setup command
		setup: {
			description: 'Configure le bot pour ce serveur',
			already_exists: '⚠️ Un channel de setup existe déjà : {channel}. Utilisez la commande `/close` pour le fermer avant d\'en créer un nouveau.',
			creating: '� Création du channel de configuration en cours...',
			success: '✅ Channel de setup créé avec succès : {channel}'
		},
		
		// /close command (admin)
		close: {
			description: 'Ferme le channel actuel après confirmation',
			confirm: '⚠️ **Attention !** Voulez-vous vraiment fermer le channel **{channel}** ?\n\n*Cette action est irréversible et supprimera définitivement ce channel.*',
			closing: '🗑️ Fermeture du channel **{channel}** en cours...',
			cancelled: '✅ Fermeture du channel annulée.',
			timeout: '⏰ Délai de confirmation expiré. Fermeture du channel annulée.',
			buttons: {
				confirm: '✅ Confirmer',
				cancel: '❌ Annuler'
			}
		},
		
		// Generic error messages
		errors: {
			permission_denied: '🚫 Vous n\'avez pas les permissions nécessaires pour cette action.',
			command_failed: '💥 La commande a échoué. Veuillez réessayer.',
			invalid_input: '❌ Paramètres invalides fournis.',
			database_error: '🗄️ Erreur de base de données.',
			unknown_error: '❓ Une erreur inconnue s\'est produite.',
			maintenance: '🔧 Le bot est en maintenance. Veuillez réessayer plus tard.',
			rate_limited: '⏰ Vous utilisez cette commande trop fréquemment. Veuillez patienter.',
			guild_not_configured: '⚙️ Ce serveur n\'est pas configuré. Utilisez `/setup` d\'abord.'
		},
		
		// System and automatic messages
		system: {
			response_received: 'Si seulement tu réalisais les implications de cette réponse :smirk:',
			prompt_format: '{num} : {prompt}',  // For inspire command and auto prompts
			error_general: 'There was an error while executing this command!'
		},
		// /help command
		help: {
			description: 'Affiche une aide pour les membres standards',
			user:	'**Commandes utilisateur :**\n' +
						'• `/inspire` : Envoie un prompt de développement de personnage\n' +
						'• `/roll` : Lance des dés\n' +
						'• `/vote` : Lance un vote avec options personnalisées\n' +
						'• `/help` : Affiche une aide pour les membres standards',
			admin:	'**Commandes administrateur :**\n' +
						'• `/add` : Ajoute un nouveau prompt\n' +
						'• `/modify` : Modifie un prompt existant\n' +
						'• `/list` : Affiche la liste paginée des prompts\n' +
						'• `/setup` : Configure le bot pour ce serveur\n' +
						'• `/close` : Ferme le channel actuel\n' +
						'• `/help` : Affiche une aide pour les commandes admin\n\n' +
					'**Commandes utilisateur :**\n' +
						'• `/inspire` : Envoie un prompt de développement de personnage\n' +
						'• `/roll` : Lance des dés\n' +
						'• `/vote` : Lance un vote avec options personnalisées\n' +
						'• `/help` : Affiche ce message d\'aide'
		},
	},	en: {
		// /inspire command
		inspire: {
			description: 'Sends a character development prompt',
			options: {
				index: 'Index of specific prompt to send (optional)'
			},
			messages: {
				invalid_index: 'The given index is incorrect.',
				no_prompts: 'No prompts available.',
				error_loading: 'Error loading prompts.'
			}
		},
		
		// /add command
		add: {
			description: 'Adds a new prompt to the system',
			options: {
				tag: 'Type of prompt to add',
				prompt: 'The prompt text to add'
			},
			messages: {
				guildOnly: 'This command can only be used within a server.',
				processing: 'Yes master, I\'m recording your request',
				success: (prompt) => `**Great! I successfully added** "${prompt}"`,
				error: 'Error adding prompt.',
				invalid_input: 'Error: Invalid options provided'
			}
		},
		
		// /modify command
		modify: {
			description: 'Modifies an existing prompt',
			options: {
				index: 'Index of the prompt to modify',
				new_prompt: 'New prompt text'
			},
			messages: {
				waiting: 'Yes master, I\'m recording your request',
				success: '**Great! I successfully modified** "{prompt}"',
		// /help command
		help: {
			description: 'Displays help for standard members',
			user:	'**User commands:**\n' +
						'• `/inspire`: Sends a character development prompt\n' +
						'• `/roll`: Rolls dice\n' +
						'• `/vote`: Starts a vote with custom options\n' +
						'• `/help`: Displays help for standard members',
			admin:	'**Admin commands:**\n' +
						'• `/add`: Adds a new prompt\n' +
						'• `/modify`: Modifies an existing prompt\n' +
						'• `/list`: Displays paginated list of prompts\n' +
						'• `/setup`: Configures the bot for this server\n' +
						'• `/close`: Closes the current channel\n' +
						'• `/help`: Displays help for admin commands\n\n' +
					'**User commands:**\n' +
						'• `/inspire`: Sends a character development prompt\n' +
						'• `/roll`: Rolls dice\n' +
						'• `/vote`: Starts a vote with custom options\n' +
						'• `/help`: Displays help for standard members'
		},
				error: 'Error modifying prompt.',
				invalid_input: 'Error: Invalid options provided'
			}
		},
		
		// /list command
		list: {
			description: 'Displays paginated list of available prompts',
			options: {
				page: 'Page number to display (optional)'
			},
			messages: {
				title: 'Available prompts list',
				no_prompts: 'No prompts available.',
				page_info: 'Page {current} / {total}',
				total_prompts: 'Total: {count} prompts',
				invalid_page: 'Invalid page number.',
				navigation_hint: 'Use buttons to navigate between pages.'
			}
		},
		
		// /vote command
		vote: {
			description: 'Starts a vote with custom options',
			options: {
				question: 'Vote question',
				option1: 'First option',
				option2: 'Second option',
				option3: 'Third option (optional)',
				option4: 'Fourth option (optional)'
			},
			messages: {
				title: '📊 Vote: {question}',
				no_votes: 'No votes yet.',
				vote_cast: 'Your vote has been recorded!',
				already_voted: 'You have already voted!',
				results: 'Vote results',
				closed: 'This vote is closed.'
			}
		},
		
		// /roll command
		roll: {
			description: '🎲 Rolls dice',
			options: {
				dice: 'Number of dice to roll',
				faces: 'Number of faces per die'
			},
			messages: {
				result: '🎲 {dice}d{faces} : **{result}',
				individual_results: 'D{faces}: {results}',
				total: 'Total: **{total}**',
				invalid_dice: '❌ Invalid number of dice (1-20).',
				invalid_faces: '❌ Invalid number of faces (2-1000).',
			}
		},
		
		// /setup command
		setup: {
			description: 'Configure the bot for this server',
			already_exists: '⚠️ A setup channel already exists: {channel}. Use the `/close` command to close it before creating a new one.',
			creating: '🔧 Creating configuration channel in progress...',
			success: '✅ Setup channel created successfully: {channel}'
		},
		
		// /close command (admin)
		close: {
			description: 'Closes the current channel after confirmation',
			confirm: '⚠️ **Warning!** Do you really want to close the channel **{channel}**?\n\n*This action is irreversible and will permanently delete this channel.*',
			closing: '🗑️ Closing channel **{channel}** in progress...',
			cancelled: '✅ Channel closure cancelled.',
			timeout: '⏰ Confirmation timeout expired. Channel closure cancelled.',
			buttons: {
				confirm: '✅ Confirm',
				cancel: '❌ Cancel'
			}
		},
		
		// Generic error messages
		errors: {
			permission_denied: '🚫 You don\'t have the necessary permissions for this action.',
			command_failed: '💥 Command failed. Please try again.',
			invalid_input: '❌ Invalid parameters provided.',
			database_error: '🗄️ Database error.',
			unknown_error: '❓ An unknown error occurred.',
			maintenance: '🔧 Bot is under maintenance. Please try again later.',
			rate_limited: '⏰ You are using this command too frequently. Please wait.',
			guild_not_configured: '⚙️ This server is not configured. Use `/setup` first.'
		},
		
		// Generic success messages
		success: {
			action_completed: 'Action completed successfully!',
			data_saved: 'Data saved.',
			configuration_updated: 'Configuration updated.'
		}
	}
};

/**
 * Get command content according to language
 * @param {string} language - Language code (fr/en)
 * @param {string} command - Command name
 * @returns {Object} Object containing all command content
 */
function getCommandContent(language, command) {
	return command_content[language]?.[command] || command_content['fr'][command];
}

function msg_roll(lang, dices_num, faces, result) {
	const msg = get_cmd_msg(lang, 'roll', command_content[lang][command].messages['result']);
	msg = msg.replace(`${dices_num}`);
	msg = msg.replace(`${faces}`);
	msg = msg.replace(`${result}`);
	return msg;
}

function msg_list_header(lang, current, total, count) {
	// Returns embed fields for list pagination header
	const pageLabel = lang === 'fr' ? 'Page' : 'Page';
	const totalLabel = lang === 'fr' ? 'Total' : 'Total';
	const pageValue = lang === 'fr' ? `${current} sur ${total}` : `${current} / ${total}`;
	const totalValue = lang === 'fr' ? `${count} prompts` : `${count} prompts`;
	
	return [
		{ name: pageLabel, value: pageValue, inline: true },
		{ name: totalLabel, value: totalValue, inline: true },
		{ name: '\u200b', value: '\u200b', inline: true } // Empty field to balance the row
	];
}

/**
 * Apply blue color formatting to content with blue circle and styled text
 * @param {string} content - Content to color
 * @returns {string} Formatted content with blue circle and styling
 */
function blue(content) {
	return `🔵 \` ${content} \``;
}

/**
 * Apply green color formatting to content with green circle and styled text
 * @param {string} content - Content to color
 * @returns {string} Formatted content with green circle and styling
 */
function green(content) {
	return `🟢 \` ${content} \``;
}

/**
 * Apply orange/yellow color formatting to content with orange circle and styled text
 * @param {string} content - Content to color
 * @returns {string} Formatted content with orange circle and styling
 */
function orange(content) {
	return `🟠 \` ${content} \``;
}

/**
 * Apply red color formatting to content with red circle and styled text
 * @param {string} content - Content to color
 * @returns {string} Formatted content with red circle and styling
 */
function red(content) {
	return `🔴 \` ${content} \``;
}

/**
 * Replace placeholders in a message with provided values
 * @param {string} message - Message with {placeholder} format
 * @param {Object} replacements - Object with placeholder:value pairs
 * @returns {string} Message with placeholders replaced
 */
function replacePlaceholders(message, replacements) {
	let result = message;
	for (const [key, value] of Object.entries(replacements)) {
		result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
	}
	return result;
}

/**
 * Get a specific message from a command
 * @param {string} language - Language code (fr/en)
 * @param {string} command - Command name
 * @param {string} messageKey - Message key
 * @returns {string} Message text
 */
function get_cmd_msg(lang, command, messageKey) {
	return command_content[lang]?.[command]?.messages?.[messageKey] || 
		   command_content['en'][command]?.messages?.[messageKey];
}

/**
 * Get a generic error message
 * @param {string} language - Language code (fr/en)
 * @param {string} errorKey - Error key
 * @returns {string} Error message text
 */
function getErrorMessage(language, errorKey) {
	return command_content[language]?.errors?.[errorKey] || command_content['en'].errors[errorKey];
}

/**
 * Get a generic success message
 * @param {string} language - Language code (fr/en)
 * @param {string} successKey - Success key
 * @returns {string} Success message text
 */
function getSuccessMessage(language, successKey) {
	return command_content[language]?.success?.[successKey] || command_content['en'].success[successKey];
}

module.exports = {
	command_content,
	msg_roll,
	msg_list_header,
	blue,
	green,
	orange,
	red,
	getCommandContent,
	get_cmd_msg,
	getErrorMessage,
	getSuccessMessage,
	replacePlaceholders
};