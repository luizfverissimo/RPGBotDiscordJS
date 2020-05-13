const Discord = require("discord.js");

module.exports = {
  name: "atk",
  description: "ataca a criatura engajada.",
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
            if (char.engCreature.emCombate) {
              //rola o combate - destino para a criatuare e para o jogador
              let modifierCreature =
                char.engCreature.creatureWeapon.atk -
                char.equipedItems.escudo.def;

              if (modifierCreature < 0) modifierCreature = 0;

              const rollChar =
                Math.floor(Math.random() * 10) + 1 + char.equipedItems.arma.atk;
              const rollCreature =
                Math.floor(Math.random() * 10) + 1 + modifierCreature;

              console.log(rollChar, rollCreature);
              //compara os valores de cada rolagem
              if (rollChar > rollCreature) {
                //neutraliza o dano com a armadura
                let dano =
                  char.equipedItems.arma.dmg -
                  char.engCreature.creatureArmor.res;

                if (dano < 0) dano = 0;

                //atualiza os dados na DB
                char.engCreature.creatureHp.currHp -= dano;

                //render o ganhador e mostra os valores
                const renderMsgWinner = new Discord.MessageEmbed()
                  .setColor("#e01616")
                  .setTitle(`⚔ ${char.userName} acertou o golpe!`)
                  .addFields(
                    {
                      name: "Ataque:",
                      value: `Seu ataque: ${rollChar} | Ataque da criatura: ${rollCreature}`,
                    },
                    {
                      name: "Dano:",
                      value: `${char.equipedItems.arma.nome} - dmg: ⚔ ${char.equipedItems.arma.dmg} - ${char.engCreature.creatureArmor.res} 🦺 = - ${dano} ❤`,
                    },
                    {
                      name: "Criatura:",
                      value: `${char.engCreature.creatureName}:  ${char.engCreature.creatureHp.currHp}/${char.engCreature.creatureHp.maxHp} ❤`,
                    }
                  );

                message.channel.send(renderMsgWinner);

                //confere se a criatura está viva ou não
                if (char.engCreature.creatureHp.currHp <= 0) {
                  //add experiência
                  const modificadorXp = char.engCreature.creatureHp.maxHp * (char.charLvl.currLvl + 1)
                  
                  const battleXp = Math.floor(Math.random() * 10) + 1 + modificadorXp
                  char.charLvl.currXp += battleXp

                  //verifica se subiu de nível
                  if(char.charLvl.currXp >= char.charLvl.xpNextLvl){
                    //modifca o nível do personagem
                    char.charLvl.currLvl += 1

                    //modifica a experiência necessária para o próximo nível
                    const xpRestante = char.charLvl.currXp - char.charLvl.xpNextLvl
                    const incrementoXp = 20 * char.charLvl.currLvl

                    char.charLvl.currXp = xpRestante
                    char.charLvl.xpNextLvl += incrementoXp

                    //add mais vida
                    char.hitPoints.maxHp += 5
                    
                    //render msg 
                    const renderLvlUp = new Discord.MessageEmbed()
                    .setColor("#e68612")
                    .setTitle(
                      `👑 Você subiu para o nível ${char.charLvl.currLvl}! 👑`
                    )
                    .addFields({
                      name: "Experiência para o próximo nível:",
                      value: `🧠 Você recebeu ${battleXp} xp - xp atual: ${char.charLvl.currXp}/${char.charLvl.xpNextLvl}`,
                    })

                    message.channel.send(renderLvlUp)
                  }
                  
                  //add gold
                  const randomGold = Math.floor(Math.random() * 20) + 1 + modificadorXp
                  char.gold += randomGold

                  //render
                  const renderDeathCreature = new Discord.MessageEmbed()
                    .setColor("#e01616")
                    .setTitle(
                      `💀 ${char.engCreature.creatureName} foi derrotado(a)!`
                    )
                    .addFields({
                      name: "Experiência",
                      value: `🧠 Você recebeu ${battleXp} xp - xp atual: ${char.charLvl.currXp}/${char.charLvl.xpNextLvl}`,
                    },
                    {
                      name: "Gold:",
                      value: `💰 Você recebeu ${randomGold} gp - gp total: ${char.gold} gp`,
                    },
                    {
                      name: "Itens:",
                      value: `Você achou um item!`,
                    }
                    );
                  message.channel.send(renderDeathCreature);

                  //retira a criatura do engajamento.
                  char.engCreature.emCombate = false;
                  char.engCreature.creatureName = "Não está em combate.";
                  char.engCreature.creatureHp.maxHp = 0;
                  char.engCreature.creatureHp.currHp = 0;
                  char.engCreature.creatureWeapon.nome = "Vazio";
                  char.engCreature.creatureWeapon.atk = 0;
                  char.engCreature.creatureWeapon.dmg = 0;
                  char.engCreature.creatureArmor.res = 0;

                  ;
                }
                char.save()
              } else {
                //neutraliza o dano com a armadura
                let dano =
                  char.engCreature.creatureWeapon.dmg -
                  char.equipedItems.armadura.res;
                if (dano < 0) dano = 0;

                //atualiza os dados na DB
                char.hitPoints.currHp -= dano;
                char.save();

                //render o ganhador e mostra os valores
                const renderMsgWinner = new Discord.MessageEmbed()
                  .setColor("#e01616")
                  .setTitle(
                    `⚔ ${char.engCreature.creatureName} acertou o golpe!`
                  )
                  .addFields(
                    {
                      name: "Ataque:",
                      value: `Seu ataque: ${rollChar} | Ataque da criatura: ${rollCreature}`,
                    },
                    {
                      name: "Dano:",
                      value: `${char.engCreature.creatureWeapon.nome} - dmg: ⚔${char.engCreature.creatureWeapon.dmg} - ${char.equipedItems.armadura.res} 🦺 = - ${dano} ❤`,
                      inline: true,
                    },
                    {
                      name: "Dano recebido:",
                      value: `${char.userName}: ${char.hitPoints.currHp}/${char.hitPoints.maxHp} ❤`,
                      inline: true,
                    }
                  );

                message.channel.send(renderMsgWinner);

                //confere se o jogador está vivo ou não

                //caso não - render o status de incapacitado e
              }

              //não possui monstro engajado
            } else {
              message.reply(
                "Você não está em combate, Guerreiro! Caso queira arrumar briga, siga para as criptas e utilize o comando **!explore**."
              );
            }
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
