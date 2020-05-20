const Discord = require("discord.js");

module.exports = {
  name: "dell",
  description:
    "Deleta o char da DB",
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
        CharDB.findOne({ userID: message.author.id }, async (err, char) => {
          if (err) console.log(err);
          if (char != undefined) {

            const dellChar = () => {
              CharDB.findOneAndDelete(
                { userID: message.author.id },
                (err, char) => {
                  if (err) console.log(err);
                  if (char === undefined) {
                    message.reply('O seu personagem foi deletado, caso queria criar um novo personagem utilize o comando **!newgame**.').then((msg) => msg.delete({ timeout: 10000 }))
                  } else {
                    message.reply('O seu personagem foi deletado, caso queria criar um novo personagem utilize o comando **!newgame**.').then((msg) => msg.delete({ timeout: 10000 }))
                  }
                }
              );
            };

            const renderConfirm = new Discord.MessageEmbed()
              .setColor("#e68612")
              .setTitle(`‼ Você Deletar o seu personagem? ‼`)
              .addFields(
                {
                  name: "\u200b",
                  value: `**Atenção, o seu personagem irá ser apagado de nossa base de dados e você irá perder todos seus itens, experiência e ouro.**`,
                },
                {
                  name: "\u200b",
                  value: `Clique em ✅ para confirmar!`,
                }
              );

            let msgBot = await message.channel
              .send(renderConfirm)
            await msgBot.react("✅");
            await msgBot.react("❌");

            const filterReaction = (reaction, user) => {
              if (
                ["✅", "❌"].includes(reaction.emoji.name) &&
                user.id === message.author.id
              ) {
                console.log("filtrou");
                return true;
              }
            };

            msgBot
              .awaitReactions(filterReaction, {
                max: 1,
                time: 10000,
              })
              .then((collected) => {
                const reaction = collected.first();

                if (reaction.emoji.name === "✅") {
                  dellChar()
                } else {
                  message
                    .reply("🙏 Você não deletou seu personagem.")
                    .then((msg) => msg.delete({ timeout: 5000 }));
                }
              })
              .catch(() =>
                message
                  .reply("Tempo esgotado!")
                  .then((msg) => msg.delete({ timeout: 5000 }))
              );

            await msgBot.delete({ timeout: 10000 });

          } else {
            message
              .reply(
                "Você não possui personagem criado, utilize o comando **!newgame** para criar um novo personagem."
              )
              .then((msg) => msg.delete({ timeout: 10000 }));
          }
        });
      })
      .catch((err) => console.log(err));
  },
};
