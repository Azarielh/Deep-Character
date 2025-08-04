const fs = require("node:fs");
const path = require("node:path");

/**
* @brief Don't need a thing from discord and do only basic files operations
*		 Must contain :	load_data(filePath)
*						save_data(filePath, data)
*						file_exists(filePath)
*						copy_file(src, dest)
*/

//TODO: Standardiser les noms de fichiers (underscore vs tirets)
//TODO: Ajouter une fonction pour charger la configuration d'une guilde
//TODO: Valider que les fichiers JSON sont bien formés avant de les lire
//TODO: Mettre en cache les données des guildes pour éviter les re-lectures
//TODO: Ajouter un système de logs avec niveaux (debug, info, warn, error)
//TODO: Valider les IDs de guildes avant de créer des dossiers
//TODO: Sanitiser les noms de fichiers pour éviter les injections de chemin
//TODO: Documenter le format des fichiers de configuration
//TODO: Ajouter des commentaires JSDoc pour toutes les fonctions publiques
/**
 * @brief Use guild.id to build the path  from ./guilds/ to guild.id requiered as an argument. Create the forlder if doesn't exist.
 * @param guildId 
 * @returns true  if the guildId's folder exist.
 *			false if it's doesn't.
 */
function build_guild_folder(guildId) {
	const guild_path = path.join(process.cwd(), `./guilds/${guildId}/`);
	if (fs.existsSync(guild_path)) return true;

	fs.mkdirSync(guild_path, { recursive: true });
	console.log(`Dossier créé : ${guildId}`);
	return false;
}

//FIXME: Doesn't seems to work. I need better testing in order to know when and why.
/**
 * @brief This is supposed to build back missing files from the array returned by the function 'file_set_exist'.
 *			Thought, this function seems broken right now and nedd check and fix.
 * @param guildId
 * @param missing
 */
function rebuild_guild_files(guildId, missing) {
	let i = 0;
	while (missing.length)
		load_data(guildId, missing[i++]);
}

/**
 * @brief This will check the existence of the three recquired file for a guild within it's dedicated folder. This fonction needs to be called only after making sure the guild folder exist in the right place.
 * @param guildId 
 * @returns 
 */
function file_set_exist(guildId) {
	const config_path = path.join(process.cwd(), `./guilds/${guildId}/_config_${guildId}.json`);
	const data_character_path = path.join(process.cwd(), `./guilds/${guildId}/_data_character_${guildId}.json`);
	const prompts_path = path.join(process.cwd(), `./guilds/${guildId}/_prompts_${guildId}.json`);

	if (fs.existsSync(config_path) && fs.existsSync(data_character_path) && fs.existsSync(prompts_path))
		return ;
	let missing = [];
	if (!fs.existsSync(config_path))
		missing.push('config');
	if (!fs.existsSync(data_character_path))
		missing.push('data_character');
	if (!fs.existsSync(prompts_path))
		missing.push('prompts');
	return missing;
}

/**
 * @brief Will load the given file
 * @param guildId
 * @param file_name must be a string composed of name
 */
function load_data(guildId, file_name) {
	const full_path = path.join(process.cwd(), `./guilds/${guildId}/_${file_name}_${guildId}.json`);
	
	if (fs.existsSync(full_path)) {
		const parsed_data = fs.readFileSync(full_path);
		return JSON.parse(parsed_data);
	} else {
		if (file_name == 'config') save_Data(file_name, guildId, {});
		if (file_name == 'data_character') save_Data(file_name, guildId, {});
		if (file_name == 'prompts') prompts_init(guildId);
		const parsed_data = fs.readFileSync(full_path);
		return JSON.parse(parsed_data);
	}
}

function prompts_init(guildId) {
	//TODO: Ajouter try-catch pour gérer les erreurs de copie de fichier
	const config_path = path.join(process.cwd(), `./guilds/${guildId}/_config_${guildId}.json`);
	const config = JSON.parse(fs.readFileSync(config_path));
	const lang = config.lang;
	const standard_prompts = path.join(process.cwd(), `./prompts_${lang}.json`);
	const guild_prompts = path.join(process.cwd(), `./guilds/${guildId}/_prompts_${guildId}.json`);
console.log(guild_prompts);
// Copy prompts_fr.json into guildId folder
	if (fs.existsSync(standard_prompts)) {
		try {
			fs.copyFileSync(standard_prompts, guild_prompts);
			console.log(`Prompt's file has been duplicate to : prompts_${guildId}.json`);
		} catch (error) {
			console.error('Error : There was an issue while attempting to copy prompt.json');
		}
	} else
		console.error(`I couldn't find the initial prompt's file`);
	return null;
}

async function save_Data(name, guildId, data) {
  //TODO: Ajouter try-catch pour gérer les erreurs d'écriture de fichier
  const users_Data = path.join(process.cwd(), `./guilds/${guildId}/_${name}_${guildId}.json`);
  // Save new data in the right guild file
  fs.writeFileSync(users_Data, JSON.stringify(data, null, 2));
  console.log(`Fichier créé dans : guilds/${guildId}/_${name}_${guildId}.json`);
}

module.exports = {
	build_guild_folder,
	rebuild_guild_files,
	file_set_exist,
	load_data,
	save_Data
}