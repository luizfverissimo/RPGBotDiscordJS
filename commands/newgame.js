const CharDB = require("../models/CharDB.js");
const mongoose = require("mongoose");
const ItemList = require('../classes/ItemList')

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

    CharDB.findOne({ userID: userID }, (err, data) => {
      if (data != undefined) {
        message.reply(
          `❌ Você já possui um personagem em nossa base de dados, utilize o comando !char para acessa-lo.`
        );
      } else {
        //Cria uma novo char
        const char = new CharDB({
          userName: userName,
          userID: userID,
        });
        //lvl system
        char.charLvl.currLvl = 0;
        char.charLvl.currXp = 0;
        char.charLvl.xpNextLvl = 100;
        //hitpoit
        char.hitPoints.maxHp = 20;
        char.hitPoints.currHp = 20;
        //gold
        char.gold = 500;
        //potions
        char.potions.maxPotions = 5;
        char.potions.currPotions = 1;
        //equiped arma
        char.equipedItems.arma.nome = "Faca enferrujada";
        char.equipedItems.arma.tipo = "arma";
        char.equipedItems.arma.atk = 1;
        char.equipedItems.arma.dmg = 1;
        char.equipedItems.arma.val = 1;
        //equiped escudo
        char.equipedItems.escudo.nome = "Vazio";
        char.equipedItems.escudo.tipo = "Vazio";
        char.equipedItems.escudo.def = 0;
        char.equipedItems.escudo.val = 0;
        //equiped armadura
        char.equipedItems.armadura.nome = "Vazio";
        char.equipedItems.armadura.tipo = "Vazio";
        char.equipedItems.armadura.res = 0;
        char.equipedItems.armadura.val = 0;
        //backpack
        char.backpack.maxSlots = 5;
        //slot1
        char.backpack.slot1.nome = "Vazio";
        char.backpack.slot1.tipo = "Vazio";
        char.backpack.slot1.atk = 0;
        char.backpack.slot1.dmg = 0;
        char.backpack.slot1.def = 0;
        char.backpack.slot1.res = 0;
        char.backpack.slot1.val = 0;
        //slot2
        char.backpack.slot2.nome = "Vazio";
        char.backpack.slot2.tipo = "Vazio";
        char.backpack.slot2.atk = 0;
        char.backpack.slot2.dmg = 0;
        char.backpack.slot2.def = 0;
        char.backpack.slot2.res = 0;
        char.backpack.slot2.val = 0;
        //slot3
        char.backpack.slot3.nome = "Vazio";
        char.backpack.slot3.tipo = "Vazio";
        char.backpack.slot3.atk = 0;
        char.backpack.slot3.dmg = 0;
        char.backpack.slot3.def = 0;
        char.backpack.slot3.res = 0;
        char.backpack.slot3.val = 0;
        //slot4
        char.backpack.slot4.nome = "Vazio";
        char.backpack.slot4.tipo = "Vazio";
        char.backpack.slot4.atk = 0;
        char.backpack.slot4.dmg = 0;
        char.backpack.slot4.def = 0;
        char.backpack.slot4.res = 0;
        char.backpack.slot4.val = 0;
        //slot5
        char.backpack.slot5.nome = "Vazio";
        char.backpack.slot5.tipo = "Vazio";
        char.backpack.slot5.atk = 0;
        char.backpack.slot5.dmg = 0;
        char.backpack.slot5.def = 0;
        char.backpack.slot5.res = 0;
        char.backpack.slot5.val = 0;
        //creature
        char.engCreature.creatureName = "Não está em combate.";
        char.engCreature.emCombate = false;
        char.engCreature.creatureHp.maxHp = 0;
        char.engCreature.creatureHp.currHp = 0;
        char.engCreature.creatureWeapon.nome = "Vazio";
        char.engCreature.creatureWeapon.atk = 0;
        char.engCreature.creatureWeapon.dmg = 0;
        char.engCreature.creatureArmor.res = 0;

        //item recebido
        char.itemRecebido.nome = "Vazio";
        char.itemRecebido.tipo = "Vazio";
        char.itemRecebido.atk = 0;
        char.itemRecebido.dmg = 0;
        char.itemRecebido.def = 0;
        char.itemRecebido.res = 0;
        char.itemRecebido.val = 0;

        //add lista de itens do mercado

        char.mktLista.item1.nome = "Vazio"
        char.mktLista.item1.tipo = 'Vazio'
        char.mktLista.item1.atk = 0
        char.mktLista.item1.dmg = 0
        char.mktLista.item1.def = 0
        char.mktLista.item1.res = 0
        char.mktLista.item1.val = 0

        char.mktLista.item2.nome = "Vazio"
        char.mktLista.item2.tipo = "Vazio"
        char.mktLista.item2.atk = 0
        char.mktLista.item2.dmg = 0
        char.mktLista.item2.def = 0
        char.mktLista.item2.res = 0
        char.mktLista.item2.val = 0

        char.mktLista.item3.nome = "Vazio"
        char.mktLista.item3.tipo = "Vazio"
        char.mktLista.item3.atk = 0
        char.mktLista.item3.dmg = 0
        char.mktLista.item3.def = 0
        char.mktLista.item3.res = 0
        char.mktLista.item3.val = 0

        char.mktLista.item4.nome = "Vazio"
        char.mktLista.item4.tipo = "Vazio"
        char.mktLista.item4.atk = 0
        char.mktLista.item4.dmg = 0
        char.mktLista.item4.def = 0
        char.mktLista.item4.res = 0
        char.mktLista.item4.val = 0

        char.mktLista.item5.nome = "Vazio"
        char.mktLista.item5.tipo = "Vazio"
        char.mktLista.item5.atk = 0
        char.mktLista.item5.dmg = 0
        char.mktLista.item5.def = 0
        char.mktLista.item5.res = 0
        char.mktLista.item5.val = 0

        //cria lista inicial de itens
        let lista = new ItemList(char.charLvl.currLvl);
        lista.generateLista(lista.dificuldade);

        console.log(lista)
        console.log(char.mktLista)

        char.mktLista.item1.nome = lista.lista.item1.nome
        char.mktLista.item1.tipo = lista.lista.item1.tipo
        char.mktLista.item1.atk = lista.lista.item1.atk
        char.mktLista.item1.dmg = lista.lista.item1.dmg
        char.mktLista.item1.def = lista.lista.item1.def
        char.mktLista.item1.res = lista.lista.item1.res
        char.mktLista.item1.val = lista.lista.item1.val

        char.mktLista.item2.nome = lista.lista.item2.nome
        char.mktLista.item2.tipo = lista.lista.item2.tipo
        char.mktLista.item2.atk = lista.lista.item2.atk
        char.mktLista.item2.dmg = lista.lista.item2.dmg
        char.mktLista.item2.def = lista.lista.item2.def
        char.mktLista.item2.res = lista.lista.item2.res
        char.mktLista.item2.val = lista.lista.item2.val

        char.mktLista.item3.nome = lista.lista.item3.nome
        char.mktLista.item3.tipo = lista.lista.item3.tipo
        char.mktLista.item3.atk = lista.lista.item3.atk
        char.mktLista.item3.dmg = lista.lista.item3.dmg
        char.mktLista.item3.def = lista.lista.item3.def
        char.mktLista.item3.res = lista.lista.item3.res
        char.mktLista.item3.val = lista.lista.item3.val

        char.mktLista.item4.nome = lista.lista.item4.nome
        char.mktLista.item4.tipo = lista.lista.item4.tipo
        char.mktLista.item4.atk = lista.lista.item4.atk
        char.mktLista.item4.dmg = lista.lista.item4.dmg
        char.mktLista.item4.def = lista.lista.item4.def
        char.mktLista.item4.res = lista.lista.item4.res
        char.mktLista.item4.val = lista.lista.item4.val

        char.mktLista.item5.nome = lista.lista.item5.nome
        char.mktLista.item5.tipo = lista.lista.item5.tipo
        char.mktLista.item5.atk = lista.lista.item5.atk
        char.mktLista.item5.dmg = lista.lista.item5.dmg
        char.mktLista.item5.def = lista.lista.item5.def
        char.mktLista.item5.res = lista.lista.item5.res
        char.mktLista.item5.val = lista.lista.item5.val

        

        //sobe o novo char para a DB
        char
          .save()
          .then((res) => {
            console.log(res);
            //render resposta
            message.reply(
              "⚔ Seu personagem foi criado! - utilize o comando **!char** para ver seu personagem."
            );
          })
          .catch((err) => console.log(err));
      }
    });
  },
};
