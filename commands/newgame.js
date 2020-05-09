const CharDB = require('../models/charDB.js')
const Discord = require('discord.js')
const mongoose = require('mongoose')

const uri = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@cluster0-v4wt0.gcp.mongodb.net/charDB?retryWrites=true&w=majority`

mongoose
     .connect( uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, dbName: 'charDB'},)
     .then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));


module.exports = {
  name: 'newgame',
  description: 'Cria uma ficha de personagem na DB',
  async execute(message, args){
    //Cria uma novo char
    try {
      await CharDB.create({
      username: `${message.author.username}`,
      userid: "teste123",
      lastCommand: message.createAt,
      gold: "10000"
      })
      console.log('criou?')
      message.channel.send('⚔ Seu personagem foi criado!')
    }
    catch(err){
      console.log(err)
    }

    //sobe o novo char para a DB
    /*
    char.save()
    .then(res => {
      console.log(res)
      //render resposta
      message.channel.send('⚔ Seu personagem foi criado!')
    })      
    .catch(err => console.log(err))
    */
  }
}