const quotes = [
    "A persistência é o caminho do êxito.",
    "Não espere por oportunidades, crie-as.",
    "Você é mais forte do que imagina.",
    "O sucesso é a soma de pequenos esforços repetidos diariamente.",
    "Acredite em você mesmo e tudo será possível.",
    "Cada dia é uma nova oportunidade para ser melhor.",
    "O segredo do sucesso é a constância no propósito.",
    "Grandes conquistas começam com pequenos passos.",
    "Seja a mudança que você quer ver no mundo.",
    "O futuro pertence àqueles que acreditam na beleza de seus sonhos."
  ];
  
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
  
  function updateStats() {
    document.getElementById("completed-tasks").textContent = completedTasks.length;
    document.getElementById("pending-tasks").textContent = todos.length;
  }
  
  function newQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.getElementById("quote");
    quoteElement.style.opacity = "0";
    
    setTimeout(() => {
      quoteElement.textContent = quote;
      quoteElement.style.opacity = "1";
    }, 300);
  }
  
  function addTodo() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (text === "") return;
  
    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    };
  
    todos.push(todo);
    saveTodos();
    renderTodo(todo);
    updateStats();
    input.value = "";
  }
  
  function renderTodo(todo) {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));
    
    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.7";
    }
    
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    document.getElementById("todo-list").appendChild(li);
  }
  
  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      if (todo.completed) {
        completedTasks.push(todo);
      } else {
        completedTasks = completedTasks.filter(t => t.id !== id);
      }
      saveTodos();
      updateStats();
      renderTodos();
    }
  }
  
  function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    completedTasks = completedTasks.filter(t => t.id !== id);
    saveTodos();
    updateStats();
    renderTodos();
  }
  
  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }
  
  function renderTodos() {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    todos.forEach(todo => renderTodo(todo));
  }
  
  function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date().toLocaleDateString('pt-BR', options);
    document.getElementById("current-date").textContent = date;
  }
  
  function toggleTheme() {
    document.body.classList.toggle("dark");
    const themeIcon = document.querySelector("#toggle-theme i");
    themeIcon.classList.toggle("fa-moon");
    themeIcon.classList.toggle("fa-sun");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  }
  
  document.getElementById("toggle-theme").addEventListener("click", toggleTheme);
  
  document.getElementById("todo-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });
  
  // Relógio Digital
  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('clock').textContent = time;
    document.getElementById('date').textContent = date;
  }
  
  // Pomodoro Timer
  let pomodoroInterval;
  let currentMode = 'focus';
  let isRunning = false;
  let timeLeft = 25 * 60; // 25 minutes in seconds
  let pomodoroStats = JSON.parse(localStorage.getItem('pomodoroStats')) || {
    completedPomodoros: 0,
    totalFocusTime: 0,
    totalBreakTime: 0,
    lastReset: new Date().toDateString()
  };
  
  const POMODORO_TIMES = {
    'focus': 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60
  };
  
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }
  
  function startPomodoro() {
    if (!isRunning) {
      isRunning = true;
      document.getElementById('start-pomodoro').innerHTML = '<i class="fas fa-pause"></i> Pausar';
      pomodoroInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
          clearInterval(pomodoroInterval);
          isRunning = false;
          updatePomodoroStats();
          playNotificationSound();
          showNotification();
          resetPomodoro();
        }
      }, 1000);
    } else {
      pausePomodoro();
    }
  }
  
  function pausePomodoro() {
    clearInterval(pomodoroInterval);
    isRunning = false;
    document.getElementById('start-pomodoro').innerHTML = '<i class="fas fa-play"></i> Iniciar';
  }
  
  function resetPomodoro() {
    clearInterval(pomodoroInterval);
    isRunning = false;
    timeLeft = POMODORO_TIMES[currentMode];
    updateTimerDisplay();
    document.getElementById('start-pomodoro').innerHTML = '<i class="fas fa-play"></i> Iniciar';
  }
  
  function setPomodoroMode(mode) {
    currentMode = mode;
    timeLeft = POMODORO_TIMES[mode];
    updateTimerDisplay();
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      }
    });
  }
  
  function updatePomodoroStats() {
    const today = new Date().toDateString();
    
    if (pomodoroStats.lastReset !== today) {
      pomodoroStats = {
        completedPomodoros: 0,
        totalFocusTime: 0,
        totalBreakTime: 0,
        lastReset: today
      };
    }
    
    if (currentMode === 'focus') {
      pomodoroStats.completedPomodoros++;
      pomodoroStats.totalFocusTime += POMODORO_TIMES.focus / 60;
    } else {
      pomodoroStats.totalBreakTime += POMODORO_TIMES[currentMode] / 60;
    }
    
    savePomodoroStats();
    updatePomodoroStatsDisplay();
  }
  
  function updatePomodoroStatsDisplay() {
    document.getElementById('completed-pomodoros').textContent = pomodoroStats.completedPomodoros;
    document.getElementById('total-focus-time').textContent = pomodoroStats.totalFocusTime;
    document.getElementById('total-break-time').textContent = pomodoroStats.totalBreakTime;
  }
  
  function savePomodoroStats() {
    localStorage.setItem('pomodoroStats', JSON.stringify(pomodoroStats));
  }
  
  function playNotificationSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.play();
  }
  
  function showNotification() {
    if (Notification.permission === "granted") {
      const title = currentMode === 'focus' ? 'Pomodoro Concluído!' : 'Pausa Terminada!';
      const body = currentMode === 'focus' ? 'Hora de uma pausa!' : 'Hora de voltar ao trabalho!';
      new Notification(title, { body });
    }
  }
  
  // Solicitar permissão para notificações
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
  
  // Bloco de Notas
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  let selectedColor = '#ffffff';
  
  function createNewNote() {
    const note = {
      id: Date.now(),
      title: 'Nova Nota',
      content: '',
      color: selectedColor,
      createdAt: new Date().toISOString()
    };
    
    notes.push(note);
    saveNotes();
    renderNote(note);
  }
  
  function renderNote(note) {
    const notesContainer = document.getElementById('notes-container');
    
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.style.backgroundColor = note.color;
    noteElement.dataset.id = note.id;
    
    noteElement.innerHTML = `
      <div class="note-header">
        <textarea class="note-title" placeholder="Título da nota">${note.title}</textarea>
        <i class="fas fa-trash note-delete" onclick="deleteNote(${note.id})"></i>
      </div>
      <textarea class="note-content" placeholder="Digite sua nota aqui...">${note.content}</textarea>
      <div class="note-footer">
        <small class="note-date">${new Date(note.createdAt).toLocaleDateString('pt-BR')}</small>
        <div class="note-actions">
          <i class="fas fa-palette" onclick="showColorPicker(${note.id})"></i>
          <button class="note-save" onclick="saveNote(${note.id})">
            <i class="fas fa-save"></i>
            Salvar
          </button>
        </div>
      </div>
      <button class="note-close" onclick="closeNote(${note.id})">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    notesContainer.appendChild(noteElement);
    
    // Adicionar eventos para expandir a nota
    const titleInput = noteElement.querySelector('.note-title');
    const contentInput = noteElement.querySelector('.note-content');
    
    titleInput.addEventListener('input', () => {
      autoResizeTextarea(titleInput);
    });
    
    contentInput.addEventListener('input', () => {
      autoResizeTextarea(contentInput);
    });
    
    noteElement.addEventListener('click', (e) => {
      if (!e.target.closest('.note-actions') && !e.target.closest('.note-close')) {
        expandNote(note.id);
      }
    });
  }
  
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  
  function expandNote(noteId) {
    const note = document.querySelector(`.note[data-id="${noteId}"]`);
    const overlay = document.createElement('div');
    overlay.className = 'note-overlay';
    document.body.appendChild(overlay);
    
    note.classList.add('expanded');
    overlay.classList.add('active');
    
    // Ajustar altura dos textareas
    const titleInput = note.querySelector('.note-title');
    const contentInput = note.querySelector('.note-content');
    autoResizeTextarea(titleInput);
    autoResizeTextarea(contentInput);
  }
  
  function closeNote(noteId) {
    const note = document.querySelector(`.note[data-id="${noteId}"]`);
    const overlay = document.querySelector('.note-overlay');
    
    note.classList.remove('expanded');
    overlay.classList.remove('active');
    
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  }
  
  function saveNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      const noteElement = document.querySelector(`.note[data-id="${noteId}"]`);
      const titleInput = noteElement.querySelector('.note-title');
      const contentInput = noteElement.querySelector('.note-content');
      
      note.title = titleInput.value;
      note.content = contentInput.value;
      saveNotes();
      
      // Mostrar feedback visual
      const saveBtn = noteElement.querySelector('.note-save');
      saveBtn.innerHTML = '<i class="fas fa-check"></i> Salvo!';
      setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
      }, 2000);
    }
  }
  
  function renderNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';
    notes.forEach(note => renderNote(note));
  }
  
  function updateNoteTitle(id, title) {
    const note = notes.find(n => n.id === id);
    if (note) {
      note.title = title;
      saveNotes();
    }
  }
  
  function updateNoteContent(id, content) {
    const note = notes.find(n => n.id === id);
    if (note) {
      note.content = content;
      saveNotes();
    }
  }
  
  function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
  }
  
  function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
  }
  
  // Event Listeners para o seletor de cores
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.dataset.color;
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
  
  // Atualizar o relógio a cada segundo
  setInterval(updateClock, 1000);
  
  // Função para exportar tarefas
  function exportTasks() {
    const tasks = JSON.parse(localStorage.getItem("todos")) || [];
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    const date = new Date().toLocaleDateString('pt-BR');
    
    let content = `Relatório de Tarefas - ${date}\n\n`;
    content += `Tarefas Pendentes (${tasks.length}):\n`;
    tasks.forEach(task => {
      content += `- ${task.text}\n`;
    });
    
    content += `\nTarefas Concluídas (${completedTasks.length}):\n`;
    completedTasks.forEach(task => {
      content += `- ${task.text}\n`;
    });
    
    // Criar arquivo para download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarefas-${date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  function showColorPicker(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      const colorPicker = document.createElement('div');
      colorPicker.className = 'color-picker-popup';
      colorPicker.innerHTML = `
        <div class="color-options">
          <button class="color-option" style="background-color: #ffffff" onclick="updateNoteColor(${noteId}, '#ffffff')"></button>
          <button class="color-option" style="background-color: #ffd1dc" onclick="updateNoteColor(${noteId}, '#ffd1dc')"></button>
          <button class="color-option" style="background-color: #d1ffdc" onclick="updateNoteColor(${noteId}, '#d1ffdc')"></button>
          <button class="color-option" style="background-color: #d1dcff" onclick="updateNoteColor(${noteId}, '#d1dcff')"></button>
          <button class="color-option" style="background-color: #fffed1" onclick="updateNoteColor(${noteId}, '#fffed1')"></button>
          <button class="color-option" style="background-color: #f0e6ff" onclick="updateNoteColor(${noteId}, '#f0e6ff')"></button>
          <button class="color-option" style="background-color: #ffe6e6" onclick="updateNoteColor(${noteId}, '#ffe6e6')"></button>
          <button class="color-option" style="background-color: #e6ffe6" onclick="updateNoteColor(${noteId}, '#e6ffe6')"></button>
        </div>
      `;
      
      document.body.appendChild(colorPicker);
      
      // Fechar o color picker ao clicar fora
      document.addEventListener('click', function closeColorPicker(e) {
        if (!colorPicker.contains(e.target)) {
          document.body.removeChild(colorPicker);
          document.removeEventListener('click', closeColorPicker);
        }
      });
    }
  }
  
  function updateNoteColor(noteId, color) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      note.color = color;
      saveNotes();
      renderNotes();
    }
  }
  
  window.onload = () => {
    newQuote();
    renderTodos();
    updateStats();
    updateDate();
    updateClock();
    renderNotes();
    updatePomodoroStatsDisplay();
    
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      const themeIcon = document.querySelector("#toggle-theme i");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  };
  