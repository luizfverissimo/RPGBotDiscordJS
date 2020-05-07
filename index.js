const Discord = require ('discord.js')
const client = new Discord.Client()
const config = require('./config.json')

//////////////////////////////////////////////////////////////////////////////
//BOT LOGIN:
client.login(config.token)


client.on('ready', () => {
  console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, no servidor ${client.guilds.name} com ID: ${client.guilds.id}`)
})

//////////////////////////////////////////////////////////////////////////////
//COMANDOS

client.on('message', async message => {
  if(message.author.bot) return
  if(message.author.type === 'dm') return

  const args = message.content.slice(config.prefix.length).split(/ +/g)
  const comando = args.shift().toLowerCase()

  if (comando === 'ping'){
    const m = await message.channel.send('Ping?')
    m.edit(`Pong! A latência é de ${m.createdTimestamp - message.createdTimestamp} ms!`)
  }


//////////////////////////////////////////////////////////////////////////////
//COMANDO DE ROLAGEM
  if (comando === 'roll' && args){
    const dice = parseInt(args[0].replace(/[d]+/g, ''))//retira o d e deixa somento o número
    const roll = Math.floor(Math.random() * dice) + 1

    if(dice >= 2 && dice <= 100){
      message.channel.send(`🎲 Você rolou um **D${dice}** e tirou **${roll}**!`)
      if (roll === dice) message.channel.send(`**Sucesso crítico!** você tirou ${roll}! 👑`);
      if(roll === 1) message.channel.send(`**Falha crítica!** você tirou ${roll}! 😢`);
    } else {
      message.channel.send(`Adicione um valor válido de dado, D2, D4, D6, D8, D10, D12, D16, D20, D50 ou D100.`)
    }
  }
})




