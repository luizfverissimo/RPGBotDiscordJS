const CharDB = require("../models/charDB.js");
const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@cluster0-v4wt0.gcp.mongodb.net/charDB?retryWrites=true&w=majority`;

module.exports = {
  name: "newgame",
  description: "Cria uma ficha de personagem na DB",
  async execute(message, args) {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        dbName: "charDB",
      })
      .then(() => console.log("Database Connected"))
      .catch((err) => console.log(err));

    const userName = message.author.username;
    const userID = message.author.id;

    CharDB.find({ userID: userID }, (err, data) => {
      console.log(data)
      if (data[0] != undefined) {
        message.channel.send(
          `❌ Você já possui um personagem em nossa base de dados, utilize o comando !char para acessa-lo.`
        );
      } else {
        //Cria uma novo char
        const char = new CharDB({
          userName: userName,
          userID: userID,
          lastCommand: message.createdAt,
          gold: "500",
          charLvl: "0",
          potion: "1",
        });

        char.equipedItems.weapom = "Knife";
        char.equipedItems.shield = "(Empty)";
        console.log(char);

        //sobe o novo char para a DB
        char
          .save()
          .then((res) => {
            console.log(res);
            //render resposta
            message.channel.send(
              "⚔ Seu personagem foi criado! - utilize o comando !char para ver seu personagem."
            );
          })
          .catch((err) => console.log(err));
      }
    });
  },
};
