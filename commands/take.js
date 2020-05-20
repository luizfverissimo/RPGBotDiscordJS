const Discord = require("discord.js");

module.exports = {
  name: "take",
  description: "Adiciona o item segurado em um slot vazio.",
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
            let counter = 0;

            if(char.itemRecebido.nome !== 'Vazio'){
              Object.keys(char.backpack).some((el) => {
                if (char.backpack[el].nome === "Vazio") {
                  const renderItem = new Discord.MessageEmbed()
                    .setColor("#e68612")
                    .setTitle(`📦 Você guardou o item ${char.itemRecebido.nome} em seu inventário! ⬆`)
                    .addFields(
                      {
                        name: "Atributos:",
                        value: `ATK:${char.itemRecebido.atk}, DMG: ${char.itemRecebido.dmg}, DEF: ${char.itemRecebido.def}, RES: ${char.itemRecebido.res}, VAL: ${char.itemRecebido.val} gp`,
                      },
                    );
  
                  //add atribuitos do item
                  char.backpack[el].nome = char.itemRecebido.nome;
                  char.backpack[el].tipo = char.itemRecebido.tipo;
                  char.backpack[el].atk = char.itemRecebido.atk;
                  char.backpack[el].dmg = char.itemRecebido.dmg;
                  char.backpack[el].def = char.itemRecebido.def;
                  char.backpack[el].res = char.itemRecebido.res;
                  char.backpack[el].val = char.itemRecebido.val;
  
                  char.itemRecebido.nome = 'Vazio'
                  char.itemRecebido.tipo = "Vazio"
                  char.itemRecebido.atk = 0
                  char.itemRecebido.dmg = 0
                  char.itemRecebido.def = 0
                  char.itemRecebido.res = 0
                  char.itemRecebido.val = 0
  
                  counter++;
                  message.channel.send(renderItem).then((msg) => msg.delete({ timeout: 10000 }))
                  return true;
                }
              });

              if (counter === 0) {
                message.reply(
                  "Você não possui slot vazio para receber o item, utilize o comando **!drop slotX** para largar um item."
                ).then((msg) => msg.delete({ timeout: 10000 }));
              }
            }
            else {
              message.reply('Você não possui nenhum item segurado.')
            }
            

            

            char.save();
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
