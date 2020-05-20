const Discord = require('discord.js')

module.exports = {
  name: "inv",
  description: "puxar o inventário do char da DB",
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
                {name: '📦1️⃣ Slot 1:', value: `${char.backpack.slot1.nome}`},
                {name: '📦2️⃣ Slot 2:', value: `${char.backpack.slot2.nome}`},
                {name: '📦3️⃣ Slot 3:', value: `${char.backpack.slot3.nome}`},
                {name: '📦4️⃣ Slot 4:', value: `${char.backpack.slot4.nome}`},
                {name: '📦5️⃣ Slot 5:', value: `${char.backpack.slot5.nome}`},
                {name: '🖐 Item segurado:', value: `${char.itemRecebido.nome}`},
              )     
            //render
            message.channel.send(renderMsg).then((msg) => msg.delete({ timeout: 10000 }))            

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
