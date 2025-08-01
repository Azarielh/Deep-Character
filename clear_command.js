const { REST, Routes } = require('discord.js');
const { clientId, token, guildId } = require('./config.json');

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log('Suppression de toutes les commandes...');
        
        // Supprimer les commandes globales
        await rest.put(Routes.applicationCommands(clientId), { body: [] });
        console.log('✅ Commandes globales supprimées');
        
        // Supprimer les commandes de guild (si vous en aviez)
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
        console.log('✅ Commandes de guild supprimées');
        
    } catch (error) {
        console.error(error);
    }
})();