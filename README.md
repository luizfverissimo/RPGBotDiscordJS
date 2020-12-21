# RPG Discord Bot :crossed_swords: :game_die:
RPG baseado em texto criado em um ChatBot para o Discord. Bot criado utilizando Node.js, a biblioteca Discord.js e Mongoose para gerenciamento de banco de dados.

[<img src="/images/1.png" alt="imagem-rpgdiscordbot-1" height="200"/>]("https://github.com/luizfverissimo/RPGBotDiscordJS/blob/master/images/1.png") [<img src="/images/2.png" alt="imagem-rpgdiscordbot-2" height="200"/>]("https://github.com/luizfverissimo/RPGBotDiscordJS/blob/master/images/2.png") [<img src="/images/3.png" alt="imagem-rpgdiscordbot-3" height="200"/>]("https://github.com/luizfverissimo/RPGBotDiscordJS/blob/master/images/3.png") [<img src="/images/4.png" alt="imagem-rpgdiscordbot-4" height="200"/>]("https://github.com/luizfverissimo/RPGBotDiscordJS/blob/master/images/4.png") [<img src="/images/5.png" alt="imagem-rpgdiscordbot-5" height="200"/>]("https://github.com/luizfverissimo/RPGBotDiscordJS/blob/master/images/5.png") [<img src="/images/6.png" alt="imagem-rpgdiscordbot-6" height="200"/>]("https://github.com/luizfverissimo/RPGBotDiscordJS/blob/master/images/6.png") [<img src="/images/7.png" alt="imagem-rpgdiscordbot-7" height="200"/>]("https://github.com/luizfverissimo/RPGBotDiscordJS/blob/master/images/7.png")

## [Para acessar o Servidor com o Bot rodando CLIQUE AQUI.](https://discord.gg/NyAHFFY)

## Conceito
É um jogo simples baseado em texto que pode ser jogado através de um bot do Discord, o objetivo do jogo é explorar as criptas, derrotar criaturas, vender itens e subir de nível. Você interage com o jogo através de comandos executados no chat do Discord.

## Lista de Comandos
* 🆕 **!newgame** - Cria um novo personagem.
* 🧙‍♂️ **!char** - Mostra a ficha do seu personagem.
* 🎒 **!inv** - Mostra os items de sua mochila.
* 🛒**!mkt** - Mostra os itens do mercado para compra.
* 💸 **!buy itemX** - Compra o itemX da lista do mercado.
* 📜 **!new list** - Cria uma nova lista de itens no mercado.
* 📜🔼 **!new list plus** - Cria uma nova lista de itens de nível superior no mercado, O preço pode variar.
* 💰 **!sell slotX** - Vende o item do slotX da sua mochila.
* 🔎 **!show slotX** - Mostra os atributos do item no slotX.
* :crossed_swords: **!equip slotX** - Equipa o item do slotX automaticamente no local correto, o item retirado é colocado no slot do item equipado.
* 🔽 **!drop slotX** - Joga fora o item do slotX.
* 🖐 **!take** - Guarda na mochila o item segurado.
* 🏃‍♂️ **!explore** - Entra nas criptas a procura de uma aventura.
* 👹 **!enemy** - Mostra a ficha do inimigo que está em combate com você.
* :crossed_swords: **!atk** - Ataca o inimigo! Você ou ele irá vencer este combate.
* 💨 **!run** - Foge do inimigo em combate com você.
* 🧴 **!potion** - Utiliza uma das suas poções de cura para recuperar a vida.
* 💀 **!dell** - Deleta seu personagem da base de dados.


## Tecnologias Utilizadas
O Bot foi criado através de um servidor *Node.js* utilizando a biblioteca *Discord.js* para interagir com a API do Discord. Foi criado uma base de dados no *MongoDB* para o armazenamento das informações do jogadores, a biblioteca *Mongoose* foi utilizada para comunicação com a base de dados. Após a criação do Bot ele foi hospedado na *Heroku* para funcionamento.
