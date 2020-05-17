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
    const max = 12 //valor máximo de hp
    const min = 6 //valor mínimo de hp

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
    const maxAtk = 5 //valor máximo de ataque
    const minAtk = 1 //valor mínimo de ataque

    const atk = (Math.floor(Math.random() * (maxAtk - minAtk)) + minAtk) * dificuldade
    this.atk = atk

    //Cria dano da arma
    const maxDmg = 6 //valor máximo de dano
    const minDmg = 2 //valor mínimo de dano

    const dmg = (Math.floor(Math.random() * (maxDmg - minDmg)) + minDmg) * dificuldade
    this.dmg = dmg
  }

  seletorArmor(dificuldade){
    const max = 4 //valor máximo de armor
    const min = 1 //valor mínimo de amor

    const armor = (Math.floor(Math.random() * (max - min)) + min) * dificuldade
    this.armor = armor
  }
}

module.exports = Creature