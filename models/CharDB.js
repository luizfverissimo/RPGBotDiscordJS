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
    arma:{
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      val: Number
    },
    escudo:{
      nome: String,
      tipo: String,
      def: Number,
      val: Number
    },
    armadura:{
      nome: String,
      tipo: String,
      res: Number,
      val: Number
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
    emCombate: Boolean,
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
  itemRecebido: {
    nome: String,
    tipo: String,
    atk: String,
    dmg: String,
    def: String,
    res: String,
    val: String
  },

  mktLista:{
    item1: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
    },
    item2: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
    },
    item2: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
    },
    item3: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
    },
    item4: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
    },
    item5: {
      nome: String,
      tipo: String,
      atk: Number,
      dmg: Number,
      def: Number,
      res: Number,
      val: Number
    },
  }
});

module.exports = mongoose.model('CharDB', charSchema)