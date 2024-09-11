const fs = require('node:fs');
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ActionRowBuilder } = require('@discordjs/builders');
const Rdata = fs.readFileSync('prompts.json');
const jsonprompt = JSON.parse(Rdata);
const wait = require('node:timers/promises').setTimeout;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Envoie la liste des liens de vote aux joueurs'),
 	async execute(interaction) {
		await interaction.reply({
 			content:'**Joueurs ! Joueuses ! __Les maîtres de jeux__** ont besoin de **__vos votes__** ! ', 
 			components:[
 				new ActionRowBuilder().setComponents(
 					new ButtonBuilder()
 						.setLabel('Top-Site 1')
 						.setStyle(ButtonStyle.Link)
    					.setURL('http://www.root-top.com/topsite/serpentgy/in.php?ID=12432'),
					new ButtonBuilder()
 						.setLabel('Top-Site 2')
 						.setStyle(ButtonStyle.Link)
                        .setURL('http://www.root-top.com/topsite/virtu4lgames/in.php?ID=6783'),
                     new ButtonBuilder()
 						.setLabel('Top-Site 3')
 						.setStyle(ButtonStyle.Link)
                        .setURL('http://www.root-top.com/topsite/justmarried/in.php?ID=1161')
				)
			]
		})

		wait(1000);
		interaction.followUp({
 			content:'Et trois de plus pour notre plus grand plaisir ! ', 
 			components:[
 				new ActionRowBuilder().setComponents(
					new ButtonBuilder()
							.setLabel('Top-Site 4')
							.setStyle(ButtonStyle.Link)
							.setURL('http://www.root-top.com/topsite/melu/in.php?ID=5221'),
						new ButtonBuilder()
							.setLabel('Top-Site 5')
							.setStyle(ButtonStyle.Link)
							.setURL('http://www.root-top.com/topsite/virtu4ldreaiviz/in.php?ID=5794'),
						new ButtonBuilder()
							.setLabel('Top-Site 6')
							.setStyle(ButtonStyle.Link)
							.setURL('http://www.root-top.com/topsite/virtu4lschool/in.php?ID=3110')
				)
			]	
		})
		
	}
}