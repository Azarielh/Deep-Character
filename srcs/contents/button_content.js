/**
 * Reusable buttons, menus and interface components content
 * These elements can be used in multiple contexts
 */

const buttons_content = {
	fr: {
		generic: {
			continue: 'Continuer',
			cancel: 'Annuler',
			confirm: 'Confirmer',
			close: 'Fermer',
			save: 'Sauvegarder',
			delete: 'Supprimer',
			edit: 'Modifier',
			add: 'Ajouter',
			back: 'Retour',
			next: 'Suivant',
			previous: 'Précédent',
			finish: 'Terminer'
		},
		
		// Boutons de langue (réutilisables pour setup et autres)
		language: {
			french_label: 'Français',
			english_label: 'English',
			select_language: 'Choisir la langue'
		},
		
		setup: {
			close_setup_channel: 'Fermer ce salon',
			start_config: 'Commencer la configuration',
			skip_step: 'Passer cette étape'
		},
		
		menus: {
			channel_select_placeholder: 'Choisissez un salon...',
			no_category: 'Aucune catégorie',
			select_option: 'Sélectionnez une option...'
		},
		
		confirmation: {
			yes_confirm: 'Oui, confirmer',
			no_cancel: 'Non, annuler',
			delete_confirm: 'Oui, supprimer',
			delete_cancel: 'Non, conserver'
		}
	},
	
	en: {
		generic: {
			continue: 'Continue',
			cancel: 'Cancel',
			confirm: 'Confirm',
			close: 'Close',
			save: 'Save',
			delete: 'Delete',
			edit: 'Edit',
			add: 'Add',
			back: 'Back',
			next: 'Next',
			previous: 'Previous',
			finish: 'Finish'
		},
		
		language: {
			french_label: 'Français',
			english_label: 'English',
			select_language: 'Choose language'
		},
		
		setup: {
			close_setup_channel: 'Close this channel',
			start_config: 'Start configuration',
			skip_step: 'Skip this step'
		},
		
		menus: {
			channel_select_placeholder: 'Choose a channel...',
			no_category: 'No category',
			select_option: 'Select an option...'
		},
		
		confirmation: {
			yes_confirm: 'Yes, confirm',
			no_cancel: 'No, cancel',
			delete_confirm: 'Yes, delete',
			delete_cancel: 'No, keep'
		}
	}
};

/**
 * Get a msg depending of the params you write.
 * @param {string} language - Language code (fr/en)
 * @param {string} category - Button category (generic, language, setup, etc.)
 * @param {string} key - Specific button key
 * @returns {string} Button text
 */
function getButtonText(language, category, key) {
	return buttons_content[language]?.[category]?.[key] || buttons_content['en'][category][key];
}

/**
 * Get all buttons from a category for a language
 * @param {string} language - Language code (fr/en)
 * @param {string} category - Button category
 * @returns {Object} Object containing all buttons of the category
 */
function getButtonCategory(language, category) {
	return buttons_content[language]?.[category] || buttons_content['fr'][category];
}

module.exports = {
	buttons_content,
	getButtonText,
	getButtonCategory
};