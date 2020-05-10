const Discord = require('discord.js')

module.exports = {
  name: "char",
  description: "puxar o char da DB",
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
            //criando msg
            const renderMsg = new Discord.MessageEmbed()
              .setColor("#e68612")
              .setTitle(`Nome: ${char.userName}`)
              .setDescription(`Guerreiro nível: ${char.charLvl.currLvl}`)
              .addFields(
                {name: '🧠Experiência:', value: `${char.charLvl.currXp}/${char.charLvl.xpNextLvl}` , inline: true},
                {name: '❤ Vida:', value: `${char.hitPoints.currHp}/${char.hitPoints.maxHp}` , inline: true},
                {name: '💰 Ouro:', value: `${char.gold} gp`, inline: true},
                {name: '🧴 Poção de vida:', value: `${char.potions.currPotions}/${char.potions.maxPotions}`, inline: true},
                {name: '\u200B', value: `\u200B`},
                {name: '⚔ Status de combate:', value: `${char.engCreature.creatureName}`},
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
