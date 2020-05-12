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
            if (args[0] && args.length < 2) {
              const slotItem = char.backpack[args[0]];
              console.log(slotItem);

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
                );
              } else if (slotItem.tipo === "arma") {
                //armazena as informações do item equipado
                const equipedNome = char.equipedItems.weapon.weaponName;
                const equipedTipo = char.equipedItems.weapon.weaponType;
                const equipedAtk = char.equipedItems.weapon.weaponAtk;
                const equipedDmg = char.equipedItems.weapon.weaponDmg;
                const equipedVal = char.equipedItems.weapon.weaponValue;

                //render a troca - está antes de trocar os itens
                message.channel.send(
                  renderTrocaItem(equipedNome, equipedTipo, slotItem)
                );

                //adicionar as informações do slot para o item equipado
                char.equipedItems.weapon.weaponName = slotItem.nome;
                char.equipedItems.weapon.weaponType = slotItem.tipo;
                char.equipedItems.weapon.weaponAtk = slotItem.atk;
                char.equipedItems.weapon.weaponDmg = slotItem.dmg;
                char.equipedItems.weapon.weaponValue = slotItem.val;

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
                const equipedNome = char.equipedItems.shield.shieldName;
                const equipedTipo = char.equipedItems.shield.shieldType;
                const equipedDef = char.equipedItems.shield.shieldDef;
                const equipedVal = char.equipedItems.shield.shieldValue;

                //render a troca - está antes de trocar os itens
                message.channel.send(
                  renderTrocaItem(equipedNome, equipedTipo, slotItem)
                );

                //adicionar as informações do slot para o item equipado
                char.equipedItems.shield.shieldName = slotItem.nome;
                char.equipedItems.shield.shieldType = slotItem.tipo;
                char.equipedItems.shield.shieldDef = slotItem.def;
                char.equipedItems.shield.shieldValue = slotItem.val;

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
                const equipedNome = char.equipedItems.armor.armorName;
                const equipedTipo = char.equipedItems.armor.armorType;
                const equipedRes = char.equipedItems.armor.armorRes;
                const equipedVal = char.equipedItems.armor.armorValue;

                //render a troca - está antes de trocar os itens
                message.channel.send(
                  renderTrocaItem(equipedNome, equipedTipo, slotItem)
                );

                //adicionar as informações do slot para o item equipado
                char.equipedItems.armor.armorName = slotItem.nome;
                char.equipedItems.armor.armorType = slotItem.tipo;
                char.equipedItems.armor.armorRes = slotItem.res;
                char.equipedItems.armor.armorValue = slotItem.val;

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
