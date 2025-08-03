const fs = require('node:fs');
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ActionRowBuilder } = require('@discordjs/builders');

// Load prompts from JSON file
const jsonprompt = JSON.parse(fs.readFileSync('prompts_fr.json', 'utf-8'));

try {
    console.log('Prompts loaded successfully:');
} catch (error) {
    console.error('Error loading prompts:', error);
    return;
}

// Command definition
module.exports = {
    data: new SlashCommandBuilder()
        .setName('liste')
        .setDescription('Affiche la liste des prompts'),

    async execute(interaction) {
        await liste(interaction, 0);
    }
};

// Function to handle listing and pagination
async function liste(interaction, startIndex = 0) {
    try {
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
