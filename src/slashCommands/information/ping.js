const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Ping bot',
    run: async (client, interaction, args) => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🏓 ${client.ws.ping}ms!`)
                    .setColor('Green')
            ],
            ephemeral: true
        });
    }
};
