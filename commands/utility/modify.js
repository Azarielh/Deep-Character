const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
// Read content of Json
const Rdata = fs.readFileSync('prompts.json');
// Convert json to js object
const jsonprompt = JSON.parse(Rdata);


function change_it(Pnum, dpprompt){
	// Modify the JavaScript object by changing new data
			jsonprompt.push({
			num: Pnum,
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
	//Affiche le contenu du fichier avec le nouveau prompt dans la console.
			  //console.log("After Adding data",JSON.stringify(updated_jsonprompt, null, 4));
				
}
	//Créer la commande
module.exports = {
	data: new SlashCommandBuilder()
		.setName('mod')
		.setDescription('Modifier un prompt')
	//Ajouter une option requise
		.addStringOption(option =>
			option.setName('index')
				.setDescription('numéro du prompt à modifier')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('écris le prompt à ajouter')
				.setRequired(true)),

	async execute(interaction) {
		// Get input from user
		let Pnum = interaction.option.getString('index');
		let dpprompt = interaction.options.getString('prompt');
		// Faire patienter l'user
		await interaction.reply("Oui maître, j"+"'"+"enregistre votre demande");
		//Ajouter le nouveau prompt au json
		try{
			change_it(Pnum, dpprompt);
		} 
		catch (error) {
			console.error(error);
		}
		await wait(1_000);
		// Notify the user
		await interaction.editReply("**Super ! J'ai bien modifié** " +'"__'+ dpprompt + '__"');
	}
};