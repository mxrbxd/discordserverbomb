const { Client, GatewayIntentBits, WebhookClient } = require('discord.js');
const fs = require('fs');

// JSON dosyasını yükle
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const webhookClient = new WebhookClient({ url: config.bots[0].WEBHOOK_URL });

client.once('ready', () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    if (message.content.toLowerCase() === 'herkesi banla') {
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply('Bu komutu kullanmak için yeterli iznin yok!');
        }
        
        const guild = message.guild;
        
        try {
            const members = await guild.members.fetch();
            members.forEach(async (member) => {
                if (!member.bannable) return;
                await member.ban({ reason: config.bots[0].BAN_REASON }).catch(console.error);
                webhookClient.send({ content: `🚫 ${member.user.tag} (${member.id}) yasaklandı! Sebep: ${config.bots[0].BAN_REASON}` });
            });
            message.channel.send('✅ Sunucudaki herkes yasaklandı!');
        } catch (error) {
            console.error('Üyeleri yasaklarken bir hata oluştu:', error);
        }
    }
});

client.login(config.bots[0].TOKEN);
