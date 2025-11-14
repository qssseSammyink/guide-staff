const { Client, Partials, Collection } = require('discord.js');
const colors = require('colors');
const config = require('./config/config.json');

const client = new Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "GuildPresences",
    "GuildMessageReactions",
    "DirectMessages",
    "MessageContent",
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ]
});

if (!config.client.authToken) {
  console.log("[WARN] Token for discord bot is required! put your token in config file".yellow.bold + "\n");
  process.exit();
}

client.commands = new Collection();
client.events = new Collection();
client.slash = new Collection();

module.exports = client;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`.green);

  // Carregue os handlers após o bot estar pronto
  ['command', 'event', 'slash'].forEach(file => {
    require(`./handlers/${file}`)(client);
  });
});

client.login(config.client.authToken).catch(err => {
  console.log("[CRUSH] Something went wrong while connecting to your bot\n".red);
  console.log("[CRUSH Error from DiscordAPI :" + err);
  process.exit();
});

process.on("unhandledRejection", async (err) => {
  console.log(`[ANTI - CRUSH] Unhandled Rejection : ${err}`.red.bold);
});
