const Discord = require ('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const fs = require('fs')



//////////////////////////////////////////////////////////////////////////////
//BOT LOGIN:
client.login(config.token)


client.on('ready', () => {
  console.log(`Bot foi inicializado!`)
})

//Cria uma coleção no discord e lê os arquivos de comandos
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

//loop adicionando os diferentes comandos no collection
for(const file of commandFiles){
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

//////////////////////////////////////////////////////////////////////////////
//COMANDOS

//Listner para os comandos no chat
client.on('message', async message => {
  if(!message.content.startsWith(config.prefix) || message.author.bot) return

  const args = message.content.slice(config.prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  if(!client.commands.has(command)) return


  //pega o comando e executa a função do arquivo de comando
  try {
    client.commands.get(command).execute(message, args)
  } catch (error){
    console.log(error)
    message.reply('Ocorreu um erro tentando executar seu comando! Tente novamente.')
  }
})




