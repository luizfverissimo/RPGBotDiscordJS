const mongoose = require("mongoose");

const charSchema = mongoose.Schema({
  userName: String,
  userID: String,
  charLvl: {
    type: String,
    defaut: "0"
  },
  gold: {
    type: String,
    defaut: "500"
  },
  potion: {
    type: String,
    defaut: "1"
  },
  equipedItems: {
    rightHand: String,
    leftHand: String
  },
  backpack: {
    slot1: String,
    slot2: String,
    Slot3: String
  },
  lastCommand: String
});

module.exports = mongoose.model('CharDB', charSchema)