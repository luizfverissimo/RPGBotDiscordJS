module.exports = {
  name: "char",
  description: "puxar o char da DB",
  async execute(message, args) {
    const mongoose = require("mongoose");
    const CharDB = require("../models/charDB.js");

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
        CharDB.find({ userID: message.author.id }, (err, char) => {
          console.log(char);
          if (err) console.log(err);
          
          if (char[0] != undefined) {
            //render
            message.channel.send(
              `🛡**Nome:** ${char[0].userName}, **Level:** ${char[0].charLvl}, **Gold:** ${char[0].gold} gp, **Potions:** ${char[0].potion}`
            );
          } else {
            message.channel.send(
              "Você não possui personagem criado, utilize o comando !newgame."
            );
          }
        });
      })
      .catch((err) => console.log(err));
  },
};
