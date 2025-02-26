const { Client, GatewayIntentBits, PermissionFlagsBits } = require("discord.js");
const fs = require('fs');

// JSON dosyasını yükle
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`${client.user.tag} aktif!`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() === config.bots[3].COMMAND) {
        if (!message.guild) return;
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return;
        }

        const channel = message.channel;

        try {
            let messages = await channel.messages.fetch({ limit: 100 });
            while (messages.size > 0) {
                await channel.bulkDelete(messages, true);
                messages = await channel.messages.fetch({ limit: 100 });
            }
        } catch (error) {
            console.error("Mesajları silerken hata oluştu:", error);
        }
    }
});

client.login(config.bots[3].TOKEN);
