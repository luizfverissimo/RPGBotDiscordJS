const mongoose = require("mongoose");
const Schema = mongoose.Schema

const charSchema = Schema({
  userName: String,
  userID: String,
  charLvl: {
    currLvl: Number,
    currXp: Number,
    xpNextLvl: Number
  },
  hitPoints:{
    maxHp: Number,
    currHp: Number
  },
  gold: Number,
  potions:{
    maxPotions: Number,
    currPotions: Number
  },
  equipedItems: {
    weapon:{
      weaponName: String,
      weaponAtk: Number,
      weaponDmg: Number,
      weaponValue: Number
    },
    shield:{
      shieldName: String,
      shieldDef: Number,
      shieldValue: Number
    },
    armor:{
      armorName: String,
      armorRes: Number,
      armorValue: Number
    }
  },
  backpack: {
    maxSlots: Number,
    slot1: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number
    },
    slot2: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number
    },
    slot3: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number
    },
    slot4: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number
    },
    slot5: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number
    },
  },
  engCreature:{
    creatureName: String,
    creatureHp: {
      maxHp: Number,
      currHp: Number
    },
    creatureWeapon:{
      nome: String,
      atk: Number,
      dmg: Number,
    },
    creatureArmor:{
      res: Number,
    }
  },
});

module.exports = mongoose.model('CharDB', charSchema)