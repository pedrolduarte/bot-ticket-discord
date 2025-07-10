// Evento disparado já vinculado a quaisquer eventos que userm ! como prefixo
module.exports = {
    name: 'messageCreate',
    once: false,
    execute: async function(message) {

        if (message.author.bot) return;

        const prefix = '!';
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = message.client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (err) {
            console.error(`❌ Erro ao executar o comando ${commandName}:`, err);
            message.reply('❌ Erro ao executar esse comando.');
        }

    }
};