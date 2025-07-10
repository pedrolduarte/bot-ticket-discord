const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require('discord.js');

module.exports = {

    name: 'createticket',
    description: 'Cria a embed de criar tickets..',

    execute: async function(message)  {

        if (message.author.bot) return;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const sendMessage = await message.reply('🤷 Você não tem permissão para isso.');
            setTimeout(() => {
                sendMessage.delete().catch(err => console.error('Erro ao deletar a mensagem: ', err));
            }, 3000);
            return;
        }
        
        const embed = new EmbedBuilder()
            .setColor('#F54E4E')
            .setTitle('📩 Sistema de Tickets')
            .setDescription('Clique no botão abaixo para abrir um ticket.\nUm canal privado será criado para você.')
            .setFooter({ text: 'Atendimento rápido e eficiente 💬' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('abrir_ticket')
                .setLabel('🎟️ Abrir Ticket')
                .setStyle(ButtonStyle.Primary)
        );
        
        await message.channel.send({ embeds: [embed], components: [row] });

    }

};