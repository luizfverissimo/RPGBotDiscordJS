const Discord = require("discord.js");
const ItemList = require("../classes/ItemList");

module.exports = {
  name: "newlist",
  description: "Gera nova lista no mercado",
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
              //pagamento
              const taxaNovaLista = 10;
              char.gold -= taxaNovaLista;
              if (char.gold < 0) char.gold = 0;

              //gera nova lista
              let lista = new ItemList(char.charLvl.currLvl);
              lista.generateLista(lista.dificuldade);

              char.mktLista.item1.nome = lista.lista.item1.nome;
              char.mktLista.item1.tipo = lista.lista.item1.tipo;
              char.mktLista.item1.atk = lista.lista.item1.atk;
              char.mktLista.item1.dmg = lista.lista.item1.dmg;
              char.mktLista.item1.def = lista.lista.item1.def;
              char.mktLista.item1.res = lista.lista.item1.res;
              char.mktLista.item1.val = lista.lista.item1.val;

              char.mktLista.item2.nome = lista.lista.item2.nome;
              char.mktLista.item2.tipo = lista.lista.item2.tipo;
              char.mktLista.item2.atk = lista.lista.item2.atk;
              char.mktLista.item2.dmg = lista.lista.item2.dmg;
              char.mktLista.item2.def = lista.lista.item2.def;
              char.mktLista.item2.res = lista.lista.item2.res;
              char.mktLista.item2.val = lista.lista.item2.val;

              char.mktLista.item3.nome = lista.lista.item3.nome;
              char.mktLista.item3.tipo = lista.lista.item3.tipo;
              char.mktLista.item3.atk = lista.lista.item3.atk;
              char.mktLista.item3.dmg = lista.lista.item3.dmg;
              char.mktLista.item3.def = lista.lista.item3.def;
              char.mktLista.item3.res = lista.lista.item3.res;
              char.mktLista.item3.val = lista.lista.item3.val;

              char.mktLista.item4.nome = lista.lista.item4.nome;
              char.mktLista.item4.tipo = lista.lista.item4.tipo;
              char.mktLista.item4.atk = lista.lista.item4.atk;
              char.mktLista.item4.dmg = lista.lista.item4.dmg;
              char.mktLista.item4.def = lista.lista.item4.def;
              char.mktLista.item4.res = lista.lista.item4.res;
              char.mktLista.item4.val = lista.lista.item4.val;

              char.mktLista.item5.nome = lista.lista.item5.nome;
              char.mktLista.item5.tipo = lista.lista.item5.tipo;
              char.mktLista.item5.atk = lista.lista.item5.atk;
              char.mktLista.item5.dmg = lista.lista.item5.dmg;
              char.mktLista.item5.def = lista.lista.item5.def;
              char.mktLista.item5.res = lista.lista.item5.res;
              char.mktLista.item5.val = lista.lista.item5.val;

              const render = new Discord.MessageEmbed()
                .setColor("#e68612")
                .setTitle(`🛒 Nova Lista de itens foi gerada no mercado`)
                .addFields({
                  name: `\u200b`,
                  value: `Utilize o comando **!mkt** para ver a nova lista.`,
                });

              message.channel.send(render);

              char.save();
            } else {
              message.reply(
                "Você está em combate! Derrote o seu inimigo para utilizar o mercado."
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
