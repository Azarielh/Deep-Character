const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
// Convert json to js object
const { Client, Collection, Events, GatewayIntentBits, Message } = require('discord.js'); // import discord library relative to the bot needs

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });

function addit(dpprompt, guild){
	// Read content of Json
	const filepath = `./guilds/${guild.id}/_prompts_${guild.id}.json`;
	const Rdata = fs.readFileSync(filepath);
	const jsonprompt = JSON.parse(Rdata);

	// Modify the JavaScript object by adding new data 

			jsonprompt.push({
			num: jsonprompt.length +1,
			Pprompt: dpprompt,
		});
	// Convert the JavaScript object back into a JSON string
			const jsonString = JSON.stringify(jsonprompt);
			fs.writeFileSync('prompts.json', jsonString, 'utf-8', (err) => {
				if (err) throw err;
				console.log('Error while writing the new prompt');
			  });
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
		const dpprompt = interaction.options.getString('prompt');
		const guild = interaction.guild; // Get guild from interaction
		if (!guild) {
			await interaction.reply("This command can only be used within a server");
			return;
		}
		// Faire patienter l'user
		await interaction.reply("Oui maître, j"+"'"+"enregistre votre demande");
		//Ajouter le nouveau prompt au json
		addit(dpprompt, guild);
		await wait(1_000);
		// Notify the user
		await interaction.editReply("**Super ! J'ai bien ajouté** " +'"__'+ dpprompt + '__"');
	}
};