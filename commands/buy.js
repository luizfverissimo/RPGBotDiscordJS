const Discord = require("discord.js");

module.exports = {
  name: "buy",
  description:
    "Compra um equipamento do mercado, precisa de um argumente item e posterior confirmação.",
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
            if (args[0]) {
              if (args[0].includes("potion") && args.length < 3) {
                const potionPrice = 30;

                if (
                  char.gold >= potionPrice &&
                  char.potions.currPotions < char.potions.maxPotions
                ) {
                  char.gold -= potionPrice;
                  char.potions.currPotions += 1;

                  const renderPotion = new Discord.MessageEmbed()
                    .setColor("#e68612")
                    .setTitle(
                      `📦 Você deseja comprou uma poção de cura por -${potionPrice} gp 💰? `
                    )
                    .addFields(
                      {
                        name: "\u200b",
                        value: `💰 Saldo atual: ${char.gold} gp - 🧴 Poções de cura: ${char.potions.currPotions}/${char.potions.maxPotions} `,
                      }
                    );

                  message.channel.send(renderPotion);
                } else {
                  message.reply(
                    "❌ Você não possui ouro o suficiente para realizar essa compra! Se aventure nas criptas para conseguir algum ouro."
                  );
                }
              } else if (args[0].includes("item") && args.length < 3) {
                const slotItem = char.mktLista[args[0]];

                if (slotItem.nome === "Vazio") {
                  message.reply(
                    "O item que você escolheu não existe, selecione um item diferente de vazio. Caso todos estejam vazio, você pode gerar uma nova lista com o comando **!newlist**."
                  );
                }

                //se for selecionado um item da lista
                if (slotItem.nome !== "Vazio") {
                  const renderItemDrop = new Discord.MessageEmbed()
                    .setColor("#e68612")
                    .setTitle(
                      `📦 Você deseja comprar o item ${slotItem.nome} por ${slotItem.val} gp 💰? `
                    )
                    .addFields(
                      {
                        name: "Atributos:",
                        value: `ATK:${slotItem.atk}, DMG: ${slotItem.dmg}, DEF: ${slotItem.def}, RES: ${slotItem.res}, VAL: ${slotItem.val} gp`,
                      },
                      {
                        name: "\u200b",
                        value: `Utilize o comando **!buy itemX yes** para confirmar a compra do item!.`,
                      }
                    );

                  //se não enviou o comando yes, pergunte se quer realizar a compra
                  if (!args[1]) {
                    message.channel.send(renderItemDrop);

                    //caso responda yes - realiza a compra
                  } else if (args[1] === "yes") {
                    //verifica se o char tem um item segurado
                    if (char.itemRecebido.nome !== "Vazio") {
                      //se sim, avisa que ele pode perder o item
                      const renderAviso = new Discord.MessageEmbed()
                        .setColor("#e68612")
                        .setTitle(
                          `❗ Atenção, você está segurando um item - ${char.itemRecebido.nome}, caso você não tenha espaço livre no inventário, a compra irá substituir este item.`
                        )
                        .addFields({
                          name: "\u200b",
                          value: `Resolva o que você irá fazer com o item segurando antes de finalizar a compra.`,
                        });

                      message.channel.send(renderAviso);

                      //caso tenha resolvido o item segurado
                    } else {
                      //se tiver o dinheiro suficiente
                      if (char.gold >= slotItem.val) {
                        //retira o dinheiro
                        char.gold -= slotItem.val;

                        let counter;
                        Object.keys(char.backpack).some((el) => {
                          if (char.backpack[el].nome === "Vazio") {
                            //passa o item da lista para um espaço vazio da mochila
                            counter++;
                            char.backpack[el].nome = slotItem.nome;
                            char.backpack[el].tipo = slotItem.tipo;
                            char.backpack[el].atk = slotItem.atk;
                            char.backpack[el].dmg = slotItem.dmg;
                            char.backpack[el].def = slotItem.def;
                            char.backpack[el].res = slotItem.res;
                            char.backpack[el].val = slotItem.val;
                            return true;
                          }
                        });

                        //caso não tenha espaço, adiciona no item segurado
                        if (counter === 0) {
                          char.itemRecebido.nome = slotItem.nome;
                          char.itemRecebido.tipo = slotItem.tipo;
                          char.itemRecebido.atk = slotItem.atk;
                          char.itemRecebido.dmg = slotItem.dmg;
                          char.itemRecebido.def = slotItem.def;
                          char.itemRecebido.res = slotItem.res;
                          char.itemRecebido.val = slotItem.val;
                        }

                        const renderItemComprado = new Discord.MessageEmbed()
                          .setColor("#e68612")
                          .setTitle(
                            `📦 Você comprou o item ${slotItem.nome} por -${slotItem.val} gp 💰!`
                          )
                          .setDescription(
                            `Seu saldo atual é de  💰${char.gold} gp `
                          )
                          .addFields({
                            name: "\u200b",
                            value: `Ele foi adicionado em seu inventário, utilize o comando **!inv** para verificar sua mochila!`,
                          });
                        //envia msg que foi adicionado
                        message.channel.send(renderItemComprado);

                        //retira o item da lista
                        slotItem.nome = "Vazio";
                        slotItem.tipo = "Vazio";
                        slotItem.atk = 0;
                        slotItem.dmg = 0;
                        slotItem.res = 0;
                        slotItem.def = 0;
                        slotItem.val = 0;
                      } else {
                        message.reply(
                          "❌ Você não possui ouro o suficiente para realizar essa compra! Se aventure nas criptas para conseguir algum ouro."
                        );
                      }
                    }
                  }
                }
              } else {
                message.reply(
                  "Você precisa definir o item do mercado que deseja comprar, somente um item por vez. (!buy slot1, por exemplo)"
                );
              }

              //salvar na DB
              char.save();
            } else {
              message.reply(
                "Você precisa definir o item do mercado que deseja comprar, somente um item por vez. (!buy slot1, por exemplo)"
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
