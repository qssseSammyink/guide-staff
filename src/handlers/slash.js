const client = require('../index');
const config = require('../config/config.json');
const { PermissionsBitField, REST, Routes } = require('discord.js');
const fs = require('fs');
const colors = require('colors');

module.exports = (client) => {
  console.log("----------------------------------------------".yellow);

  const slash = [];

  const dirs = fs.readdirSync('./src/slashCommands/');
  for (const dir of dirs) {
    const commands = fs.readdirSync(`./src/slashCommands/${dir}`).filter(file => file.endsWith('.js'));

    for (const file of commands) {
      let pull = require(`../slashCommands/${dir}/${file}`); // corrigido aqui

      if (pull.name) {
        client.slash.set(pull.name, pull);
        console.log(`[HANDLER - SLASH] Loaded a file : ${pull.name}`.green);

        slash.push({
          name: pull.name,
          description: pull.description,
          type: pull.type,
          options: pull.options ? pull.options : null,
          defaultPermission: pull.defaultPermission ? pull.defaultPermission : null,
          defaultUserPermissions: pull.defaultUserPermissions ? PermissionsBitField.resolve(pull.defaultUserPermissions).toString() : null
        });
      } else {
        console.log(`[HANDLER - SLASH] Couldn't load the file ${file}, missing module name value.`.red);
        continue;
      }
    }
  }

  if (!config.client.clientID) {
    console.log("[CRUSH] You have to provide your client ID in config file".red + "\n");
    return process.exit();
  }

  const rest = new REST({ version: '10' }).setToken(config.client.authToken);

  (async () => {
    try {
      if (config.handler.guildID) {
        await rest.put(
          Routes.applicationGuildCommands(config.client.clientID, config.handler.guildID),
          { body: slash }
        );

        const GUILD = await client.guilds.resolve(config.handler.guildID);

        console.log("----------------------------------------------".magenta);
        console.log(`[HANDLER - SLASH] Slash commands have been registered successfully to the guild: ${GUILD || "ERR : GUILD_NOT_FOUND"}`.magenta.bold + "\n");
        console.log("----------------------------------------------".yellow);
      } else {
        await rest.put(
          Routes.applicationCommands(config.client.clientID),
          { body: slash }
        );
        console.log("----------------------------------------------".magenta);
        console.log(`[HANDLER - SLASH] Slash commands have been registered successfully to all guilds`.magenta.bold);
        console.log("----------------------------------------------".yellow);
      }
    } catch (err) {
      console.log(err);
    }
  })();
};
