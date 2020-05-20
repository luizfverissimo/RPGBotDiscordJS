const Discord = require("discord.js");

module.exports = {
  name: "equip",
  description: "Equipa um item do inventário - necessita dizer o slot",
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
            if (args[0].includes('slot') && args.length < 2) {
              const slotItem = char.backpack[args[0]];

              const renderTrocaItem = (velhoNome, velhoTipo, novo) => {
                //criando msg de troca de item
                const renderMsg = new Discord.MessageEmbed()
                  .setColor("#e68612")
                  .setTitle(`📦 Você equipou um item! 🔄`)
                  .addFields(
                    {
                      name: "Equipado:",
                      value: `Nome: ${novo.nome} - tipo: ${novo.tipo}`,
                      inline: true,
                    },
                    {
                      name: "Desequipado:",
                      value: `Nome: ${velhoNome} - tipo: ${velhoTipo}`,
                      inline: true,
                    }
                  );
                return renderMsg;
              };

              if (slotItem.nome === "Vazio") {
                message.reply(
                  "O slot que você tentou equipar não possui um item, selecione um slot válido."
                ).then((msg) => msg.delete({ timeout: 10000 }));
              } else if (slotItem.tipo === "arma") {
                //armazena as informações do item equipado
                const equipedNome = char.equipedItems.arma.nome;
                const equipedTipo = char.equipedItems.arma.tipo;
                const equipedAtk = char.equipedItems.arma.atk;
                const equipedDmg = char.equipedItems.arma.dmg;
                const equipedVal = char.equipedItems.arma.val;

                //render a troca - está antes de trocar os itens
                message.channel.send(
                  renderTrocaItem(equipedNome, equipedTipo, slotItem)
                )
                .then((msg) => msg.delete({ timeout: 10000 }));

                //adicionar as informações do slot para o item equipado
                char.equipedItems.arma.nome = slotItem.nome;
                char.equipedItems.arma.tipo = slotItem.tipo;
                char.equipedItems.arma.atk = slotItem.atk;
                char.equipedItems.arma.dmg = slotItem.dmg;
                char.equipedItems.arma.val = slotItem.val;

                //adicionar as informações salvas do item equipado para o slot
                char.backpack[args[0]].nome = equipedNome;
                char.backpack[args[0]].tipo = equipedTipo;
                char.backpack[args[0]].atk = equipedAtk;
                char.backpack[args[0]].dmg = equipedDmg;
                char.backpack[args[0]].def = 0;
                char.backpack[args[0]].res = 0;
                char.backpack[args[0]].val = equipedVal;

              } else if (slotItem.tipo === "escudo") {
                //armazena as informações do item equipado
                const equipedNome = char.equipedItems.escudo.nome;
                const equipedTipo = char.equipedItems.escudo.tipo;
                const equipedDef = char.equipedItems.escudo.def;
                const equipedVal = char.equipedItems.escudo.val;

                //render a troca - está antes de trocar os itens
                message.channel.send(
                  renderTrocaItem(equipedNome, equipedTipo, slotItem)
                )
                .then((msg) => msg.delete({ timeout: 10000 }));

                //adicionar as informações do slot para o item equipado
                char.equipedItems.escudo.nome = slotItem.nome;
                char.equipedItems.escudo.tipo = slotItem.tipo;
                char.equipedItems.escudo.def = slotItem.def;
                char.equipedItems.escudo.val = slotItem.val;

                //adicionar as informações salvas do item equipado para o slot
                char.backpack[args[0]].nome = equipedNome;
                char.backpack[args[0]].tipo = equipedTipo;
                char.backpack[args[0]].atk = 0;
                char.backpack[args[0]].dmg = 0;
                char.backpack[args[0]].def = equipedDef;
                char.backpack[args[0]].res = 0;
                char.backpack[args[0]].val = equipedVal;
                
              } else if (slotItem.tipo === "armadura") {
                //armazena as informações do item equipado
                const equipedNome = char.equipedItems.armadura.nome;
                const equipedTipo = char.equipedItems.armadura.tipo;
                const equipedRes = char.equipedItems.armadura.res;
                const equipedVal = char.equipedItems.armadura.val;

                //render a troca - está antes de trocar os itens
                message.channel.send(
                  renderTrocaItem(equipedNome, equipedTipo, slotItem)
                )
                .then((msg) => msg.delete({ timeout: 10000 }));

                //adicionar as informações do slot para o item equipado
                char.equipedItems.armadura.nome = slotItem.nome;
                char.equipedItems.armadura.tipo = slotItem.tipo;
                char.equipedItems.armadura.res = slotItem.res;
                char.equipedItems.armadura.val = slotItem.val;

                //adicionar as informações salvas do item equipado para o slot
                char.backpack[args[0]].nome = equipedNome;
                char.backpack[args[0]].tipo = equipedTipo;
                char.backpack[args[0]].atk = 0;
                char.backpack[args[0]].dmg = 0;
                char.backpack[args[0]].def = 0;
                char.backpack[args[0]].res = equipedRes;
                char.backpack[args[0]].val = equipedVal;
              }

              //salvar na DB
              char
                .save()
                .then((res) => {})
                .catch((err) => {
                  console.log(err);
                });
            } else {
              message.reply(
                "Você precisa definir o slot do inventário que deseja equipar, somente um slot por vez. (!equip slot1, por exemplo)"
              ).then((msg) => msg.delete({ timeout: 10000 }));
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
