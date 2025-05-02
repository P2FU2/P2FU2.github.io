// Variáveis globais
let isDrawing = false;
let currentTool = 'select';
let currentColor = '#000000';
let brushSize = 5;
let brushType = 'pen';
let brushOpacity = 100;
let currentShape = 'square';
let shapeSize = 100;
let selectedObject = null;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let currentCanvas = 1;
let canvases = {};
let isLightTheme = false;

// Elementos DOM
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const objectsContainer = document.getElementById('objects-container');
const workspace = document.querySelector('.workspace');
const emojiModal = document.getElementById('emoji-modal');
const emojiGrid = document.querySelector('.emoji-grid');
const canvasNameInput = document.getElementById('canvas-name');
const canvasTabs = document.querySelector('.canvas-tabs');

// Configuração do canvas
function setupCanvas() {
    canvas.width = workspace.clientWidth;
    canvas.height = workspace.clientHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    updateBrushStyle();
}

// Event Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Ferramentas
document.getElementById('select-tool').addEventListener('click', () => setTool('select'));
document.getElementById('draw-tool').addEventListener('click', () => setTool('draw'));
document.getElementById('text-tool').addEventListener('click', () => setTool('text'));
document.getElementById('shape-tool').addEventListener('click', () => setTool('shape'));
document.getElementById('arrow-tool').addEventListener('click', () => setTool('arrow'));
document.getElementById('image-tool').addEventListener('click', () => setTool('image'));
document.getElementById('emoji-tool').addEventListener('click', () => setTool('emoji'));
document.getElementById('eraser').addEventListener('click', () => setTool('eraser'));

// Cor e tamanho do pincel
document.getElementById('color-input').addEventListener('input', (e) => {
    currentColor = e.target.value;
    updateBrushStyle();
});

document.getElementById('brush-size').addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value);
    updateBrushStyle();
});

// Opções de fundo
document.getElementById('grid-bg').addEventListener('click', () => setBackground('grid'));
document.getElementById('dots-bg').addEventListener('click', () => setBackground('dots'));
document.getElementById('solid-bg').addEventListener('click', () => setBackground('solid'));

// Tema
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Gerenciamento de canvas
function initializeCanvasManagement() {
    // Criar primeiro canvas se não existir
    if (Object.keys(canvases).length === 0) {
        canvases[1] = {
            name: 'Canvas 1',
            background: 'solid',
            objects: [],
            drawingData: null
        };
    }

    // Limpar tabs existentes
    while (canvasTabs.children.length > 0) {
        canvasTabs.removeChild(canvasTabs.lastChild);
    }

    // Recriar tabs
    Object.keys(canvases).forEach(number => {
        createCanvasTab(number);
    });

    // Adicionar botão de novo canvas
    const newCanvasBtn = document.createElement('button');
    newCanvasBtn.className = 'canvas-tab';
    newCanvasBtn.id = 'new-canvas';
    newCanvasBtn.innerHTML = '<i class="fas fa-plus"></i> Novo Canvas';
    newCanvasBtn.addEventListener('click', createNewCanvas);
    canvasTabs.appendChild(newCanvasBtn);

    // Ativar primeiro canvas
    switchCanvas(1);
}

