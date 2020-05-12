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

            const renderShowItem = (item) => {
              //criando msg de troca de item
              const renderMsg = new Discord.MessageEmbed()
                .setColor("#e68612")
                .setTitle(`🔎 ${item.nome}:`)
                .addFields(
                  {
                    name: "Ataque:",
                    value: `${item.atk ? item.atk : 0}`,
                    inline: true,
                  },
                );
              return renderMsg;
            };

            if (char.engCreature.emCombate) {
              //rola o combate - destino para a criatuare e para o jogador
              const rollChar = (Math.floor(Math.random() * 10) +1) + char.equipedItems.arma.atk
              const rollCreature = (Math.floor(Math.random() * 10) +1) + char.engCreature.creatureWeapon.atk

              
              //compara os valores de cada rolagem

              //

            } else {
              message.reply('Você não está em combate, Guerreiro! Caso queira arrumar briga, siga para as criptas e utilize o comando **!explore**.')
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
