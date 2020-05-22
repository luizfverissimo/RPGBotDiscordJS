const Discord = require('discord.js')

module.exports = {
  name: "inv",
  description: "puxar o inventário do char da DB",
  async execute(message, args) {
    const mongoose = require("mongoose");
    const CharDB = require("../models/CharDB.js");

    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0-v4wt0.gcp.mongodb.net/charDB?retryWrites=true&w=majority`;

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
            //criando msg
            const renderMsg = new Discord.MessageEmbed()
              .setColor("#e68612")
              .setTitle(`🎒 Inventário de ${char.userName}:`)
              .setDescription(`Itens equipados:`)
              .addFields(
                {name: '⚔ Arma:', value: `${char.equipedItems.arma.nome} - ATK: ${char.equipedItems.arma.atk} / DMG: ${char.equipedItems.arma.dmg}`, inline: true},
                {name: '🛡 Escudo:', value: `${char.equipedItems.escudo.nome} - DEF: ${char.equipedItems.escudo.def}`, inline: true},
                {name: '🦺 Armadura:', value: `${char.equipedItems.armadura.nome} - RES: ${char.equipedItems.armadura.res}`, inline: true},
                {name: `**Mochila:** - Slots:${char.backpack.maxSlots}`, value: `\u200b`},
                {name: '📦1️⃣ Slot 1:', value: `${char.backpack.slot1.nome} - ATK:${char.backpack.slot1.atk}, DMG: ${char.backpack.slot1.dmg}, DEF: ${char.backpack.slot1.def}, RES: ${char.backpack.slot1.res}, VAL:${char.backpack.slot1.val} gp`},
                {name: '📦2️⃣ Slot 2:', value: `${char.backpack.slot2.nome} - ATK:${char.backpack.slot2.atk}, DMG: ${char.backpack.slot2.dmg}, DEF: ${char.backpack.slot2.def}, RES: ${char.backpack.slot2.res}, VAL:${char.backpack.slot2.val} gp`},
                {name: '📦3️⃣ Slot 3:', value: `${char.backpack.slot3.nome} - ATK:${char.backpack.slot3.atk}, DMG: ${char.backpack.slot3.dmg}, DEF: ${char.backpack.slot3.def}, RES: ${char.backpack.slot3.res}, VAL:${char.backpack.slot3.val} gp`},
                {name: '📦4️⃣ Slot 4:', value: `${char.backpack.slot4.nome} - ATK:${char.backpack.slot4.atk}, DMG: ${char.backpack.slot4.dmg}, DEF: ${char.backpack.slot4.def}, RES: ${char.backpack.slot4.res}, VAL:${char.backpack.slot4.val} gp`},
                {name: '📦5️⃣ Slot 5:', value: `${char.backpack.slot5.nome} - ATK:${char.backpack.slot5.atk}, DMG: ${char.backpack.slot5.dmg}, DEF: ${char.backpack.slot5.def}, RES: ${char.backpack.slot5.res}, VAL:${char.backpack.slot5.val} gp`},
                {name: '🖐 Item segurado:', value: `${char.itemRecebido.nome} - ATK:${char.itemRecebido.atk}, DMG: ${char.itemRecebido.dmg}, DEF: ${char.itemRecebido.def}, RES: ${char.itemRecebido.res}, VAL:${char.itemRecebido.val} gp`},
              )     
            //render
            message.channel.send(renderMsg).then((msg) => msg.delete({ timeout: 20000 }))            

          } else {
            message.reply(
              "Você não possui personagem criado, utilize o comando **!newgame** para criar um novo personagem."
            ).then((msg) => msg.delete({ timeout: 20000 }));
          }
        });
      })
      .catch((err) => console.log(err));
  },
};
