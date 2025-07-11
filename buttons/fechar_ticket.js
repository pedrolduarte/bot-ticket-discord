const { PermissionsBitField, AttachmentBuilder } = require('discord.js');
const fs =  require('fs');
const path = require('path');

module.exports = {

    customId: 'fechar_ticket',
    description: 'Fecha o ticket através do botão.',

    execute: async function(interaction)  {

        const member = interaction.member;
        const channel = interaction.channel;
        const channelName = channel.name;

        if (!channelName.includes(member.id) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const sendMessage = await interaction.reply({ content: '🤷 Você não tem permissão para isso.', ephemeral: true });
            setTimeout(() => {
                interaction.deleteReply().catch(err => console.error('Erro ao deletar a mensagem: ', err));
            }, 3000);
            return;
        }

        const messages = await getAllMessages(channel);
        const filePath = await createTicketRegister(messages, channel.name);

        const logsChannel = interaction.guild.channels.cache.get(process.env.ID_LOGS_CHANNEL);
        if (logsChannel) {
            await logsChannel.send(
                {
                    content: `🗂️ Log do ticket fechado: ${channel.name}`,
                    files: [new AttachmentBuilder(filePath)]
                }
            );
        }

        const ticketOwnerID = channelName.replace('ticket-', '');
        const ticketOwner = await interaction.client.users.fetch(ticketOwnerID);
        if (ticketOwner) {

            await ticketOwner.send(
                {
                    content: `🗂️ Log do ticket fechado: ${channel.name}`,
                    files: [new AttachmentBuilder(filePath)]
                }
            );

        }

        await channel.delete(`Ticket fechado por ${interaction.user.tag}`);

         fs.unlink(filePath, err => {
            if (err) console.error('Erro ao deletar log:', err);
        });
        
    }

};

async function getAllMessages(channel) {

    const messages = [];
    let lastID = null;
    while (true) {

        const options = { limit:100 };
        if (lastID) {
            options.before = lastID;
        }

        const fetched = await channel.messages.fetch(options);
        if (fetched.size == 0) {
            break;
        }

        messages.push(...fetched.values());
        lastID = fetched.last().id;

        if (fetched.size < 100) {
            break;
        }

    }

    return messages.reverse(); 

}

function formatMessage(message) {

    const date = message.createdAt.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    let line = `[${date}] ${message.author.tag}: ${message.content}`;

    if (message.attachments.size > 0) {
        const attachments = message.attachments.map(archive => archive.url).join(', ');
        line += ` [ANEXOS: ${attachments}]`;
    }

    return line;

}

async function createTicketRegister(messages, ticketName) {

    const lines = messages.map(formatMessage);
    const text = lines.join('\n');
    const filePath = path.join(__dirname, `${ticketName}.txt`);

    await fs.promises.writeFile(filePath, text, 'utf-8');
    return filePath;

}