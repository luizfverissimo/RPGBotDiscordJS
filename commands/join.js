const Discord = require("discord.js");

module.exports = {
  name: "join",
  description: "simula a entrada de um membro no canal.",
  async execute(message, args) {
    client.emit('guildMemberAdd', message.member);
  },
};
