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
      'Questionne son personnage ou le met dans une situation particuliere'
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
			await interaction.reply(jsonprompt[parseInt(Pnumber)-1].Pprompt);
		} else {
			await interaction.reply(randomPrompt().Pprompt);
	
		}
	} catch(e){
		await interaction.reply("L'index donné est incorrect")
	}
 
  },
};
