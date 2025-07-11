# Bot de Ticket Discord.js 🎟️

Bot simples para abrir e fechar tickets via botões, criar canais privados e gerar logs em TXT.

## Funcionalidades

- Abrir ticket pelo botão `abrir_ticket`.
- Impede abrir mais de um ticket por usuário.
- Cria canal privado para o ticket.
- Envia embed com botão para fechar o ticket.
- Fechar ticket pelo botão `fechar_ticket`.
- Gera log TXT com todas as mensagens e anexos.
- Envia log para canal de logs configurado.
- Deleta o canal após fechar o ticket.
- Permissões: só dono do ticket ou admins podem fechar.

## Como usar

1. Configure o `.env` com:
```
TOKEN=seu_token
ID_LOGS_CHANNEL=id_do_canal_de_logs
```

2. Instale dependências:
```
npm install
```

3. Rode o bot:
```
node index.js
```

## Estrutura básica

- `/buttons/abrir_ticket.js` - abre ticket
- `/buttons/fechar_ticket.js` - fecha ticket e gera logs
- `/events/interactionCreate.js` - roteia interações dos botões
- `index.js` - inicializa o bot, carrega comandos, botões e eventos

---

Se quiser ajuda pra expandir ou organizar, me chama! 🚀
