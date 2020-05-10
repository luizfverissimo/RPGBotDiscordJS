const Discord = require('discord.js')

module.exports = {
  name: "inv",
  description: "puxar o inventário do char da DB",
  async execute(message, args) {
    const mongoose = require("mongoose");
    const CharDB = require("../models/charDB.js");

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
        CharDB.findOne({ userID: message.author.id }, (err, char) => {
          console.log(char);
          if (err) console.log(err);
          
          if (char != undefined) {
            //render backpack
            console.log(char.backpack)

            //criando msg
            const renderMsg = new Discord.MessageEmbed()
              .setColor("#e68612")
              .setTitle(`🎒 Inventário de ${char.userName}:`)
              .setDescription(`Itens equipados:`)
              .addFields(
                {name: '⚔ Arma:', value: `${char.equipedItems.weapon.weaponName} - ATK: ${char.equipedItems.weapon.weaponAtk} / DMG: ${char.equipedItems.weapon.weaponDmg}`, inline: true},
                {name: '🛡 Escudo:', value: `${char.equipedItems.shield.shieldName} - DEF: ${char.equipedItems.shield.shieldDef}`, inline: true},
                {name: '🦺 Armadura:', value: `${char.equipedItems.armor.armorName} - RES: ${char.equipedItems.armor.armorRes}`, inline: true},
                {name: '\u200B', value: `\u200B`},
                {name: `**Mochila:** - Slots:${char.backpack.maxSlots}`, value: `${char.backpack}`},
              )     
            //render
            message.channel.send(renderMsg)

          } else {
            message.channel.send(
              "Você não possui personagem criado, utilize o comando **!newgame** para criar um novo personagem."
            );
          }
        });
      })
      .catch((err) => console.log(err));
  },
};
