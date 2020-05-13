const itemTypes = {
	WEAPON: "weapon",
	ARMOR: "armor"
}

class Item{
	constructor(level){
		this.level = level
	}

	seletorTipo(forceType = null){
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
}