function createCanvasTab(number) {
    const tab = document.createElement('button');
    tab.className = 'canvas-tab';
    tab.dataset.canvas = number;
    tab.innerHTML = `
        <span class="canvas-name">${canvases[number].name}</span>
        <button class="delete-canvas" onclick="deleteCanvas(${number})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    tab.addEventListener('click', () => switchCanvas(parseInt(number)));
    canvasTabs.appendChild(tab);
}

function createNewCanvas() {
    const newCanvasNumber = Math.max(...Object.keys(canvases).map(Number)) + 1;
    canvases[newCanvasNumber] = {
        name: `Canvas ${newCanvasNumber}`,
        background: 'solid',
        objects: [],
        drawingData: null
    };
    
    createCanvasTab(newCanvasNumber);
    switchCanvas(newCanvasNumber);
}

function deleteCanvas(number) {
    if (Object.keys(canvases).length <= 1) {
        alert('Não é possível deletar o último canvas!');
        return;
    }

    if (confirm('Tem certeza que deseja deletar este canvas?')) {
        delete canvases[number];
        localStorage.setItem('mindCanvas', JSON.stringify(canvases));
        
        const tab = document.querySelector(`.canvas-tab[data-canvas="${number}"]`);
        tab.remove();
        
        const remainingCanvas = Object.keys(canvases)[0];
        switchCanvas(parseInt(remainingCanvas));
    }
}

function switchCanvas(number) {
    saveCurrentCanvas();
    currentCanvas = number;
    
    // Atualizar tabs
    document.querySelectorAll('.canvas-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.canvas === number.toString()) {
            tab.classList.add('active');
        }
    });
    
    // Carregar dados do canvas
    const canvasData = canvases[number];
    canvasNameInput.value = canvasData.name;
    setBackground(canvasData.background);
    
    // Limpar canvas atual
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objectsContainer.innerHTML = '';
    
    // Restaurar desenho
    if (canvasData.drawingData) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = canvasData.drawingData;
    }
    
    // Restaurar objetos
    canvasData.objects.forEach(obj => {
        let element;
        switch (obj.type) {
            case 'text':
                element = createTextBlock(obj.content, obj.style);
                break;
            case 'shape':
                element = createShape(obj.shape, obj.style);
                break;
            case 'arrow':
                element = createArrow(obj.style);
                break;
            case 'emoji':
                element = createEmoji(obj.content);
                break;
            case 'image':
                element = createImageFromData(obj.content, obj.style);
                break;
        }
        if (element) {
            element.style.left = obj.position.left;
            element.style.top = obj.position.top;
        }
    });
}

function saveCurrentCanvas() {
    if (!currentCanvas) return;
    
    const canvasData = {
        name: canvasNameInput.value,
        background: workspace.className.split(' ')[1],
        objects: Array.from(objectsContainer.children).map(element => ({
            type: element.className.split(' ')[0],
            content: element.textContent || element.src,
            style: element.style.cssText,
            position: {
                left: element.style.left,
                top: element.style.top
            }
        })),
        drawingData: canvas.toDataURL()
    };
    
    canvases[currentCanvas] = canvasData;
    localStorage.setItem('mindCanvas', JSON.stringify(canvases));
    
    // Atualizar nome na tab
    const tab = document.querySelector(`.canvas-tab[data-canvas="${currentCanvas}"] .canvas-name`);
    if (tab) {
        tab.textContent = canvasData.name;
    }
}

// Funções de desenho
function startDrawing(e) {
    if (currentTool === 'select') {
        handleSelection(e);
    } else if (currentTool === 'draw' || currentTool === 'eraser') {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        handleToolStart(e);
    }
}

function draw(e) {
    if (!isDrawing && !isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && selectedObject) {
        moveObject(selectedObject, x - dragStartX, y - dragStartY);
        dragStartX = x;
        dragStartY = y;
    } else if (isDrawing) {
        ctx.lineTo(x, y);
        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        ctx.stroke();
    }
}

function stopDrawing() {
    isDrawing = false;
    isDragging = false;
    ctx.globalCompositeOperation = 'source-over';
    saveCurrentCanvas();
}

function handleSelection(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    selectedObject = getObjectAt(x, y);
    if (selectedObject) {
        isDragging = true;
        dragStartX = x;
        dragStartY = y;
    }
}

function handleToolStart(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    switch (currentTool) {
        case 'text':
            createTextBlock('Clique para editar', {
                left: `${x}px`,
                top: `${y}px`,
                color: currentColor
            });
            break;
        case 'shape':
            createShape(currentShape, {
                left: `${x}px`,
                top: `${y}px`,
                backgroundColor: currentColor
            });
            break;
        case 'arrow':
            createArrow({
                left: `${x}px`,
                top: `${y}px`,
                backgroundColor: currentColor
            });
            break;
        case 'image':
            createImage(x, y);
            break;
        case 'emoji':
            openEmojiModal(e.clientX, e.clientY);
            break;
    }
}

// Funções de objetos
function createTextBlock(content, style) {
    const textBlock = document.createElement('div');
    textBlock.className = 'text-block draggable';
    textBlock.contentEditable = true;
    textBlock.textContent = content;
    textBlock.style.cssText = style;
    textBlock.style.color = currentColor;
    textBlock.style.fontSize = `${document.getElementById('font-size').value}px`;
    textBlock.style.fontFamily = document.getElementById('font-family').value;
    
    if (document.querySelector('.text-style [data-style="bold"]').classList.contains('active')) {
        textBlock.style.fontWeight = 'bold';
    }
    if (document.querySelector('.text-style [data-style="italic"]').classList.contains('active')) {
        textBlock.style.fontStyle = 'italic';
    }
    if (document.querySelector('.text-style [data-style="underline"]').classList.contains('active')) {
        textBlock.style.textDecoration = 'underline';
    }

    makeDraggable(textBlock);
    objectsContainer.appendChild(textBlock);
    return textBlock;
}

function createShape(shape, style) {
    const shapeElement = document.createElement('div');
    shapeElement.className = `shape-block draggable ${shape}`;
    shapeElement.style.cssText = style;
    shapeElement.style.width = `${shapeSize}px`;
    shapeElement.style.height = `${shapeSize}px`;
    shapeElement.style.backgroundColor = currentColor;
    makeDraggable(shapeElement);
    objectsContainer.appendChild(shapeElement);
    return shapeElement;
}

function createArrow(style) {
    const arrow = document.createElement('div');
    arrow.className = 'arrow draggable';
    arrow.style.cssText = style;
    arrow.style.borderColor = currentColor;
    makeDraggable(arrow);
    objectsContainer.appendChild(arrow);
    return arrow;
}

function createImage(x, y) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'image-block draggable';
                img.style.left = `${x}px`;
                img.style.top = `${y}px`;
                makeDraggable(img);
                objectsContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function createEmoji(emoji) {
    const emojiElement = document.createElement('div');
    emojiElement.className = 'emoji draggable';
    emojiElement.textContent = emoji;
    emojiElement.style.fontSize = '24px';
    makeDraggable(emojiElement);
    objectsContainer.appendChild(emojiElement);
    return emojiElement;
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    element.addEventListener('mousedown', (e) => {
        if (currentTool === 'select') {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = `${initialX + dx}px`;
            element.style.top = `${initialY + dy}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function getObjectAt(x, y) {
    const elements = document.querySelectorAll('.draggable');
    for (const element of elements) {
        const rect = element.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            return element;
        }
    }
    return null;
}

