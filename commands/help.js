const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "Mostra uma lista de comandos.",
  async execute(message, args) {

    const renderMsg = new Discord.MessageEmbed()
      .setColor("#e68612")
      .setTitle(`📜 Lista de comandos:`)
      .setDescription(`Todos os comandos utilizam o prefixo **!**`)
      .addFields(
        {
          name: "\u200b",
          value: `🆕 **!newgame** - Cria um novo personagem.`
        },
        {
          name: "\u200b",
          value: `🧙‍♂️ **!char** - Mostra a ficha do seu personagem.`
        },
        {
          name: "\u200b",
          value: `🎒 **!inv** - Mostra os items de sua mochila.`
        },
        {
          name: "\u200b",
          value: `🛒**!mkt** - Mostra os itens do mercado para compra.`
        },
        {
          name: "\u200b",
          value: `💸 **!buy itemX** - Compra o itemX da lista do mercado.`
        },
        {
          name: "\u200b",
          value: `📜 **!new list** - Cria uma nova lista de itens no mercado.`
        },
        {
          name: "\u200b",
          value: `📜🔼 **!new list plus** - Cria uma nova lista de itens de nível superior no mercado, O preço pode variar.`
        },
        {
          name: "\u200b",
          value: `💰 **!sell slotX** - Vende o item do slotX da sua mochila.`
        },
        {
          name: "\u200b",
          value: `🔎 **!show slotX** - Mostra os atributos do item no slotX.`
        },
        {
          name: "\u200b",
          value: `⚔ **!equip slotX** - Equipa o item do slotX automaticamente no local correto, o item retirado é colocado no slot do item equipado.`
        },
        {
          name: "\u200b",
          value: `🔽 **!drop slotX** - Joga fora o item do slotX.`
        },
        {
          name: "\u200b",
          value: `🖐 **!take** - Guarda na mochila o item segurado.`
        },
        {
          name: "\u200b",
          value: `🏃‍♂️ **!explore** - Entra nas criptas a procura de uma aventura.`
        },
        {
          name: "\u200b",
          value: `👹 **!enemy** - Mostra a ficha do inimigo que está em combate com você.`
        },
        {
          name: "\u200b",
          value: `⚔ **!atk** - Ataca o inimigo! Você ou ele irá vencer este combate.`
        },
        {
          name: "\u200b",
          value: `💨 **!run** - Foge do inimigo em combate com você.`
        },
        {
          name: "\u200b",
          value: `🧴 **!potion** - Utiliza uma das suas poções de cura para recuperar a vida.`
        },
        {
          name: "\u200b",
          value: `💀 **!dell** - Deleta seu personagem da base de dados.`
        },
      );

      message.channel.send(renderMsg).then((msg) => msg.delete({ timeout: 30000 }))
  },
};
