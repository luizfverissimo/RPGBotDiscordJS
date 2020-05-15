const Discord = require('discord.js')
const Creature = require('../classes/Creature')

//////////////////////////////////////////////////////////////////////////////
//Execução do comando !explore


module.exports = {
  name: "explore",
  description: "explora as criptas e gera um monstro.",
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
            if (!char.engCreature.emCombate) {
              //cria a criatura
            const creature = new Creature(char.charLvl.currLvl)
            creature.seletorNome()
            creature.seletorHp(creature.dificuldade)
            creature.seletorWeapon(creature.dificuldade)
            creature.seletorArmor(creature.dificuldade)

            //adiciona a criatura gerada como engajada na db
            char.engCreature.creatureName = creature.nome
            char.engCreature.creatureHp.maxHp = creature.maxHp
            char.engCreature.creatureHp.currHp = creature.currHp
            char.engCreature.creatureWeapon.nome = creature.weaponName
            char.engCreature.creatureWeapon.atk = creature.atk
            char.engCreature.creatureWeapon.dmg = creature.dmg
            char.engCreature.creatureArmor.res = creature.armor
            char.engCreature.emCombate = true

            console.log(char.engCreature)
            char.save()

            //criando msg e encontro com a criatura
            const renderMsg = new Discord.MessageEmbed()
              .setColor("#e01616")
              .setTitle(`Você encontrou um ${char.engCreature.creatureName}!`)
              .addFields(
                {name: '❤ Vida:', value: `${char.engCreature.creatureHp.currHp}/${char.engCreature.creatureHp.maxHp}` , inline: true},
                {name: '⚔ Arma:', value: `${char.engCreature.creatureWeapon.nome} - ATK: ${char.engCreature.creatureWeapon.atk} / DMG: ${char.engCreature.creatureWeapon.dmg}` , inline: true},
                {name: '🛡 Armadura:', value: `RES: ${char.engCreature.creatureArmor.res}`, inline: true},
              )          

            //render
            message.channel.send(renderMsg)
            } else {
              message.reply('Você já está em combate! Utilize o comando **!enemy** para ver o inimigo que está engajado.')
            }
            

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
