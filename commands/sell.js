const Discord = require("discord.js");

module.exports = {
  name: "sell",
  description:
    "Vende um equipamento para o mercado, precisa de um argumento slot e posterior confirmação.",
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
              if (args[0].includes("slot") && args.length < 3) {
                const slotItem = char.backpack[args[0]];
                const sellPrice = slotItem.val - ((slotItem.val / 100) * 10);

                if (slotItem.nome === "Vazio") {
                  message.reply(
                    "O item que você escolheu não existe, selecione um item diferente de vazio."
                  );
                }

                //se for selecionado um item da lista
                if (slotItem.nome !== "Vazio") {
                  const renderItemSell = new Discord.MessageEmbed()
                    .setColor("#e68612")
                    .setTitle(
                      `📦 Você deseja vender o item ${slotItem.nome} por ${sellPrice} gp 💰? `
                    )
                    .addFields(
                      {
                        name: "Atributos:",
                        value: `ATK:${slotItem.atk}, DMG: ${slotItem.dmg}, DEF: ${slotItem.def}, RES: ${slotItem.res}, VAL: ${slotItem.val} gp`,
                      },
                      {
                        name: "\u200b",
                        value: `Utilize o comando **!sell slotX yes** para confirmar a compra do item!.`,
                      }
                    );

                  //se não enviou o comando yes, pergunte se quer realizar a compra
                  if (!args[1]) {
                    message.channel.send(renderItemSell);

                    //caso responda yes - realiza a compra
                  } else if (args[1] === "yes") {
                    char.gold += sellPrice;

                    const renderItemVendido = new Discord.MessageEmbed()
                      .setColor("#e68612")
                      .setTitle(
                        `📦 Você vendeu o item ${slotItem.nome} por +${sellPrice} gp 💰!`
                      )
                      .setDescription(
                        `Seu saldo atual é de 💰${char.gold} gp `
                      )
                      .addFields({
                        name: "\u200b",
                        value: `O item foi retirado de seu inventário, utilize o comando **!inv** para verificar sua mochila.`,
                      });
                    //envia msg que foi adicionado
                    message.channel.send(renderItemVendido);

                    //retira o item da lista
                    slotItem.nome = "Vazio";
                    slotItem.tipo = "Vazio";
                    slotItem.atk = 0;
                    slotItem.dmg = 0;
                    slotItem.res = 0;
                    slotItem.def = 0;
                    slotItem.val = 0;
                  }
                }
              } else {
                message.reply(
                  "Você precisa definir um slot do seu invetário que deseja vender, somente um item por vez. (!sell  slot1, por exemplo)"
                );
              }

              //salvar na DB
              char.save();
            } else {
              message.reply(
                "Você precisa definir um slot do seu invetário que deseja vender, somente um item por vez. (!sell slot1, por exemplo)"
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
