const Discord = require("discord.js");

module.exports = {
  name: "show",
  description: "Mostra os dados de um item.",
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
                  {
                    name: "Dano:",
                    value: `${item.dmg ? item.dmg : 0}`,
                    inline: true,
                  },
                  {
                    name: "Defesa:",
                    value: `${item.def ? item.def : 0}`,
                    inline: true,
                  },
                  {
                    name: "Resistência à dano:",
                    value: `${item.res ? item.res : 0}`,
                    inline: true,
                  },
                  {
                    name: "Valor:",
                    value: `${item.val ? item.val : 0} gp`,
                    inline: true,
                  }
                );
              return renderMsg;
            };

            if (args[0].includes('slot') && args.length < 2) {
              //render
              if(args[0] === 'arma' || args[0] === 'escudo' || args[0] === 'armadura'){
                message.channel.send(renderShowItem(char.equipedItems[args[0]])).then((msg) => msg.delete({ timeout: 10000 }));
              } else {
                message.channel.send(renderShowItem(char.backpack[args[0]])).then((msg) => msg.delete({ timeout: 10000 }))
              }
            } else {
              message.reply('Defina um slot que você deseja inspecionar (slot1..., arma, escudo ou armadura).').then((msg) => msg.delete({ timeout: 10000 }))
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
