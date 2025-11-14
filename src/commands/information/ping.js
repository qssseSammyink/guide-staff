const { EmbedBuilder } = require('discord.js');

module.exports = {
    config : {
        name: "ping",
        description: "Ping bot"
    },
    userPermissions : ['SendMessages'],
    botPermissions : ['ViewChannel'],
    owner : true,
    run : async(client, messageLink, args) => {
        messageLink.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🏓 Pong! ${client.ws.ping}ms.`)
                    .setColor("Green")
            ]
        })
    }
}