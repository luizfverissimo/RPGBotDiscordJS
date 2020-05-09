const mongoose = require("mongoose");
const Schema = mongoose.Schema

const charSchema = Schema({
  userName: String,
  userID: String,
  charLvl: String,
  gold: String,
  potion: String,
  equipedItems: {
    weapom: String,
    shield: String
  },
  backpack: {
    slot1: String,
    slot2: String,
    Slot3: String
  },
  lastCommand: String
});

module.exports = mongoose.model('CharDB', charSchema)