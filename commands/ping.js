module.exports = {
  name: 'ping',
  description: 'Responde pong e dá a latência',
  execute(message, args){
    message.channel.send(`Pong!`)
  }
}