const Discord = require("discord.js");
const ItemMaker = require("../classes/item_maker");

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

              //compara os valores de cada rolagem
              //char ganha:
              if (rollChar > rollCreature) {
                //neutraliza o dano com a armadura
                let roll = (Math.floor(Math.random() * 3) + 1)
                let dano = roll + 
                  (char.equipedItems.arma.dmg -
                  char.engCreature.creatureArmor.res)

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
                      value: `${char.equipedItems.arma.nome} - dmg: ⚔ (${char.equipedItems.arma.dmg} + ${roll}) - ${char.engCreature.creatureArmor.res} 🦺 = - ${dano} ❤`,
                    },
                    {
                      name: "Criatura:",
                      value: `${char.engCreature.creatureName}:  ${char.engCreature.creatureHp.currHp}/${char.engCreature.creatureHp.maxHp} ❤`,
                    }
                  );

                message.channel.send(renderMsgWinner).then((msg) => msg.delete({ timeout: 10000 }));

                //confere se a criatura está viva ou não
                if (char.engCreature.creatureHp.currHp <= 0) {
                  //add experiência
                  const modificadorXp =
                    char.engCreature.creatureHp.maxHp *
                    (char.charLvl.currLvl + 1);

                  const battleXp =
                    Math.floor(Math.random() * 10) + 1 + modificadorXp;
                  char.charLvl.currXp += battleXp;

                  //verifica se subiu de nível
                  if (char.charLvl.currXp >= char.charLvl.xpNextLvl) {
                    //modifca o nível do personagem
                    char.charLvl.currLvl += 1;

                    //modifica a experiência necessária para o próximo nível
                    const xpRestante =
                      char.charLvl.currXp - char.charLvl.xpNextLvl;
                    const incrementoXp = 20 * char.charLvl.currLvl;

                    char.charLvl.currXp = xpRestante;
                    char.charLvl.xpNextLvl += incrementoXp;

                    //add mais vida
                    char.hitPoints.maxHp += 5;

                    //render msg
                    const renderLvlUp = new Discord.MessageEmbed()
                      .setColor("#e68612")
                      .setTitle(
                        `👑 Você subiu para o nível ${char.charLvl.currLvl}! 👑`
                      )
                      .addFields({
                        name: "Experiência para o próximo nível:",
                        value: `🧠 Você recebeu ${battleXp} xp - xp atual: ${char.charLvl.currXp}/${char.charLvl.xpNextLvl}`,
                      });

                    message.channel.send(renderLvlUp).then((msg) => msg.delete({ timeout: 10000 }));
                  }

                  //add gold
                  const randomGold =
                    Math.floor(Math.random() * 20) + 1 + modificadorXp;
                  char.gold += randomGold;

                  //cria um item randômico
                  let item = new ItemMaker(char.charLvl.currLvl);
                  item.seletorType();
                  item.seletorVariety();
                  item.seletorAdjective();
                  item.setName();
                  item.seletorStatus(item.dificuldade);
                  item.seletorVal();

                  //Add o item
                  let counter = 0;
                  Object.keys(char.backpack).some((el) => {
                    if (char.backpack[el].nome === "Vazio") {
                      //add atribuitos do item
                      counter++;
                      char.backpack[el].nome = item.nome;
                      char.backpack[el].tipo = item.tipo;
                      char.backpack[el].atk = item.atk;
                      char.backpack[el].dmg = item.dmg;
                      char.backpack[el].def = item.def;
                      char.backpack[el].res = item.res;
                      char.backpack[el].val = item.val;
                      return true;
                    }
                  });

                  
                  //render
                  const renderDeathCreature = new Discord.MessageEmbed()
                    .setColor("#e01616")
                    .setTitle(
                      `💀 ${char.engCreature.creatureName} foi derrotado(a)!`
                    )
                    .addFields(
                      {
                        name: "Experiência",
                        value: `🧠 Você recebeu ${battleXp} xp - xp atual: ${char.charLvl.currXp}/${char.charLvl.xpNextLvl}`,
                      },
                      {
                        name: "Gold:",
                        value: `💰 Você recebeu ${randomGold} gp - gp total: ${char.gold} gp`,
                      },
                      {
                        name: "Itens:",
                        value: `📦 Você achou um(a) ${item.tipo} - ${item.nome} - Atributos: ATK: ${item.atk}, DMG: ${item.dmg}, DEF ${item.def}, RES: ${item.res}, VAL: ${item.val} gp`,
                      }
                    );

                  
                  //envia msg
                  message.channel.send(renderDeathCreature).then((msg) => msg.delete({ timeout: 10000 }));

                  if (counter === 0) {
                    char.itemRecebido.nome = item.nome;
                    char.itemRecebido.tipo = item.tipo;
                    char.itemRecebido.atk = item.atk;
                    char.itemRecebido.dmg = item.dmg;
                    char.itemRecebido.def = item.def;
                    char.itemRecebido.res = item.res;
                    char.itemRecebido.val = item.val;

                    const renderRecebido = new Discord.MessageEmbed()
                      .setColor("#e68612")
                      .setTitle(
                        `📦⛔ Você não possui slot vazio para receber o item, o que deseja fazer com o item recebido?`
                      )
                      .addFields({
                        name: `${char.itemRecebido.nome}`,
                        value: `ATK:${char.itemRecebido.atk}, DMG: ${char.itemRecebido.dmg}, DEF: ${char.itemRecebido.def}, RES: ${char.itemRecebido.res}, VAL: ${char.itemRecebido.val} gp `,
                      },
                        {
                        name: "!drop slotX",
                        value: `Descarta o item do respectivo slot do seu inventário.`,
                      },
                      {
                        name: "!take",
                        value: `Guarda o item recebido no slot vago.`,
                      }
                      );

                    message.channel.send(renderRecebido).then((msg) => msg.delete({ timeout: 10000 }))
                  }
                  

                  //retira a criatura do engajamento.
                  char.engCreature.emCombate = false;
                  char.engCreature.creatureName = "Não está em combate.";
                  char.engCreature.creatureHp.maxHp = 0;
                  char.engCreature.creatureHp.currHp = 0;
                  char.engCreature.creatureWeapon.nome = "Vazio";
                  char.engCreature.creatureWeapon.atk = 0;
                  char.engCreature.creatureWeapon.dmg = 0;
                  char.engCreature.creatureArmor.res = 0;
                }
                char.save();
                //////////////////////////////////////////////////////////////////////////////
                //char perde
              } else {
                let roll = (Math.floor(Math.random() * 3) + 1)
                //neutraliza o dano com a armadura
                let dano = roll +
                  (char.engCreature.creatureWeapon.dmg -
                  char.equipedItems.armadura.res)
                if (dano < 0) dano = 0;

                //atualiza os dados na DB
                char.hitPoints.currHp -= dano;

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
                      value: `${char.engCreature.creatureWeapon.nome} - dmg: ⚔ (${char.engCreature.creatureWeapon.dmg} + ${roll}) - ${char.equipedItems.armadura.res} 🦺 = - ${dano} ❤`,
                      inline: true,
                    },
                    {
                      name: "Dano recebido:",
                      value: `${char.userName}: ${char.hitPoints.currHp}/${char.hitPoints.maxHp} ❤`,
                      inline: true,
                    }
                  );

                message.channel.send(renderMsgWinner).then((msg) => msg.delete({ timeout: 10000 }));

                //confere se o jogador está vivo ou não
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
                  message.channel.send(renderIncapacitado).then((msg) => msg.delete({ timeout: 20000 }));

                  //retira o item da DB
                  char.equipedItems[itemSorteado].nome = "Vazio";
                  char.equipedItems[itemSorteado].tipo = "Vazio";
                  char.equipedItems[itemSorteado].atk = 0;
                  char.equipedItems[itemSorteado].dmg = 0;
                  char.equipedItems[itemSorteado].res = 0;
                  char.equipedItems[itemSorteado].def = 0;
                  char.equipedItems[itemSorteado].val = 0;

                  //retira a criatura do engajamento.
                  char.engCreature.emCombate = false;
                  char.engCreature.creatureName = "Não está em combate.";
                  char.engCreature.creatureHp.maxHp = 0;
                  char.engCreature.creatureHp.currHp = 0;
                  char.engCreature.creatureWeapon.nome = "Vazio";
                  char.engCreature.creatureWeapon.atk = 0;
                  char.engCreature.creatureWeapon.dmg = 0;
                  char.engCreature.creatureArmor.res = 0;
                }

                char.save();
              }

              //não possui monstro engajado
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
