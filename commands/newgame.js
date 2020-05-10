const CharDB = require("../models/CharDB.js");
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

    CharDB.findOne({ userID: userID }, (err, data) => {
      if (data != undefined) {
        message.channel.send(
          `❌ Você já possui um personagem em nossa base de dados, utilize o comando !char para acessa-lo.`
        );
      } else {
        //Cria uma novo char
        const char = new CharDB({
          userName: userName,
          userID: userID,
        });
        
        char.charLvl.currLvl = 0
        char.charLvl.currXp = 0
        char.charLvl.xpNextLvl = 100
        char.hitPoints.maxHp = 20
        char.hitPoints.currHp = 20
        char.gold = 500
        char.potions.maxPotions = 5
        char.potions.currPotions = 1
        char.equipedItems.weapon.weaponName = 'Faca enferrujada'
        char.equipedItems.weapon.weaponAtk = 1
        char.equipedItems.weapon.weaponDmg = 1
        char.equipedItems.weapon.weaponValue = 1
        char.equipedItems.shield.shieldName = 'Vazio'
        char.equipedItems.shield.shieldDef = 0
        char.equipedItems.armor.armorName = 'Vazio'
        char.equipedItems.armor.armorRes = 0
        char.backpack.maxSlots = 5
        char.backpack.slot1.nome = "Vazio"
        char.backpack.slot2.nome = "Vazio"
        char.backpack.slot3.nome = "Vazio"
        char.backpack.slot4.nome = "Vazio"
        char.backpack.slot5.nome = "Vazio"
        char.engCreature.creatureName = 'Não está em combate.'
        char.engCreature.creatureHp.maxHp = 0
        char.engCreature.creatureHp.currHp = 0
        char.engCreature.creatureWeapon.nome = 'Vazio'
        char.engCreature.creatureWeapon.atk = 0
        char.engCreature.creatureWeapon.dmg = 0
        char.engCreature.creatureArmor.res = 0

        //sobe o novo char para a DB
        char
          .save()
          .then((res) => {
            console.log(res);
            //render resposta
            message.channel.send(
              "⚔ Seu personagem foi criado! - utilize o comando **!char** para ver seu personagem."
            );
          })
          .catch((err) => console.log(err));
      }
    });
  },
};
