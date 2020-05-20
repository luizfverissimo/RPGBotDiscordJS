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
        ).then((msg) => msg.delete({ timeout: 10000 }));
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
        //slots
        Object.keys(char.backpack).some((el) => {
          char.backpack[el].nome = "Vazio";
          char.backpack[el].tipo = "Vazio";
          char.backpack[el].atk = 0
          char.backpack[el].dmg = 0
          char.backpack[el].def = 0
          char.backpack[el].res = 0
          char.backpack[el].val = 0
        });
        
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
        Object.keys(char.mktLista).some((el) => {
          char.mktLista[el].nome = "Vazio";
          char.mktLista[el].tipo = "Vazio";
          char.mktLista[el].atk = 0
          char.mktLista[el].dmg = 0
          char.mktLista[el].def = 0
          char.mktLista[el].res = 0
          char.mktLista[el].val = 0
        });

        //cria lista inicial de itens
        let lista = new ItemList(char.charLvl.currLvl);
        lista.generateLista(lista.dificuldade);

        Object.keys(char.mktLista && lista.lista).some((el) => {
          char.mktLista[el].nome = lista.lista[el].nome;
          char.mktLista[el].tipo = lista.lista[el].tipo;
          char.mktLista[el].atk = lista.lista[el].atk;
          char.mktLista[el].dmg = lista.lista[el].dmg;
          char.mktLista[el].def = lista.lista[el].def;
          char.mktLista[el].res = lista.lista[el].res;
          char.mktLista[el].val = lista.lista[el].val;
        });

        //sobe o novo char para a DB
        char
          .save()
          .then((res) => {
            console.log(res);
            //render resposta
            message.reply(
              "⚔ Seu personagem foi criado! - utilize o comando **!char** para ver seu personagem."
            ).then((msg) => msg.delete({ timeout: 10000 }));
          })
          .catch((err) => console.log(err));
      }
    });
  },
};
