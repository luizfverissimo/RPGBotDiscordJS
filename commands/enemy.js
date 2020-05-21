const Discord = require("discord.js");

module.exports = {
  name: "enemy",
  description: "Mostra o inimigo engajado.",
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
        CharDB.findOne({ userID: message.author.id }, (err, char) => {
          if (err) console.log(err);

          if (char != undefined) {
            //criando msg e encontro com a criatura
            const renderMsg = new Discord.MessageEmbed()
              .setColor("#e01616")
              .setTitle(`👹 Você está em combate com um(a) ${char.engCreature.creatureName}!`)
              .addFields(
                {
                  name: "❤ Vida:",
                  value: `${char.engCreature.creatureHp.currHp}/${char.engCreature.creatureHp.maxHp}`,
                  inline: true,
                },
                {
                  name: "⚔ Arma:",
                  value: `${char.engCreature.creatureWeapon.nome} - ATK: ${char.engCreature.creatureWeapon.atk} / DMG: ${char.engCreature.creatureWeapon.dmg}`,
                  inline: true,
                },
                {
                  name: "🛡 Armadura:",
                  value: `RES: ${char.engCreature.creatureArmor.res}`,
                  inline: true,
                }
              );

            //render
            if (char.engCreature.emCombate) {
              message.channel.send(renderMsg).then((msg) => msg.delete({ timeout: 10000 }));
            } else {
              message.reply(
                "Você não está em combate, Guerreiro! Caso queira arrumar briga, siga para as criptas e utilize o comando **!explore**."
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
