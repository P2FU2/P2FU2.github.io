const quotes = [
    "A persistência é o caminho do êxito.",
    "Não espere por oportunidades, crie-as.",
    "Você é mais forte do que imagina.",
    "O sucesso é a soma de pequenos esforços repetidos diariamente."
  ];
  
  function newQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("quote").textContent = quote;
  }
  
  function addTodo() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (text === "") return;
  
    const li = document.createElement("li");
    li.textContent = text;
    document.getElementById("todo-list").appendChild(li);
    saveTodo(text);
    input.value = "";
  }
  
  function saveTodo(text) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(text);
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  
  function loadTodos() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    for (const text of todos) {
      const li = document.createElement("li");
      li.textContent = text;
      document.getElementById("todo-list").appendChild(li);
    }
  }
  
  document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
  
  window.onload = () => {
    newQuote();
    loadTodos();
  };
  