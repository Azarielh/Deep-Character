const fs = require("node:fs");
const { SlashCommandBuilder } = require("discord.js");
const Rdata = fs.readFileSync("prompts.json");
const jsonprompt = JSON.parse(Rdata);

function randomPrompt() {
  return jsonprompt[Math.floor(Math.random() * jsonprompt.length)];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inspire")
    .setDescription(
      'Questionne les joueurs sur leurs personnage ou le met dans une situation particuliere'
    )
    .addStringOption(option =>
      option.setName('index')
        .setDescription('numéro du prompt')
        .setRequired(false)
    ),

  async execute(interaction) {
    let Pnumber = interaction.options.getString("index");
	try {
		if (Pnumber) {
			await interaction.reply({content:".." + jsonprompt[parseInt(Pnumber)-1].Pprompt, fetchReply:true});
		} else {
			await interaction.reply({content:".." + randomPrompt().Pprompt, fetchReply:true});
	
		}
	} catch(e){
		await interaction.reply("L'index donné est incorrect")
	}
 
  },
};
