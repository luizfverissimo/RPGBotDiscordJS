const Discord = require('discord.js')
//import Creatures from "../models/CharDB"

//////////////////////////////////////////////////////////////////////////////
//Classe de criação da criatura
class Creature{
  constructor(charLvl){
    this.charLvl = charLvl
    this.dificuldade = charLvl + 1
  }

  seletorNome(){
    const listaNomes = ['Aranha', 'Rato Gigante', 'Sapo Gigante', 'Minotauro', 'Esqueleto', 'Abutre Gigante', 'Bandido', 'Demônio', 'Coruja Gigante', 'Bruxa', 'Basilisco', 'Besouro Gigante', 'Carniçal', 'Morto-Vivo', 'Ghoul', 'Ciclope', 'Elemental de fogo', 'Elemental de água', 'Elemental de terra', 'Elemental de vento', 'Escorpiação Gigante', 'Fantasma', 'Nobre Corrompido', 'Sacerdote das profundezas', 'Múmia', 'Sombra', 'Vampiro', 'Verme']

    const nome = listaNomes[Math.floor(Math.random() * listaNomes.length)]
    this.nome = nome
  }

  seletorHp(dificuldade){
    const max = 11 //valor máximo de hp
    const min = 7 //valor mínimo de hp

    const hp = (Math.floor(Math.random() * (max - min)) + min) * dificuldade
    this.maxHp = hp
    this.currHp = hp
  }

  seletorWeapon(dificuldade){
    //Cria nome da arma
    const listaNomes = ['Espada', 'Lança', 'Faca', 'Cutelo', 'Mangual', 'Garras', 'Espinho', 'Foice', 'Espada longa', 'Maça', 'Espeto', 'Tridente']

    const nome = listaNomes[Math.floor(Math.random() * listaNomes.length)]
    this.weaponName = nome

    //Cria bônus de ataque da arma
    const maxAtk = 3 //valor máximo de ataque
    const minAtk = 1 //valor mínimo de ataque

    const atk = (Math.floor(Math.random() * (maxAtk - minAtk)) + minAtk) * dificuldade
    this.atk = atk

    //Cria dano da arma
    const maxDmg = 4 //valor máximo de dano
    const minDmg = 2 //valor mínimo de dano

    const dmg = (Math.floor(Math.random() * (maxDmg - minDmg)) + minDmg) * dificuldade
    this.dmg = dmg
  }

  seletorArmor(dificuldade){
    const max = 3 //valor máximo de armor
    const min = 2 //valor mínimo de amor

    const armor = (Math.floor(Math.random() * (max - min)) + min) * dificuldade
    this.armor = armor
  }
}

//////////////////////////////////////////////////////////////////////////////
//Execução do comando !explore


module.exports = {
  name: "explore",
  description: "explora as criptas e gera um monstro.",
  async execute(message, args) {
    const mongoose = require("mongoose");
    const CharDB = require("../models/CharDB.js");

    const uri = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@cluster0-v4wt0.gcp.mongodb.net/charDB?retryWrites=true&w=majority`;

    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        dbName: "charDB",
      })
      .then(() => {
        console.log("Database Connected - retrieve");
        //procura o cadastro na DB
        CharDB.findOne({ userID: message.author.id }, (err, char) => {
          if (err) console.log(err);
          
          if (char != undefined) {
            //cria a criatura
            const creature = new Creature(char.charLvl.currLvl)
            creature.seletorNome()
            creature.seletorHp(creature.dificuldade)
            creature.seletorWeapon(creature.dificuldade)
            creature.seletorArmor(creature.dificuldade)
            console.log(creature)

            //adiciona a criatura gerada como engajada na db
            char.engCreature.creatureName = creature.nome
            char.engCreature.creatureHp.maxHp = creature.maxHp
            char.engCreature.creatureHp.currHp = creature.currHp
            char.engCreature.creatureWeapon.nome = creature.weaponName
            char.engCreature.creatureWeapon.atk = creature.atk
            char.engCreature.creatureWeapon.dmg = creature.dmg
            char.engCreature.creatureArmor.res = creature.armor
            char.engCreature.emCombate = true

            console.log(char.engCreature)
            char.save()

            //criando msg e encontro com a criatura
            const renderMsg = new Discord.MessageEmbed()
              .setColor("#e01616")
              .setTitle(`Você encontrou um ${char.engCreature.creatureName}!`)
              .addFields(
                {name: '❤ Vida:', value: `${char.engCreature.creatureHp.currHp}/${char.engCreature.creatureHp.maxHp}` , inline: true},
                {name: '⚔ Arma:', value: `${char.engCreature.creatureWeapon.nome} - ATK: ${char.engCreature.creatureWeapon.atk} / DMG: ${char.engCreature.creatureWeapon.dmg}` , inline: true},
                {name: '🛡 Armadura:', value: `RES: ${char.engCreature.creatureArmor.res}`, inline: true},
              )
              

            //render
            message.channel.send(renderMsg)

          } else {
            message.channel.send(
              "Você não possui personagem criado, utilize o comando **!newgame** para criar um novo personagem."
            );
          }
        });
      })
      .catch((err) => console.log(err));
  },
};
