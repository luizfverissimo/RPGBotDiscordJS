const Discord = require("discord.js");

module.exports = {
  name: "potion",
  description: "Utiliza a potion e recupa vida.",
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
            if (char.potions.currPotions > 0) {
              const potionHeal = 5;

              if (char.hitPoints.currHp >= char.hitPoints.maxHp) {
                //criando msg
                const renderMsg = new Discord.MessageEmbed()
                  .setColor("#e01616")
                  .setTitle(
                    `🧴 Você está com a vida cheia! Guarde esta poção para mais tarde. ❤`
                  );

                message.channel.send(renderMsg).then((msg) => msg.delete({ timeout: 10000 }));
              } else {
                //cura o char
                char.hitPoints.currHp += potionHeal;
                //remove uma poção do inv
                char.potions.currPotions -= 1;

                //não sobe além do maxHp
                if (char.hitPoints.currHp >= char.hitPoints.maxHp) {
                  char.hitPoints.currHp = char.hitPoints.maxHp;
                }

                //render
                const renderMsg = new Discord.MessageEmbed()
                  .setColor("#e01616")
                  .setTitle(
                    `🧴 Você utilizou uma poção de cura e recuperou +${potionHeal} ❤.`
                  )
                  .addFields(
                    {
                      name: "❤ Vida atual:",
                      value: `${char.hitPoints.currHp}/${char.hitPoints.maxHp}`,
                      inline: true,
                    },
                    {
                      name: "🧴 Poções de cura:",
                      value: `${char.potions.currPotions}/${char.potions.maxPotions}`,
                      inline: true,
                    }
                  );

                message.channel.send(renderMsg).then((msg) => msg.delete({ timeout: 10000 }));
              }

            } else {
              message.reply('Você não possui mais poções de cura! Vá até o mercado para comprar mais.').then((msg) => msg.delete({ timeout: 10000 }))
              
            }

            char.save()
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
