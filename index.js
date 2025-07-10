require('dotenv').config();

const fs = require('fs');
const { Client, GatewayIntentBits, Collection} = require('discord.js');
const client = new Client({ 
  intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent
  ] 
});

// Carrega todos os comandos da pasta /commands
client.commands = new Collection();

const prefixCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of prefixCommandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Carrega os comandos vinculados a botões da pasta /buttons
client.buttons = new Collection();

const buttonCommandFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
for (const file of buttonCommandFiles) {
  const button = require(`./buttons/${file}`);
  client.buttons.set(button.customId, button);
}

// Carrega os eventos da pasta /events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


client.login(process.env.TOKEN);