const Discord = require("discord.js");

module.exports = {
  name: "run",
  description: "Desengaja da criatura, podem levar um ataque de oportunidade.",
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
              ////////////////////////////////////////////////////////////////
              //rola para ver se houve atk de oportunidade
              const roll = Math.floor(Math.random() * 10) + 1;

              if (roll <= 6) {
                //criando msg
                const renderEscape = new Discord.MessageEmbed()
                  .setColor("#e68612")
                  .setTitle(
                    `💨 Você escapou da(o) ${char.engCreature.creatureName}! Não há vergonha em escolher bem as suas batalhas.`
                  )
                  .setDescription(
                    `Volte para as criptas e use o comando **!explore** para novas aventuras.`
                  );
                //render msg
                message.channel.send(renderEscape).then((msg) => msg.delete({ timeout: 10000 }));
              } else {
                //se aconteceu, retira dano.
                let dano =
                  char.engCreature.creatureWeapon.dmg -
                  char.equipedItems.armadura.res;
                if (dano < 0) dano = 0;

                //atualiza os dados na DB
                char.hitPoints.currHp -= dano;

                //criando msg
                const renderAtk = new Discord.MessageEmbed()
                  .setColor("#e68612")
                  .setTitle(
                    `⚔ Você levou um ataque de oportunidade da(o) ${char.engCreature.creatureName}!`
                  )
                  .setDescription(`Você levou - ${dano} ❤ - Vida atual: ${char.hitPoints.currHp}/${char.hitPoints.maxHp} ❤.`);

                //render
                message.channel.send(renderAtk).then((msg) => msg.delete({ timeout: 10000 }));

                //caso haja morte do personagem
                if (char.hitPoints.currHp <= 0) {
                  //pagamento da cura
                  const pagamentoCura = 300;
                  char.gold -= pagamentoCura;

                  //cura - se o dinheiro zerar, somente metade da vida é recuperada.
                  if (char.gold < 0) {
                    char.gold = 0;
                    char.hitPoints.currHp = Math.ceil(char.hitPoints.maxHp / 2);
                  } else {
                    char.hitPoints.currHp = char.hitPoints.maxHp;
                  }

                  //item que será dropado
                  const itensEquipados = ["arma", "escudo", "armadura"];
                  const itemSorteado =
                    itensEquipados[
                      Math.floor(Math.random() * itensEquipados.length)
                    ];

                  //render o status de incapacitado
                  const renderIncapacitado = new Discord.MessageEmbed()
                    .setColor("#e01616")
                    .setTitle(`💤 Você foi incapacitado e não pode mais lutar.`)
                    .addFields(
                      {
                        name:
                          "Você foi arrastado para fora das criptas e se encontra em uma cama todo enfaixado, você não sabe quantos dias passaram.",
                        value: `Você pagou **${pagamentoCura} gp** pelos curativos e estalagem - saldo atual: 💰${char.gold}`,
                      },
                      {
                        name: `Provavelmente a criatura levou a(o) ${itemSorteado} que estava equipada(o)`,
                        value: `Você perdeu a(o) ${char.equipedItems[itemSorteado].nome}.`,
                      }
                    );
                  message.channel.send(renderIncapacitado).then((msg) => msg.delete({ timeout: 10000 }));

                  //retira o item da DB
                  char.equipedItems[itemSorteado].nome = "Vazio";
                  char.equipedItems[itemSorteado].tipo = "Vazio";
                  char.equipedItems[itemSorteado].atk = 0;
                  char.equipedItems[itemSorteado].dmg = 0;
                  char.equipedItems[itemSorteado].res = 0;
                  char.equipedItems[itemSorteado].def = 0;
                  char.equipedItems[itemSorteado].val = 0;
                }
              }

              //retira a criatura da DB
              char.engCreature.emCombate = false;
              char.engCreature.creatureName = "Não está em combate.";
              char.engCreature.creatureHp.maxHp = 0;
              char.engCreature.creatureHp.currHp = 0;
              char.engCreature.creatureWeapon.nome = "Vazio";
              char.engCreature.creatureWeapon.atk = 0;
              char.engCreature.creatureWeapon.dmg = 0;
              char.engCreature.creatureArmor.res = 0;

              char.save();
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
