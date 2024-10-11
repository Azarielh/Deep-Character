const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
// Read content of Json
const Rdata = fs.readFileSync('prompts.json');
// Convert json to js object
const jsonprompt = JSON.parse(Rdata);


function addit(dpprompt){
	// Modify the JavaScript object by adding new data
			jsonprompt.push({
			num: jsonprompt.length +1,
			Pprompt: dpprompt,
		});
	// Convert the JavaScript object back into a JSON string
			const jsonString = JSON.stringify(jsonprompt);
			fs.writeFileSync('prompts.json', jsonString, 'utf-8', (err) => {
				if (err) throw err;
				console.log('Rdata');
			  });
			  const update_data = fs.readFileSync('prompts.json');
			  const updated_jsonprompt = JSON.parse(update_data);				
}
	//Créer la commande
module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Ajouter un prompt')
	//Ajouter une option requise
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('écris le prompt à ajouter')
				.setRequired(true)),
	async execute(interaction) {
		// Get input from user
		let dpprompt = interaction.options.getString('prompt');
		// Faire patienter l'user
		await interaction.reply("Oui maître, j"+"'"+"enregistre votre demande");
		//Ajouter le nouveau prompt au json
		addit(dpprompt);
		await wait(1_000);
		// Notify the user
		await interaction.editReply("**Super ! J'ai bien ajouté** " +'"__'+ dpprompt + '__"');
	}
};