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

              console.log(lista.lista);
              console.log(char.mktLista);

              Object.keys(char.mktLista && lista.lista).some((el) => {
                char.mktLista[el].nome = lista.lista[el].nome;
                char.mktLista[el].tipo = lista.lista[el].tipo;
                char.mktLista[el].atk = lista.lista[el].atk;
                char.mktLista[el].dmg = lista.lista[el].dmg;
                char.mktLista[el].def = lista.lista[el].def;
                char.mktLista[el].res = lista.lista[el].res;
                char.mktLista[el].val = lista.lista[el].val;
              });


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
