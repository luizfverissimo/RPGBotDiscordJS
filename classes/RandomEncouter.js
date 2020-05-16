const ItemMaker = require("./item_maker");
const Discord = require("discord.js");

class RandomEncounter {
  constructor(lvl) {
    this.dificuldade = lvl + 1;
  }

  generateRandom(dificuldade) {
    //Cria a string do encontro
    const inicioString = [
      "Você se deparou com um(a)",
      "Você encontrou um(a)",
      "Caiu em sua frente um(a)",
      "Você tropeceu em um(a)",
      "Você achou uma(a)",
      "Atrás de você surge magicamente um(a)",
      "Cai do teto da cripta um(a)",
      "Em uma luz no funda da sala há um(a)",
      "Atrás de escombros você encontra um(a)",
    ];

    const randomInicio = inicioString[Math.floor(Math.random() * inicioString.length)];

    const objString = [
      "baú",
      "bolsa",
      "mochila",
      "embrulho",
      "sacola",
      "caixa",
      "urna",
      "vaso",
      "barril",
      "caixote",
      "caixa",
      "cofre",
    ];

    const randomObj = objString[Math.floor(Math.random() * objString.length)];

    const adjetivoString = [
      "sujo(a)",
      "estragado(a)",
      "quebrado(a)",
      "despedaçado(a)",
      "brilhante",
      "novo(a)",
      "reluzente",
      "de outro mundo",
      "reforçado(a)",
      "com inscrições",
    ];

    const randomAdjetivo = adjetivoString[Math.floor(Math.random() * adjetivoString.length)];

    //string final do encontro
    const stringFinal = `🔎 ${randomInicio} ${randomObj} ${randomAdjetivo}!`;
    this.texto = stringFinal
    //gera loot do encontro
    //1 = gold
    //2 = arma na dificuldade
    //3 = arma boa
    //4 = poção de cura
    //5 = it's a trappppp!
    const randomLoot = Math.floor(Math.random() * 5) + 1;

    const goldGenerator = (dificuldade) => {
      const min = 10;
      const max = 20;
      const gold = Math.floor(Math.random() * (max - min) + min) * dificuldade;

      return gold
    }

    const armaGenerator = (dificuldade) =>{
      let item = new ItemMaker(dificuldade);
      item.seletorType();
      item.seletorVariety();
      item.seletorAdjective();
      item.setName();
      item.seletorStatus(this.dificuldade);
      item.seletorVal();

      return item
    }

    if (randomLoot === 1) {
      this.isGold = true;      
      this.gold = goldGenerator(this.dificuldade);
      

    } else if (randomLoot === 2) {
      this.isArma = true;

      let item = armaGenerator(this.dificuldade)      

      this.nome = item.nome
      this.tipo = item.tipo
      this.atk = item.atk
      this.dmg = item.dmg
      this.def = item.def
      this.res = item.res
      this.val = item.val


    } else if (randomLoot === 3){
      this.isArma = true;
      let item = armaGenerator(this.dificuldade + 1)      

      this.nome = item.nome
      this.tipo = item.tipo
      this.atk = item.atk
      this.dmg = item.dmg
      this.def = item.def
      this.res = item.res
      this.val = item.val


    } else if (randomLoot === 4) {
      this.isPotion = true;
      this.potion = Math.floor(Math.random() * 2) + 1

    } else if (randomLoot === 5){
      this.isTrap = true
      this.dano = Math.floor((Math.random() * 2) + 1) * dificuldade
    }
  }
}

module.exports = RandomEncounter
