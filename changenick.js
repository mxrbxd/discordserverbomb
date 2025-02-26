const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const fs = require('fs');

// JSON dosyasını yükle
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`${client.user.tag} aktif!`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() === config.bots[1].COMMAND) {
        const guild = message.guild;
        if (!guild) return;

        const guildName = guild.name; 

        try {
            const members = await guild.members.fetch();
            members.forEach(async (member) => {
                if (member.user.bot) return; 

                try {
                    await member.setNickname(config.bots[1].TARGET_NICKNAME);
                    logChange(member, guildName);
                } catch (error) {
                    console.error(`${member.user.tag} için isim değiştirilemedi:`, error);
                }
            });
        } catch (error) {
            console.error(`${guild.name} üyeleri alınırken hata oluştu:`, error);
        }
    }
});

async function logChange(member, guildName) {
    try {
        await axios.post(config.bots[1].WEBHOOK_URL, {
            content: `🔄 **${guildName}** sunucusunda **${member.user.tag}** kullanıcısının ismi "${config.bots[1].TARGET_NICKNAME}" olarak değiştirildi!`
        });
    } catch (error) {
        console.error("Webhook mesajı gönderilirken hata oluştu:", error);
    }
}

client.login(config.bots[1].TOKEN);
