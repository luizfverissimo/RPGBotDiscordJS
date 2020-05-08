module.exports = {
  name: 'roll',
  description: 'Rolagem de dados',
  execute(message, args){
    //verifica se o args do dado é válida
    const argsValidation = (string) =>{
      if (isNaN(string)){
        return false
      } else if (string >= 2 && string <= 100) {
        return true
      } else {
        return false
      }
    } 
    //verifica se o segundo args[1] do modificar é válido
    const modifierValidation = (string) =>{
      if (isNaN(string)){
        return false
      } else {
        return true
      }
    }
    
    //Variaveis e constantes
    let dice, roll
    //erro no primeiro argumento
    const errorArgs = `Adicione um valor válido de dado, D2, D4, D6, D8, D10, D12, D16, D20, D50 ou D100.`

    //render da rolagem sem modificador
    if(args[0]){
      //retira o d e deixa somento o número
      dice = parseInt(args[0].replace(/[d]+/g, ''))
      //rola o dado
      roll = Math.floor(Math.random() * dice) + 1

      //render 
      if(argsValidation(dice)){
        message.channel.send(`🎲 Você rolou um **D${dice}** e tirou **${roll}**!`)
        if (roll === dice) message.channel.send(`**Sucesso crítico!** você tirou ${roll}! 👑`);
        if(roll === 1) message.channel.send(`**Falha crítica!** você tirou ${roll}! 😢`);
      }
    } else {
      message.channel.send(errorArgs)
    }
    
    //render da rolagem com modificador - somente se houver segundo args
    if(args[1]) {
      //separa o número do modificador do sinal
      const modifier = parseInt(args[1].substr(1))
      //separa o sinal do modificador
      const modifierSign = args[1].slice(0, 1)

      if(argsValidation(dice) && modifierValidation(modifier) ){
        if(modifierSign === '-') message.channel.send(`🔻 Modificador: **${roll} ${modifierSign} ${modifier} = ${roll - modifier}**!`)
  
        if(modifierSign === '+') message.channel.send(`🔺 Modificador: **${roll} ${modifierSign} ${modifier} = ${roll + modifier}**!`)
      } 
      //caso
      else {
        message.channel.send("Adicione um modificador válido (+ 1, -2, etc)")
      }
    }    
  }
}
