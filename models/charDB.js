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
      weaponType: String,
      weaponAtk: Number,
      weaponDmg: Number,
      weaponValue: Number
    },
    shield:{
      shieldName: String,
      shieldType: String,
      shieldDef: Number,
      shieldValue: Number
    },
    armor:{
      armorName: String,
      armorType: String,
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
      res: Number,
      val: Number
    },
    slot2: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
    },
    slot3: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
    },
    slot4: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
    },
    slot5: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
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