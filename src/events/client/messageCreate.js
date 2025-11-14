const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const client = require('../../index');
const config = require('../../config/config.json');

module.exports = {
  name: "messageCreate"
};

client.on('messageCreate', async message => {
  const prefix = config.global.prefix;

  if (message.channel.type !== 0) return; 
  if (message.author.bot) return; 
  if (!message.content.startsWith(prefix)) return; 
  if (!message.guild) return;
  if (!message.member) message.member = await message.guild.members.fetch(message.author);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (!cmd) return;

  let command = client.commands.get(cmd);
  if (!command) return message.reply(`💢 **[${message.member.displayName}]** Invalid command`);

  if (command.userPermissions) {
    const userPerms = PermissionsBitField.resolve(command.userPermissions);
    if (!message.member.permissions.has(userPerms)) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`💢 **[${message.member.displayName}]** You don't have permission to use this command\n\`\`\`${command.userPermissions.join(", ")}\n\`\`\``)
          .setColor('Red')]
      });
    }
  }

  const botMember = message.guild.members.cache.get(client.user.id);
  if (command.botPermissions) {
    const botPerms = PermissionsBitField.resolve(command.botPermissions);
    if (!botMember.permissions.has(botPerms)) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`💢 **[${message.member.displayName}]** I don't have permission to run this command\n\`\`\`${command.botPermissions.join(", ")}\n\`\`\``)
          .setColor('Red')]
      });
    }
  }

  if (command.owner === true) {
    if (!config.developers.owner) return;

    const allowedUsers = config.developers.owner.map(id => {
      const member = message.guild.members.cache.get(id);
      return member ? member.user.tag : `**[Unknown#0000]**`;
    });

    if (!config.developers.owner.includes(message.member.id)) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`💢 **[${message.member.displayName}]** Only owners can use this command!\n\`\`\`${allowedUsers.join(", ")}\n\`\`\``)
          .setColor('Red')]
      });
    }
  }

  try {
    await command.run(client, message, args);
  } catch (err) {
    console.error(err);
    message.reply("An error occurred while executing the command.");
  }
});
