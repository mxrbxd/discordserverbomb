// 

const { Client, GatewayIntentBits, WebhookClient, PermissionFlagsBits } = require('discord.js');
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

const webhookClient = new WebhookClient({ url: config.bots[2].WEBHOOK_URL });

client.once('ready', () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === 'kanalları uçur') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('Bu komutu kullanmak için yeterli iznin yok!');
        }
        
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('Benim de **kanalları yönetme** iznim yok!');
        }

        const guild = message.guild;
        const guildName = guild.name; 

        try {
            const channels = await guild.channels.fetch();
            const excludedChannels = ['rules', 'moderator-only']; 

            for (const [id, channel] of channels) {
                if (!excludedChannels.includes(channel.name)) {
                    await channel.delete();
                    webhookClient.send({ 
                        content: `🚨 **${guildName}** sunucusundaki **${channel.name}** kanalı silindi!`
                    });
                }
            }

            message.channel.send('İşlem Bitti!');
        } catch (error) {
            console.error('Kanalları silerken bir hata oluştu:', error);
        }
    }
});

client.login(config.bots[2].TOKEN);
