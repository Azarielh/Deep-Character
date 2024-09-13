const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
// Read content of Json
const Rdata = fs.readFileSync('prompts.json');
// Convert json to js object
let jsonprompt = JSON.parse(Rdata);


function change_it(Pnum, dpprompt){
	// Chercher l'index correspondant au numéro	
	const index = Pnum - 1;

	// Check if function has been call
	console.log("Changeit function has been called with success with index :", index);

	if (index >= 0 && index < jsonprompt.length) 
		{
		// Modify the JavaScript object by changing new data
			jsonprompt[index].Pprompt = dpprompt;
			
			// Afficher le prompt modifié
			console.log("Nouveau prompt :", jsonprompt[index].Pprompt);

	// Convert the JavaScript object back into a JSON string
			const jsonString = JSON.stringify(jsonprompt);
			fs.writeFileSync('prompts.json', jsonString, 'utf-8', (err) => {
				if (err) throw err;
					console.log('Prompt modified with success');
			  });
		} else 
			console.log('Error while trying to modify the prompt');				
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
		let Pnum = parseInt(interaction.options.getString('index'));
		let dpprompt = interaction.options.getString('prompt');
		console.log("Pnum : ", Pnum, "dpprompt : ", dpprompt);
		// Faire patienter l'user
		await interaction.reply("Oui maître, j"+"'"+"enregistre votre demande");
		await wait(2000);
		if (!Pnum || !dpprompt)
		{
			await interaction.editReply("Erreur : Les options fournies sont invalides");
			return;
		}
		//Ajouter le nouveau prompt au json
		try
		{
			change_it(Pnum, dpprompt);
		} catch (error) {
			console.error(error);
			await interaction.editReply("Une erreur est survenue lors de la modification du prompt")
			return;
		}
		await wait(1_000);
		// Notify the user
		await interaction.editReply("**Super ! J'ai bien modifié** " +'"__'+ dpprompt + '__"');
	}
};