function moveObject(object, dx, dy) {
    const rect = object.getBoundingClientRect();
    object.style.left = `${rect.left + dx}px`;
    object.style.top = `${rect.top + dy}px`;
}

// Funções de utilidade
function setTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tool}-tool`).classList.add('active');
    
    // Atualizar cursor
    if (tool === 'draw' || tool === 'eraser') {
        canvas.style.cursor = 'crosshair';
    } else if (tool === 'select') {
        canvas.style.cursor = 'default';
    } else {
        canvas.style.cursor = 'pointer';
    }
}

function setBackground(type) {
    workspace.className = `workspace ${type}`;
    document.querySelectorAll('.background-options .tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${type}-bg`).classList.add('active');
}

function toggleTheme() {
    isLightTheme = !isLightTheme;
    document.body.classList.toggle('light', isLightTheme);
    document.getElementById('theme-toggle').innerHTML = 
        isLightTheme ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

function updateBrushStyle() {
    ctx.strokeStyle = currentTool === 'eraser' ? '#000000' : currentColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = brushOpacity / 100;
    
    switch (brushType) {
        case 'pen':
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            break;
        case 'marker':
            ctx.lineCap = 'square';
            ctx.lineJoin = 'miter';
            break;
        case 'pencil':
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = 0.5;
            break;
    }
}

// Inicialização
window.addEventListener('load', () => {
    setupCanvas();
    const savedData = localStorage.getItem('mindCanvas');
    if (savedData) {
        canvases = JSON.parse(savedData);
    }
    initializeCanvasManagement();
});

// Salvar automaticamente a cada 30 segundos
setInterval(saveCurrentCanvas, 30000);

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
            case 's':
                e.preventDefault();
                saveCurrentCanvas();
                break;
            case 'z':
                e.preventDefault();
                // Implementar desfazer
                break;
            case 'y':
                e.preventDefault();
                // Implementar refazer
                break;
        }
    }
});
