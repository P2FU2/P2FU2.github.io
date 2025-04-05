"use strict";

(function() {
  // Logo em ASCII com referência geek/hacker
  const asciiLogo = `
   ____  _            _       _             
  / ___|| | ___   ___| | __ _| |_ ___  _ __ 
  \\___ \\| |/ _ \\ / __| |/ _\` | __/ _ \\| '__|
   ___) | | (_) | (__| | (_| | || (_) | |   
  |____/|_|\\___/ \\___|_|\\__,_|\\__\\___/|_|   

       [ Terminal Hacker - Versão 3.0.1 ]
  `;

  // Menu de comandos disponíveis
  const menuString = `
Menu de Comandos:
  help ou ?           - Exibe este menu de comandos
  .calc [expressão]   - Calcula uma expressão matemática
  .filosofia          - Exibe uma frase filosófica aleatória
  .anime              - Mostra informações de um anime popular aleatório
  .prog               - Exibe um erro comum cometido por desenvolvedores
  .finance            - Mostra uma fórmula/indicador financeiro com explicação
  .date               - Exibe a data e hora atuais
  .echo [mensagem]    - Repete a mensagem digitada
  .matrix             - Inicia um efeito estilo Matrix
  .hack               - Exibe uma mensagem hacker
  .glitch             - Exibe texto glitchado
  .reboot             - Simula um reboot do sistema
  .historia           - Modo História: apresenta o conto completo
  .clear ou .cls      - Limpa o terminal
  .menu               - Exibe este menu novamente
`;

  // História para o modo história
  const story = `A luz fraca do terminal de computador lançava um brilho espectral sobre o meu rosto. O silêncio do meu abrigo, sepultado profundamente no subsolo, era apenas quebrado pelo zumbido suave das máquinas e pelo som ritmado das minhas teclas. Eu era o hacker, a última linha de defesa contra o apocalipse.
A superfície da Terra era um deserto inóspito, transformado em um mundo selvagem e mortífero por uma série de desastres ambientais, conflitos e pandemias que tinham dizimado a humanidade. Nossas cidades, antes símbolos orgulhosos do nosso engenho e ambição, agora eram apenas ruínas enferrujadas, lar de criaturas mutantes e sobreviventes desesperados.
Mas abaixo da superfície, enterrado em segurança contra o caos acima, havia um refúgio. Este era o meu mundo, uma rede de túneis e câmaras, abrigando a última esperança da humanidade: o terminal.
O terminal era a nossa Arca de Noé digital, uma compilação gigantesca de todo o conhecimento humano. Dados históricos, obras de arte, música, ciência, literatura, religião, filosofia, tecnologia, tudo estava aqui, armazenado em uma complexa rede de servidores e supercomputadores. Eu era o guardião deste tesouro, o último estudioso deste arquivo da civilização humana. Minha tarefa? Coletar, aprender e, mais importante, preservar.
A cada dia, eu explorava um novo aspecto da rica tapeçaria da história humana, descobrindo camadas e camadas de conhecimento. Por vezes, eram relatos de momentos de grandeza e triunfo, histórias de inovação e exploração, de amizade e amor. Em outros momentos, eram narrativas mais sombrias, lições sobre as profundezas a que a humanidade poderia cair, lembretes da ganância, da crueldade e da ignorância que haviam nos levado a este ponto.
Mas cada fragmento de informação era valioso. Cada linha de código, cada byte de dados era uma peça do quebra-cabeça, uma contribuição para o retrato completo da humanidade. E cada peça que eu adicionava à minha compreensão me deixava um passo mais perto de cumprir a minha missão: a preservação do legado humano para as gerações futuras.
No final do dia, enquanto eu assistia ao pôr do sol virtual projetado na parede da minha câmara, eu sabia que cada dia que passava era uma vitória. Uma vitória contra o esquecimento, contra a extinção. Eu estava mantendo viva a chama do conhecimento humano, um ciber-herói solitário no abismo do apocalipse.
Eu era a última esperança da humanidade. Aperte qualquer tecla`;

  // Seleção dos elementos do terminal e entrada do usuário
  const terminal = document.getElementById("terminal");
  const userInput = document.getElementById("user-input");
  let commandHistory = [];
  let commandIndex = 0;

  // Exibe o logo e o menu no carregamento do terminal
  function displayStartup() {
    terminal.innerText = asciiLogo + "\n" + menuString;
    scrollTerminal();
  }

  // Exibe o menu de comandos
  function displayMenu() {
    appendToTerminal("\n" + menuString);
  }

  // Inicia o modo história utilizando Typed.js
  function displayStory() {
    // Limpa o terminal para exibir somente a história
    terminal.innerText = "";
    new Typed('#terminal', {
      strings: story.split('\n'),
      typeSpeed: 30,
      backSpeed: 0,
      startDelay: 0,
      loop: false,
      showCursor: false,
      onComplete: function() {
        appendToTerminal("\n\n[Fim do Modo História] Digite '.menu' para voltar ao menu principal.");
        scrollTerminal();
      }
    });
  }

  // Inicializa a escuta dos comandos do usuário
  function startTerminal() {
    userInput.addEventListener("keydown", handleKeyDown);
  }

  // Lida com os eventos de keydown na entrada do usuário
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = userInput.value.trim();
      if (command !== "") {
        appendToTerminal(`\n> ${command}`);
        commandHistory.push(command);
        commandIndex = commandHistory.length;
        userInput.value = "";
        const result = processCommand(command);
        // Apenas adiciona o resultado se houver conteúdo (para comandos que já manipulam a exibição, como .historia ou .menu)
        if (result) {
          appendToTerminal(`\n${result}`);
        }
      }
      scrollTerminal();
    } else if (e.key === "ArrowUp") {
      if (commandIndex > 0) {
        commandIndex--;
        userInput.value = commandHistory[commandIndex];
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (commandIndex < commandHistory.length - 1) {
        commandIndex++;
        userInput.value = commandHistory[commandIndex];
      } else {
        commandIndex = commandHistory.length;
        userInput.value = "";
      }
      e.preventDefault();
    }
  }

  // Adiciona texto ao terminal
  function appendToTerminal(text) {
    terminal.innerText += text;
  }

  // Rola o terminal para o final
  function scrollTerminal() {
    terminal.scrollTop = terminal.scrollHeight;
  }

  // Função para processar o comando digitado pelo usuário
  function processCommand(command) {
    let output = "";
    // Comando de ajuda
    if (command === "help" || command === "?") {
      output = menuString;
    }
    // Comando para cálculos
    else if (command.startsWith(".calc")) {
      const expression = command.slice(5).trim();
      try {
        output = eval(expression);
      } catch (err) {
        output = "Erro ao processar a expressão matemática.";
      }
    }
    // Comando para frases filosóficas
    else if (command === ".filosofia") {
      const quotes = [
        "“Os fins justificam os meios.” - Maquiavel",
        "“A vida, se bem vivida, é longa.” - Sêneca",
        "“Só sei que nada sei.” - Sócrates",
        "“A medida do amor é amar sem medida.” - Platão",
        "“A excelência não é um feito, é um hábito.” - Aristóteles",
        "“Penso, logo existo.” - Descartes",
        "“O homem não é nada além daquilo que a educação faz dele.” - Kant",
        "“O que não provoca minha morte faz com que eu fique mais forte.” - Nietzsche",
        "“Não rir, não lamentar, nem odiar, mas compreender.” - Spinoza",
        "“Onde quer que você vá, vá com todo o coração.” - Confúcio",
        "“Nada é suficiente para quem o suficiente é pouco.” - Epicuro",
        "“A vida só pode ser compreendida olhando-se para trás; mas só pode ser vivida olhando-se para a frente.” - Kierkegaard",
        "“A verdade é o todo.” - Hegel",
        "“Os filósofos até agora apenas interpretaram o mundo de várias maneiras, o que importa é modificá-lo.” - Marx",
        "“Não sou eu quem me pergunta, sou eu quem responde.” - Foucault",
        "“O homem nasce livre, e por toda a parte encontra-se a ferros.” - Rousseau",
        "“A maior coisa do mundo é saber ser auto-suficiente.” - Montaigne",
        "“A educação faz tudo.” - Locke",
        "“A beleza das coisas existe no espírito de quem as contempla.” - Hume",
        "“O homem é o lobo do homem.” - Hobbes",
        "“O tempo que você gosta de perder não é tempo perdido.” - Bertrand Russell",
        "“Posso não concordar com uma palavra que você diz, mas defenderei até a morte o seu direito de dizê-la.” - Voltaire",
        "“Não se nasce mulher, torna-se mulher.” - Simone de Beauvoir",
        "“A existência precede a essência.” - Jean-Paul Sartre",
        "“No meio do inverno, aprendi finalmente que havia em mim um verão invencível.” - Albert Camus",
        "“Por que há ser ao invés de nada?” - Martin Heidegger",
        "“A liberdade é o reconhecimento da necessidade.” - Friedrich Engels",
        "“Não se pode entrar duas vezes no mesmo rio.” - Heráclito",
        "“Tenho apenas o sol e a lua como companhia constante.” - Diógenes",
        "“Não é da benevolência do açougueiro, do cervejeiro e do padeiro que esperamos o nosso jantar, mas da consideração que eles têm pelos próprios interesses.” - Adam Smith",
        "“Evitar a ociosidade é ordenar a vida de tal maneira que o ócio não se torne um fardo.” - Thomas Aquino",
        "“O coração tem razões que a própria razão desconhece.” - Pascal",
        "“Melhor ser Sócrates insatisfeito do que um tolo satisfeito.” - John Stuart Mill",
        "“Da indústria dos livros depende a indústria do universo.” - Diderot",
        "“A história do mundo é o progresso na consciência da liberdade.” - Hegel",
        "“A vida oscila como um pêndulo, para frente e para trás, entre a dor e o tédio.” - Arthur Schopenhauer",
        "“Os limites da minha linguagem são os limites do meu mundo.” - Ludwig Wittgenstein",
        "“A razão é, e só deve ser, a escrava das paixões.” - David Hume",
        "“Ouse saber.” - Immanuel Kant",
        "“Aquele que tem um porquê para viver pode suportar quase qualquer como.” - Friedrich Nietzsche"
      ];
      const index = Math.floor(Math.random() * quotes.length);
      output = quotes[index];
    }
    // Comando para exibir informações sobre um anime
    else if (command === ".anime") {
      const animes = [
        {"nome": "Naruto", "views": 300000000},
        {"nome": "One Piece", "views": 250000000},
        {"nome": "Attack on Titan", "views": 200000000},
        {"nome": "Bleach", "views": 150000000},
        {"nome": "Dragon Ball", "views": 350000000},
        {"nome": "Death Note", "views": 180000000},
        {"nome": "Sword Art Online", "views": 140000000},
        {"nome": "Fullmetal Alchemist: Brotherhood", "views": 130000000},
        {"nome": "Hunter x Hunter", "views": 120000000},
        {"nome": "My Hero Academia", "views": 110000000},
        {"nome": "Fairy Tail", "views": 105000000},
        {"nome": "Tokyo Ghoul", "views": 100000000},
        {"nome": "Cowboy Bebop", "views": 90000000},
        {"nome": "Jojo's Bizarre Adventure", "views": 80000000},
        {"nome": "Demon Slayer: Kimetsu no Yaiba", "views": 200000000},
        {"nome": "Code Geass", "views": 70000000},
        {"nome": "Gintama", "views": 60000000},
        {"nome": "Haikyuu", "views": 120000000},
        {"nome": "Naruto: Shippuden", "views": 230000000},
        {"nome": "Pokémon", "views": 300000000},
        {"nome": "One Punch Man", "views": 190000000},
        {"nome": "Neon Genesis Evangelion", "views": 65000000},
        {"nome": "Psycho-Pass", "views": 75000000},
        {"nome": "Yu-Gi-Oh", "views": 130000000},
        {"nome": "Steins;Gate", "views": 70000000},
        {"nome": "Inuyasha", "views": 100000000},
        {"nome": "Doraemon", "views": 180000000},
        {"nome": "Attack on Titan: Final Season", "views": 150000000},
        {"nome": "Jujutsu Kaisen", "views": 140000000},
        {"nome": "Mobile Suit Gundam", "views": 80000000},
        {"nome": "Dragon Ball Z", "views": 290000000},
        {"nome": "Ghost in the Shell", "views": 65000000},
        {"nome": "Sailor Moon", "views": 120000000},
        {"nome": "Nanatsu no Taizai", "views": 130000000},
        {"nome": "Detective Conan", "views": 200000000},
        {"nome": "Digimon", "views": 110000000},
        {"nome": "Re:Zero", "views": 85000000},
        {"nome": "Your Lie in April", "views": 75000000},
        {"nome": "Boku no Pico", "views": 60000000},
        {"nome": "Black Clover", "views": 110000000},
        {"nome": "Shingeki no Kyojin", "views": 180000000},
        {"nome": "Akame ga Kill!", "views": 70000000},
        {"nome": "Boruto: Naruto Next Generations", "views": 130000000},
        {"nome": "No Game No Life", "views": 90000000},
        {"nome": "Angel Beats!", "views": 65000000},
        {"nome": "Tokyo Revengers", "views": 120000000},
        {"nome": "Clannad", "views": 50000000},
        {"nome": "High School DxD", "views": 70000000},
        {"nome": "Berserk", "views": 80000000},
        {"nome": "Elfen Lied", "views": 60000000}
      ];
      const index = Math.floor(Math.random() * animes.length);
      output = `${animes[index].nome} tem ${animes[index].views} visualizações.`;
    }
    // Comando para exibir um erro comum de programação
    else if (command === ".prog") {
      const errors = [
        "Não comentar o código.",
        "Ignorar os princípios do SOLID.",
        "Não testar o código adequadamente.",
        "Não tratar erros e exceções.",
        "Uso excessivo de variáveis globais.",
        "Não seguir convenções de nomenclatura.",
        "Escrever código muito complexo e difícil de entender.",
        "Não usar controle de versão.",
        "Não reutilizar o código quando possível.",
        "Esquecer de otimizar o código para melhor desempenho.",
        "Não separar o código em funções ou métodos pequenos e claros.",
        "Não validar ou desinfetar a entrada do usuário.",
        "Não seguir os princípios de design responsivo.",
        "Ignorar a importância do UX/UI.",
        "Esquecer de liberar recursos após o uso (ex.: fechar conexões de banco de dados).",
        "Codificar sem um plano claro.",
        "Não entender completamente a linguagem de programação.",
        "Uso excessivo de recursão causando estouro de pilha.",
        "Assumir que o código sempre funcionará sem testar casos extremos.",
        "Não atualizar dependências e documentação.",
        "Esquecer de realizar backups e revisões de código."
      ];
      const index = Math.floor(Math.random() * errors.length);
      output = errors[index];
    }
    // Comando para exibir uma fórmula financeira
    else if (command === ".finance") {
      const formulas = [
        {"nome": "Operating Profit Margin", "formula": "Lucro operacional / Receita total", "descricao": "Mede a eficiência operacional"},
        {"nome": "Return on Sales (ROS)", "formula": "Lucro líquido / Receita de vendas", "descricao": "Lucro por venda"},
        {"nome": "Return on Capital Employed (ROCE)", "formula": "EBIT / (Total de ativos - Passivos circulantes)", "descricao": "Lucro por capital utilizado"},
        {"nome": "Debt Ratio", "formula": "Dívida total / Ativos totais", "descricao": "Parte da dívida no financiamento de ativos"},
        {"nome": "Asset Turnover", "formula": "Receitas / Ativos médios", "descricao": "Eficiência do uso de ativos"},
        {"nome": "Book Value per Share", "formula": "Patrimônio líquido / Total de ações", "descricao": "Valor contábil por ação"},
        {"nome": "Interest Coverage", "formula": "EBIT / Despesas de juros", "descricao": "Habilidade de pagar juros"},
        {"nome": "Dividend Yield", "formula": "Dividendos por ação / Preço da ação", "descricao": "Retorno de dividendos"}
      ];
      const index = Math.floor(Math.random() * formulas.length);
      output = `${formulas[index].formula}: ${formulas[index].descricao}`;
    }
    // Comando para limpar o terminal
    else if (command === ".clear" || command === ".cls") {
      terminal.innerText = "";
      output = "Terminal limpo.";
    }
    // Comando para exibir a data e hora atuais
    else if (command === ".date") {
      output = new Date().toLocaleString();
    }
    // Comando para ecoar a mensagem digitada
    else if (command.startsWith(".echo")) {
      output = command.slice(5).trim();
      if (!output) {
        output = "Nenhuma mensagem para ecoar.";
      }
    }
    // Comando para iniciar o efeito Matrix
    else if (command === ".matrix") {
      matrixEffect();
      output = "Efeito Matrix iniciado...";
    }
    // Comando para exibir uma mensagem com referências hacker
    else if (command === ".hack") {
      const hackerMessages = [
        "Access granted. Welcome, hacker.",
        "Decrypting data... Success.",
        "You're in. Now, let's cause some chaos.",
        "I know what you did last summer.",
        "The cake is a lie."
      ];
      const index = Math.floor(Math.random() * hackerMessages.length);
      output = hackerMessages[index];
    }
    // Comando para simular um reboot do sistema
    else if (command === ".reboot") {
      output = "Rebooting system...\nSystem rebooted successfully.";
    }
    // Comando para exibir texto glitchado
    else if (command === ".glitch") {
      output = generateGlitchText(30);
    }
    // Comando para iniciar o modo história
    else if (command === ".historia") {
      displayStory();
      return "";
    }
    // Comando para exibir o menu novamente
    else if (command === ".menu") {
      displayMenu();
      return "";
    }
    // Comando desconhecido
    else {
      output = `Comando desconhecido: '${command}'. Digite 'help' ou '?' para obter ajuda.`;
    }
    return output;
  }

  // Função para gerar uma linha de código binário (usada no efeito Matrix)
  function generateBinaryLine() {
    let line = "";
    for (let i = 0; i < 40; i++) {
      line += Math.random() < 0.5 ? "0" : "1";
    }
    return line;
  }

  // Função que inicia o efeito Matrix (exibe linhas de código binário)
  function matrixEffect() {
    let count = 0;
    const interval = setInterval(() => {
      appendToTerminal("\n" + generateBinaryLine());
      count++;
      if (count >= 20) {
        clearInterval(interval);
        appendToTerminal("\nEfeito Matrix concluído.");
      }
      scrollTerminal();
    }, 250);
  }

  // Função para gerar texto glitchado aleatório
  function generateGlitchText(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:;<>,.?/~`";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Exibe o logo e o menu ao iniciar o terminal
  displayStartup();
  startTerminal();
})();
