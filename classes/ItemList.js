const ItemMaker = require("./item_maker");
const Discord = require("discord.js");

class ItemList {
  constructor(lvl) {
    this.dificuldade = lvl + 1;
    this.lista = {
      item1: {},
      item2: {},
      item3: {},
      item4: {},
      item5: {},
    };
  }

  generateLista(dificuldade) {
    Object.keys(this.lista).some((el) => {
      //cria um item randômico
      let item = new ItemMaker(this.dificuldade - 1);
      item.seletorType();
      item.seletorVariety();
      item.seletorAdjective();
      item.setName();
      item.seletorStatus(dificuldade);
      item.seletorVal();

      
      this.lista[el].nome = item.nome;
      this.lista[el].tipo = item.tipo;
      this.lista[el].atk = item.atk;
      this.lista[el].dmg = item.dmg;
      this.lista[el].def = item.def;
      this.lista[el].res = item.res;
      this.lista[el].val = item.val;
      
    });
  } 
  
}

module.exports = ItemList