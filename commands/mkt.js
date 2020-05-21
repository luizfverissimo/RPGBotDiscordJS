const Discord = require("discord.js");
const ItemList = require("../classes/ItemList");

module.exports = {
  name: "mkt",
  description: "Mostra os itens para compra",
  async execute(message, args) {
    const mongoose = require("mongoose");
    const CharDB = require("../models/CharDB.js");

    const uri = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@cluster0-v4wt0.gcp.mongodb.net/charDB?retryWrites=true&w=majority`;

    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        dbName: "charDB",
      })
      .then(() => {
        console.log("Database Connected - retrieve");
        //procura o cadastro na DB
        CharDB.findOne({ userID: message.author.id }, async (err, char) => {
          if (err) console.log(err);

          if (char != undefined) {
            if (!char.engCreature.emCombate) {
              const listPricePlus = Math.floor(250 * (char.charLvl.currLvl + 1))

              const render = new Discord.MessageEmbed()
                .setColor("#e68612")
                .setTitle(`📜 Mercado - Lista de itens para venda:`)
                .setDescription(`Você tem 💰 ${char.gold} gp.`)
                .addFields(
                  {
                    name: `📦1️⃣ **Item 1: ${char.mktLista.item1.nome} - preço: ${char.mktLista.item1.val} gp**`,
                    value: `ATK:${char.mktLista.item1.atk}, DMG: ${char.mktLista.item1.dmg}, DEF: ${char.mktLista.item1.def}, RES: ${char.mktLista.item1.res}`,
                  },
                  {
                    name: `📦2️⃣ **Item 2: ${char.mktLista.item2.nome} - preço: ${char.mktLista.item2.val} gp**`,
                    value: `ATK:${char.mktLista.item2.atk}, DMG: ${char.mktLista.item2.dmg}, DEF: ${char.mktLista.item2.def}, RES: ${char.mktLista.item2.res}`,
                  },
                  {
                    name: `📦3️⃣ **Item 3: ${char.mktLista.item3.nome} - preço: ${char.mktLista.item3.val} gp**`,
                    value: `ATK:${char.mktLista.item3.atk}, DMG: ${char.mktLista.item3.dmg}, DEF: ${char.mktLista.item3.def}, RES: ${char.mktLista.item3.res}`,
                  },
                  {
                    name: `📦4️⃣ **Item 4: ${char.mktLista.item4.nome} - preço: ${char.mktLista.item4.val} gp**`,
                    value: `ATK:${char.mktLista.item4.atk}, DMG: ${char.mktLista.item4.dmg}, DEF: ${char.mktLista.item4.def}, RES: ${char.mktLista.item4.res}`,
                  },
                  {
                    name: `📦5️⃣ **Item 5: ${char.mktLista.item5.nome} - preço: ${char.mktLista.item5.val} gp**`,
                    value: `ATK:${char.mktLista.item5.atk}, DMG: ${char.mktLista.item5.dmg}, DEF: ${char.mktLista.item5.def}, RES: ${char.mktLista.item5.res}`,
                  },
                  {
                    name: `🧴 **Poções de cura:**`,
                    value: `Por 30 gp você compra uma poção de cura.`,
                  },
                  {
                    name: `\u200b`,
                    value: `💸 Utilize o comando **!buy itemX ou !buy potion** para comprar itens.`,
                  },
                  {
                    name: `\u200b`,
                    value: `🔄 Pagando 10 gp você pode gerar uma nova lista de itens com o comando **!newlist**`,
                  },
                  {
                    name: `\u200b`,
                    value: `🗡 Hey, se você me pagar ${listPricePlus} gp eu consigo uma lista melhor que essa! Utilize o comando **!newlist plus**`,
                  }
                );

              let msgBot = await message.channel.send(render);
              msgBot.delete({timeout: 20000})
            } else {
              message.reply(
                "Você está em combate! Derrote o seu inimigo para utilizar o mercado."
              ).then((msg) => msg.delete({ timeout: 10000 }));
            }
          } else {
            message.reply(
              "Você não possui personagem criado, utilize o comando **!newgame** para criar um novo personagem."
            ).then((msg) => msg.delete({ timeout: 10000 }));
          }
        });
      })
      .catch((err) => console.log(err));
  },
};
