const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const Axios = require('axios');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  registerCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'sendmsg') {
    const message = interaction.options.getString('message');
    const api = interaction.options.getString('api');
    const subscription = interaction.options.getString('subscription');
    const universe = interaction.options.getString('universe');

    await interaction.reply("Message Sent!. If your code did not run, make sure all the data is correct and your code is working.");
    messageSend(message, api, subscription, universe);
  }
});

async function registerCommands() {
  await client.application?.commands.create({
    name: 'sendmsg',
    description: 'Send an announcement to all servers',
    options: [
      {
        name: 'message',
        description: 'The message you want to send',
        type: 'STRING',
        required: true,
      },
      {
        name: 'api',
        description: 'Your API key',
        type: 'STRING',
        required: true,
      },
      {
        name: 'subscription',
        description: 'The subscription ID',
        type: 'STRING',
        required: true,
      },
      {
        name: 'universe',
        description: 'The universe ID',
        type: 'STRING',
        required: true,
      },
    ],
  });

  console.log('Commands registered!');
}

const messageSend = async (message, api, subscription, universe) => {
  Axios.post(`https://apis.roblox.com/messaging-service/v1/universes/${universe}/topics/${subscription}`, {
    'message': message
  }, {
    headers: {
      'x-api-key': api,
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    console.log(response.data);
  }).catch((err) => {
    console.log(err.response.data);
  });
}

client.login('Token');
