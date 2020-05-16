const Discord = require("discord.js");
const Creature = require("../classes/Creature");
const RandomEncounter = require('../classes/RandomEncouter')

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
              //1 a 3 - encontro
              //4 a 10 - criatura
              const encontro = Math.floor(Math.random() * 10) + 1;

              if (encontro === 1) {
                //cria o encontro
                let encounter = new RandomEncounter(char.charLvl.currLvl);
                encounter.generateRandom(encounter.dificuldade);

                //render encontro
                const renderEncontro = new Discord.MessageEmbed()
                  .setColor("#e01616")
                  .setTitle(`${encounter.texto}`)
                  .setDescription("Ao investigar você encontrou...");

                message.channel.send(renderEncontro);

                //render loot do encontro
                if (encounter.isGold) {
                  const render = new Discord.MessageEmbed()
                    .setColor("#e01616")
                    .setTitle(`💰 Você achou ouro!`)
                    .setDescription(`Receba ${encounter.gold} gp.`);

                  char.gold += encounter.gold

                  message.channel.send(render)
                }

                if(encounter.isArma){
                  const render = new Discord.MessageEmbed()
                    .setColor("#e01616")
                    .setTitle(`⚔ Você achou um equipamento!`)
                    .setDescription(`Receba um(a) ${encounter.tipo} - ${encounter.nome}.`)
                    .addFields({
                      name: `Atributos`,
                      value: `ATK:${encounter.atk}, DMG: ${encounter.dmg}, DEF: ${encounter.def}, RES: ${encounter.res}, VAL: ${encounter.val} gp `,
                    })                  

                  message.channel.send(render)
                  
                  //Add o item
                  let counter = 0;
                  Object.keys(char.backpack).some((el) => {
                    if (char.backpack[el].nome === "Vazio") {
                      //add atribuitos do item
                      counter++;
                      char.backpack[el].nome = encounter.nome;
                      char.backpack[el].tipo = encounter.tipo;
                      char.backpack[el].atk = encounter.atk;
                      char.backpack[el].dmg = encounter.dmg;
                      char.backpack[el].def = encounter.def;
                      char.backpack[el].res = encounter.res;
                      char.backpack[el].val = encounter.val;
                      return true;
                    }
                  });

                  if (counter === 0) {
                    char.itemRecebido.nome = encounter.nome;
                    char.itemRecebido.tipo = encounter.tipo;
                    char.itemRecebido.atk = encounter.atk;
                    char.itemRecebido.dmg = encounter.dmg;
                    char.itemRecebido.def = encounter.def;
                    char.itemRecebido.res = encounter.res;
                    char.itemRecebido.val = encounter.val;
                  } 
                }

                if(encounter.isPotion){
                  const render = new Discord.MessageEmbed()
                    .setColor("#e01616")
                    .setTitle(`🧴 Você achou poção de cura!`)
                    .setDescription(`Receba ${encounter.potion} porção(ões).`);

                  char.potions.currPotions += encounter.potion
                  if(char.potions.currPotions >= char.potions.maxPotions){
                    char.potions.currPotions = char.potions.maxPotions
                  }
                  message.channel.send(render)
                }

              } else {
                //cria a criatura
                const creature = new Creature(char.charLvl.currLvl);
                creature.seletorNome();
                creature.seletorHp(creature.dificuldade);
                creature.seletorWeapon(creature.dificuldade);
                creature.seletorArmor(creature.dificuldade);

                //adiciona a criatura gerada como engajada na db
                char.engCreature.creatureName = creature.nome;
                char.engCreature.creatureHp.maxHp = creature.maxHp;
                char.engCreature.creatureHp.currHp = creature.currHp;
                char.engCreature.creatureWeapon.nome = creature.weaponName;
                char.engCreature.creatureWeapon.atk = creature.atk;
                char.engCreature.creatureWeapon.dmg = creature.dmg;
                char.engCreature.creatureArmor.res = creature.armor;
                char.engCreature.emCombate = true;

                //criando msg e encontro com a criatura
                const renderMsg = new Discord.MessageEmbed()
                  .setColor("#e01616")
                  .setTitle(
                    `Você encontrou um ${char.engCreature.creatureName}!`
                  )
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
                message.channel.send(renderMsg);
              }
            } else {
              message.reply(
                "Você já está em combate! Utilize o comando **!enemy** para ver o inimigo que está engajado."
              );
            }

            char.save();
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
