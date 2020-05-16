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

  
  renderLista() {
    const render = new Discord.MessageEmbed()
      .setColor("#e68612")
      .setTitle(`🛒 Mercado - Lista de itens para venda:`)
      .addFields(
        {
          name: `📦1️⃣ **Item 1: ${this.lista.item1.nome} - preço: ${this.lista.item1.val} gp**`,
          value: `ATK:${this.lista.item1.atk}, DMG: ${this.lista.item1.dmg}, DEF: ${this.lista.item1.def}, RES: ${this.lista.item1.res}`,
        },
        {
          name: `📦2️⃣ **Item 2: ${this.lista.item2.nome} - preço: ${this.lista.item2.val} gp**`,
          value: `ATK:${this.lista.item2.atk}, DMG: ${this.lista.item2.dmg}, DEF: ${this.lista.item2.def}, RES: ${this.lista.item2.res}`,
        },
        {
          name: `📦3️⃣ **Item 3: ${this.lista.item3.nome} - preço: ${this.lista.item3.val} gp**`,
          value: `ATK:${this.lista.item3.atk}, DMG: ${this.lista.item3.dmg}, DEF: ${this.lista.item3.def}, RES: ${this.lista.item3.res}`,
        },
        {
          name: `📦4️⃣ **Item 4: ${this.lista.item4.nome} - preço: ${this.lista.item4.val} gp**`,
          value: `ATK:${this.lista.item4.atk}, DMG: ${this.lista.item4.dmg}, DEF: ${this.lista.item4.def}, RES: ${this.lista.item4.res}`,
        },
        {
          name: `📦5️⃣ **Item 5: ${this.lista.item5.nome} - preço: ${this.lista.item5.val} gp**`,
          value: `ATK:${this.lista.item5.atk}, DMG: ${this.lista.item5.dmg}, DEF: ${this.lista.item5.def}, RES: ${this.lista.item5.res}`,
        },
      );

      return render
      
  }
}

module.exports = ItemList