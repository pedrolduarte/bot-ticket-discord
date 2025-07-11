module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async function(interaction) {

        if (interaction.isButton()) {

            const button = interaction.client.buttons.get(interaction.customId);
            if (!button) return;

            try {
                await button.execute(interaction);
            } catch(err) {
                console.error(`❌ Erro ao executar o botão ${interaction.customId}:`, err);
            }

        }

    }
};