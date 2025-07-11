const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

module.exports = {

    customId: 'abrir_ticket',
    description: 'Abre o ticket através do botão.',

    execute: async function(interaction)  {

        const myTicketChannel = interaction.guild.channels.cache.find(c =>
            c.name === `ticket-${interaction.user.id}`  
        );
    
        if (myTicketChannel){
            return await interaction.reply({ content: '❗ Você já tem um ticket aberto.', ephemeral: true });
        }
    
        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.id}`,
            type: 0,
            permissionOverwrites: [
                {
                    id: interaction.guild.id, // Servidor todo
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id, // Usuario do botão
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory
                    ]
                },
                {
                    id: interaction.client.user.id, // BOT
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageChannels]
                }
            ],
            reason: `Ticket criado por ${interaction.user.tag}`
        });
    
        const embed = new EmbedBuilder()
            .setColor('#F54E4E')
            .setTitle('🎟️ Ticket Criado!')
            .setDescription(`Olá, <@${interaction.user.id}>! Seu ticket foi criado com sucesso.\n\nEstamos prontos para ajudar você da melhor forma possível. Fique à vontade para descrever seu problema ou dúvida aqui.`)
            .setFooter({ text: 'Equipe de Suporte • Estamos aqui para você!' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('fechar_ticket')
                .setLabel('🎟️ Fechar Ticket')
                .setStyle(ButtonStyle.Primary)
        );
    
        await ticketChannel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: `🎟️ Ticket criado com sucesso: ${ticketChannel}`, ephemeral: true });
        
        const mencion = await ticketChannel.send(`<@${interaction.user.id}>`);
        setTimeout(() => {
            mencion.delete().catch(err => console.error('Erro ao deletar a mensagem: ', err));
        }, 100);
    }

};