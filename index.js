require('dotenv').config()
const Discord = require ('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const fs = require('fs')

//////////////////////////////////////////////////////////////////////////////
//BOT LOGIN:
client.login(`${process.env.DISCORD_TOKEN}`)


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
  //teste
  if (message.content === 'join') {
		client.emit('guildMemberAdd', message.member);
	}

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

  message.delete({ timeout: 10000 })
})

//////////////////////////////////////////////////////////////////////////////
//MEMBER JOIN EVENT

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;

  const render =  new Discord.MessageEmbed()
  .setColor("#e68612")
  .setTitle(`🏯 Seja bem-vindo à Tristan, ${member}! 🏯`)
  .setDescription('Terra de aventuras, itens preciosos e criaturas horrendas. Tente a sua sorte nas criptas e se torne o guerreiro mais famoso de Tristan ou morra tentando!')
  .addFields(
    {
      name: "\u200b",
      value: `🧙‍♂️ Utilize o comando **!newgame** para criar seu guerreiro e iniciar a sua aventura.`,
    },
    {
      name: "\u200b",
      value: `📜 A qualquer momento você pode utilizar o comando **!help** para ver a lista de comandos.`,
    },
    {
      name: "\u200b",
      value: `🛒 Não se esqueça de ir ao mercado antes de você enfrentar os perigos das criptas.`,
    },
  )
  
  channel.send(render)
})




