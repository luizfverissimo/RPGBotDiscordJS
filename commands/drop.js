const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {
  name: "drop",
  description:
    "dropa um equipamento e abre espaço no invetário - necessita selecionar o slot e confirmar.",
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
            if (args[0] && args[0].includes("slot") && args.length < 3) {
              const slotItem = char.backpack[args[0]];

              if (slotItem.nome === "Vazio") {
                message.reply(
                  "Você precisa escolher um slot que possua um item."
                ).delete({ timeout: 5000 });
              } else if (slotItem.nome !== "Vazio") {

                //render caso não add yes
                const renderItemDrop = new Discord.MessageEmbed()
                  .setColor("#e68612")
                  .setTitle(`📦 Você deseja largar o item ${slotItem.nome}? ⬇`)
                  .addFields(
                    {
                      name: "Atributos:",
                      value: `ATK:${slotItem.atk}, DMG: ${slotItem.dmg}, DEF: ${slotItem.def}, RES: ${slotItem.res}, VAL: ${slotItem.val} gp`,
                    },
                    {
                      name: "\u200b",
                      value: `Clique em ✅ ou utilize o comando **!drop slotX yes** para confirmar o descarte do item!.`,
                    }
                  );

                //render caso seja aceito o drop
                const renderDrop = () => {
                  const renderItemDroped = new Discord.MessageEmbed()
                    .setColor("#e68612")
                    .setTitle(`📦 Você largou o item ${slotItem.nome}? ⬇`)
                    .addFields({
                      name: "\u200b",
                      value: `Utilize o comando **!take** para guarda o item segurado na mochila!.`,
                    });

                  message.channel
                    .send(renderItemDroped)
                    .then((msg) => msg.delete({ timeout: 10000 }));

                  //retira o item da DB
                  slotItem.nome = "Vazio";
                  slotItem.tipo = "Vazio";
                  slotItem.atk = 0;
                  slotItem.dmg = 0;
                  slotItem.res = 0;
                  slotItem.def = 0;
                  slotItem.val = 0;

                  //salvar na DB
                  char.save();
                };

                //comando caso não tenha yes
                let msgBot
                if (!args[1]) {
                  msgBot = await message.channel.send(renderItemDrop);
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
                        renderDrop();
                      } else {
                        message
                          .reply("Você não descartou o item.")
                          .then((msg) => msg.delete({ timeout: 10000 }));
                      }
                    })
                    .catch(() =>
                      message
                        .reply("Tempo esgotado!")
                        .then((msg) => msg.delete({ timeout: 10000 }))
                    );

                    await msgBot.delete({ timeout: 10000 });
                }

                //caso tenha yes
                if (args[1] === "yes") {
                  renderDrop();

                }

                
              }
            } else {
              message
                .reply(
                  "Você precisa definir o slot do inventário que deseja largar, somente um slot por vez. (!drop slot1, por exemplo)"
                )
                .then((msg) => msg.delete({ timeout: 10000 }));
            }
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
