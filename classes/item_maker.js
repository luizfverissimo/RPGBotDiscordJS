const itemTypes = {
	WEAPON: "weapon",
	ARMOR: "armor"
}

class Item{
	constructor(level){
		this.level = level
	}

	seletorType(forceType = null){
		if(forceType == null) {
			const typeRandom = Math.floor(Math.random * 3)
			if(typeRandom == 2) {
				this.type = itemTypes.ARMOR
			}
			else {
				this.type = itemTypes.WEAPON
			}
		}
		else {
			this.type = forceType
		}
	}

	seletorVariety(forceVariety = null) {
		if(forceVariety == null) {
			if(this.type == itemTypes.ARMOR) {
				const listVariety = ['Armadura Leve', 'Armadura Média', 'Armadura Pesada']
				this.variety = listVariety[Math.floor(Math.random() * listVariety.length)]
			}
			else {
				const listVariety = ['Adaga', 'Espada', 'Lança', 'Faca', 'Cutelo', 'Mangual', 'Foice', 'Espada longa', 'Maça', 'Espeto', 'Tridente']
				this.variety = listVariety[Math.floor(Math.random() * listVariety.length)]
			}
		}
		else {
			this.variety = forceVariety
		}
	}

	seletorAdjective(forceAdjective = null) {
		if(forceAdjective == null) {
			const listAdjective = ['Danificada', 'Enferrujada', '', 'Melhorada', 'Encantada', 'Mestre', 'Obra-Prima', 'dos Deuses']
			this.adjective = listAdjective[Math.floor((level * 1.6) / listAdjective.length)]
		}
		else {
			this.adjective = forceAdjective
		}
	}

	seletorStatus(forceStatus = null) {
		if(forceStatus == null) {
			if(this.type == itemTypes.WEAPON) {
				//Cria bônus de ataque da arma
				const maxAtk = 3 //valor máximo de ataque
				const minAtk = 1 //valor mínimo de ataque
			
				this.atk = (Math.floor(Math.random() * (maxAtk - minAtk)) + minAtk) * dificuldade

				//Cria dano da arma
				const maxDmg = 4 //valor máximo de dano
				const minDmg = 2 //valor mínimo de dano
			
				this.dmg = (Math.floor(Math.random() * (maxDmg - minDmg)) + minDmg) * dificuldade
			}
			else {
				const max = 3 //valor máximo de armor
				const min = 2 //valor mínimo de amor

				this.armor = (Math.floor(Math.random() * (max - min)) + min) * dificuldade
			}
		}
		else {
			if(this.type == itemTypes.WEAPON) {
				this.atk = forceStatus.atk
				this.dmg = forceStatus.dmg
			}
			else {
				this.armor = forceStatus
			}
		}
	}
}