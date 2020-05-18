const Discord = require('discord.js')

module.exports = {
  name: "char",
  description: "puxar o char da DB",
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
                {name: '🧴 Poções de cura:', value: `${char.potions.currPotions}/${char.potions.maxPotions}`, inline: true},
                {name: '\u200B', value: `\u200B`},
                {name: '⚔ Status de combate:', value: `Engajado com: ${char.engCreature.creatureName}`},
              )            
            //render
            let msgBot = await message.channel.send(renderMsg)
            await msgBot.react('🎒')
            await msgBot.delete({timeout: 20000})
            
            const filterReaction = (reaction, user) => {              
              if(reaction.emoji.name === '🎒' && user.id === message.author.id){
                return true
              }
            };

            msgBot
              .awaitReactions(filterReaction, {
                max: 1,
                time: 10000,
              })
              .then((collected) => {
                const reaction = collected.first();

                if (reaction.emoji.name === "🎒") {
                  console.log('executou?')
                  /*
                  const command = require('../commands/inv');
                  command.execute(message, args)
                  */
                  
                } 
              })
              .catch()


          } else {
            message.reply(
              "Você não possui personagem criado, utilize o comando **!newgame** para criar um novo personagem."
            );
          }
        });
      })
      .catch((err) => console.log(err));
  },
};
