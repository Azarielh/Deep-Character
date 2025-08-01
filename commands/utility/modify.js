const fs = require("node:fs");
const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const prompt_manager = require('../../srcs/prompt_manager.js')

//Créer la commande
module.exports = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Modifier un prompt")
    //Ajouter une option requise
    .addStringOption((option) =>
      option
        .setName("index")
        .setDescription("numéro du prompt à modifier")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("écris le prompt à ajouter")
        .setRequired(true)
    ),

  async execute(interaction) {
    // Get input from user
    let Pnum = parseInt(interaction.options.getString("index"));
    let dpprompt = interaction.options.getString("prompt");
    const guild = interaction.guild;

    console.log("Pnum : ", Pnum, "dpprompt : ", dpprompt);
    // Faire patienter l'user
    await interaction.reply("Oui maître, j" + "'" + "enregistre votre demande");
    await wait(2000);
    if (!Pnum || !dpprompt) {
      await interaction.editReply(
        "Erreur : Les options fournies sont invalides"
      );
      return;
    }
    //Ajouter le nouveau prompt au json
    try {
      change_it(Pnum, dpprompt, guild);
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "Une erreur est survenue lors de la modification du prompt"
      );
      return;
    }
    await wait(1_000);
    // Notify the user
    await interaction.editReply(
      "**Super ! J'ai bien modifié** " + '"__' + dpprompt + '__"'
    );
  },
};
