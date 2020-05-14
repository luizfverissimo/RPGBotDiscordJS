const itemTypes = {
  WEAPON: "arma",
  ARMOR: "armadura",
  SHIELD: "escudo",
};

class ItemMaker {
  constructor(level) {
		this.level = level;
		this.dificuldade = level + 1
  }

  seletorType() {
    const typeRandom = Math.floor(Math.random() * 3) + 1;
    if (typeRandom === 3) {
      this.tipo = itemTypes.ARMOR;
    } else if (typeRandom === 2) {
      this.tipo = itemTypes.WEAPON;
    } else {
      this.tipo = itemTypes.SHIELD;
		}
		console.log(typeRandom)
		return this.tipo
  }

  seletorVariety() {
    if (this.tipo === itemTypes.ARMOR) {
      const listVariety = [
        "Armadura de couro",
        "Armadura de placas",
        "Armadura de ossos",
        "Armadura de malha",
        "Peitoral de bronze",
        "Armadura",
        "Brunea",
        "Gibão de couro",
        "Cota de malha",
        "Corselete de couro",
        "Cota de talhas",
        "Loringa segmentada",
        "Armadura de batalha",
      ];
      this.nomeProv =
        listVariety[Math.floor(Math.random() * listVariety.length)];
    } else if (this.tipo === itemTypes.WEAPON) {
      const listVariety = [
        "Adaga",
        "Espada",
        "Lança",
        "Faca",
        "Cutelo",
        "Mangual",
        "Foice",
        "Espada longa",
        "Maça",
        "Espeto",
        "Tridente",
      ];
      this.nomeProv =
        listVariety[Math.floor(Math.random() * listVariety.length)];
    } else {
      const listVariety = [
        "Broquel de couro",
        "Escudo redondo",
        "Escudo de mão",
        "Escudo templário",
        "Escudo de gladiador",
        "Escudo de bronze",
        "Escudo retangular",
        "Escudo de batalha",
        "Escudo torre",
      ];
      this.nomeProv =
        listVariety[Math.floor(Math.random() * listVariety.length)];
		}
		return this.nomeProv
  }

  seletorAdjective() {
    const listAdjective = [
      "Danificada",
      "Enferrujada",
      "",
      "Melhorada",
      "Encantada",
      "Mestre",
      "Obra-Prima",
      "dos Deuses",
    ];
    this.adjective =
			listAdjective[Math.floor((this.level * 1.6) / listAdjective.length)];
		return this.adjective
	}
	
	setName() {
		this.nome = `${this.nomeProv} ${this.adjective}`
		return this.nome
	}

  seletorStatus(dificuldade) {
    if (this.tipo == itemTypes.WEAPON) {
      //Cria bônus de ataque da arma
      const maxAtk = 3; //valor máximo de ataque
      const minAtk = 1; //valor mínimo de ataque

      this.atk =
        (Math.floor(Math.random() * (maxAtk - minAtk)) + minAtk) * dificuldade;

      //Cria dano da arma
      const maxDmg = 4; //valor máximo de dano
      const minDmg = 2; //valor mínimo de dano

      this.dmg =
				(Math.floor(Math.random() * (maxDmg - minDmg)) + minDmg) * dificuldade;
				
			this.res = 0
			this.def = 0
    } else if (this.tipo === itemTypes.ARMOR) {
      const max = 4; //valor máximo de armor
      const min = 2; //valor mínimo de amor

      this.res = (Math.floor(Math.random() * (max - min)) + min) * dificuldade;
			
			this.atk = 0
			this.dmg = 0
			this.def = 0
    } else {
			const max = 3; //valor máximo de shield
      const min = 2; //valor mínimo de shield

      this.def =
				(Math.floor(Math.random() * (max - min)) + min) * dificuldade;
				this.atk = 0
				this.dmg = 0
				this.res = 0
		}
		return this.atk, this.dmg, this.def, this.res
  }
}

module.exports = ItemMaker