const fs = require("node:fs");
const path = require("node:path");

function load_UsersData(type, guildId) {
  // Guild' file for character's data
  const usersData = path.join(__dirname, `${type}_${guildId}.json`); // will create the file if does not exist

  if (fs.existsSync(usersData)) {
	// Check if guild's file exist
	const rawData = fs.readFileSync(usersData);
	return JSON.parse(rawData); // if yes return the guild's file
  } else {
	// return empty object if file is new
	return {};
  }
}

function copyInitialPrompts(adress, guildId) {
	const initialPromptsFilePath = path.join(__dirname, "prompts.json");
	const guildPromptsFilePath = path.join(__dirname, `${adress}${guildId}.json`);

// Copier le fichier prompts.json vers prompts_guildId.json
	if (fs.existsSync(initialPromptsFilePath)) {
		fs.copyFileSync(initialPromptsFilePath, guildPromptsFilePath);
		console.log(`Fichier copié : prompts_${guildId}.json`);
	} else
		console.error(`Le fichier initial prompts.json est introuvable.`);
}

function save_Data(adress, name, data) {
  const users_Data = path.join(__dirname, `${adress}_${name}.json`);
  // Save new data in the right guild file
  fs.writeFileSync(users_Data, JSON.stringify(data, null, 2));
  console.log(`Fichier créé : ${adress}_${name}.json`);
}

module.exports = {
	save_Data,
	copyInitialPrompts,
	load_UsersData
}