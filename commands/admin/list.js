const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ActionRowBuilder } = require('@discordjs/builders');

// Command definition
module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Affiche la liste des prompts'),

    async execute(interaction) {
        await list(interaction, 0);
    }
};

// Function to handle listing and pagination
async function list(interaction, startIndex = 0) {
    try {
        // Load prompts dynamically for the guild
        const filepath = path.join(process.cwd(), `./guilds/${interaction.guild.id}/_prompts_${interaction.guild.id}.json`);
        const jsonprompt = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
        
        if (startIndex < 0) startIndex = 0;  
        if (startIndex >= jsonprompt.length) startIndex = jsonprompt.length - 10;

        const ActualPrompts = jsonprompt.slice(startIndex, startIndex + 10); // Extrait une suite de 10 prompts
        const totalPrompts = jsonprompt.length; // longueur de la liste sur prompt.json

        const embedDescription = ActualPrompts.map(prompt => `${prompt.num}. ${prompt.Pprompt}`).join('\n'); // Affiche

        const precedent = new ButtonBuilder()
            .setCustomId('precedent')
            .setLabel('Precedent')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(startIndex - 10 <= 0);

        const suivant = new ButtonBuilder()
            .setCustomId('suivant')
            .setLabel('Suivant')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(startIndex + 10 >= totalPrompts);

        const row = new ActionRowBuilder().addComponents(precedent, suivant);

        if (interaction.isCommand()) {
            await interaction.reply({
                content: embedDescription,
                components: [row]
            });
        }

        const filter = i => i.customId === 'precedent' || i.customId === 'suivant';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 500000 });

        collector.on('collect', async i => {
            // Reload prompts for updated data
            const filepath = path.join(process.cwd(), `./guilds/${interaction.guild.id}/_prompts_${interaction.guild.id}.json`);
            const jsonprompt = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
            const totalPrompts = jsonprompt.length;
            
            if (i.customId === 'precedent') {
                startIndex -= 10;
            } else if (i.customId === 'suivant') {
                startIndex += 10;
            }  
            if (startIndex < 0) startIndex = 0;
            if (startIndex > totalPrompts) startIndex = totalPrompts; 
            if (startIndex >= jsonprompt.length) startIndex = jsonprompt.length - 10;
    
            const ActualPrompts = jsonprompt.slice(startIndex, startIndex + 10);
    
            const embedDescription = ActualPrompts.map(prompt => `${prompt.num}. ${prompt.Pprompt}`).join('\n');
            await i.deferUpdate();
            const precedent = new ButtonBuilder()
            .setCustomId('precedent')
            .setLabel('Precedent')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(startIndex === 0);

        const suivant = new ButtonBuilder()
            .setCustomId('suivant')
            .setLabel('Suivant')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(startIndex + 10 >= totalPrompts);

        const row = new ActionRowBuilder().addComponents(precedent, suivant);

            await i.editReply({
                    content: embedDescription,
                    components: [row]
                });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ components: [] });
            }
        });
    } catch (error) {
        console.error('Error during pagination:', error);
        if (!interaction.replied) {
            await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
        } else {
            await interaction.followUp({ content: 'Une erreur est survenue.', ephemeral: true });
        }
    }
}
