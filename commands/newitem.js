const Discord = require("discord.js");
const ItemMaker = require('../classes/item_maker')
const RandomEncounter = require('../classes/RandomEncouter')

module.exports = {
  name: "newitem",
  description: "TESTE - cria um novo item",
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
            let item = new ItemMaker(char.charLvl.currLvl)
            item.seletorType()
            item.seletorVariety()
            item.seletorAdjective()
            item.setName()
            item.seletorStatus(item.dificuldade)

            let encounter = new RandomEncounter(char.charLvl.currLvl)
            encounter.generateRandom(encounter.dificuldade)

            console.log(encounter)

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
