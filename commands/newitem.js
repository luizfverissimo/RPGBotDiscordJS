const Discord = require("discord.js");
const ItemMaker = require('../classes/item_maker')

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

            console.log(item)
            
            let counter = 0
            Object.keys(char.backpack).some(el =>{              
              if(char.backpack[el].nome === 'Vazio') {
                //add atribuitos do item
                counter++
                char.backpack[el].nome = 'Trocado'
                message.reply('O item foi adicionado.')
                return true                
              }
            })

            if (counter === 0) {
              message.reply('Você não possui slot vazio para receber o item.')
            }
            
            char.save()
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
