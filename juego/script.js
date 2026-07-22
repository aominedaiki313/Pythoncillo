// Configuración del Canvas y Contexto
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Elementos de la interfaz (DOM)
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const difficultySelect = document.getElementById('difficulty');
const btnStart = document.getElementById('btn-start');
const btnMute = document.getElementById('btn-mute');
const muteIcon = document.getElementById('mute-icon');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMsg = document.getElementById('modal-msg');
const finalScoreEl = document.getElementById('final-score');
const btnRestart = document.getElementById('btn-restart');

// Botones D-Pad virtuales para móviles
const btnUp = document.getElementById('ctrl-up');
const btnDown = document.getElementById('ctrl-down');
const btnLeft = document.getElementById('ctrl-left');
const btnRight = document.getElementById('ctrl-right');

// Constantes de juego
const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE; // 20x20 rejilla

// Velocidades según dificultad (milisegundos por frame)
const SPEEDS = {
    easy: 140,
    medium: 90,
    hard: 60
};

// Variables de Estado del Juego
let snake = [];
let food = { x: 0, y: 0 };
let dx = 0; // Dirección actual en X
let dy = 0; // Dirección actual en Y
let nextDx = 0; // Siguiente dirección (evita autocolisión en giros rápidos)
let nextDy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameInterval = null;
let lastUpdateTime = 0;
let isGameOver = false;
let isPaused = true;
let isMuted = false;

// Inicialización de la Web Audio API (Lazy loading por restricciones del navegador)
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sintetizador de efectos de sonido
function playSound(type) {
    if (isMuted) return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'eat') {
        // Tono ascendente y dulce (onda sinusoidal)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (type === 'die') {
        // Tono ruidoso y descendente (onda diente de sierra)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    }
}

// Formatear números a tres dígitos (ej. "007")
function formatNumber(num) {
    return String(num).padStart(3, '0');
}

// Actualizar marcadores de puntuación en el DOM
function updateScoreboard() {
    scoreEl.textContent = formatNumber(score);
    highScoreEl.textContent = formatNumber(highScore);
}

// Iniciar variables para una nueva partida
function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    // Dirección inicial (moviendo a la derecha)
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    score = 0;
    isGameOver = false;
    updateScoreboard();
    placeFood();
}

// Ubicar la comida en una celda vacía al azar
function placeFood() {
    let validPosition = false;
    while (!validPosition) {
        food.x = Math.floor(Math.random() * TILE_COUNT);
        food.y = Math.floor(Math.random() * TILE_COUNT);
        
        // Validar que la comida no aparezca sobre el cuerpo de la serpiente
        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
}

// Bucle principal de Renderizado y Actualización
function gameLoop(timestamp) {
    if (isPaused || isGameOver) return;

    requestAnimationFrame(gameLoop);

    const elapsed = timestamp - lastUpdateTime;
    const currentSpeed = SPEEDS[difficultySelect.value];

    if (elapsed >= currentSpeed) {
        lastUpdateTime = timestamp;
        update();
        draw();
    }
}

// Actualización lógica del estado del juego
function update() {
    // Aplicar las nuevas direcciones validadas
    dx = nextDx;
    dy = nextDy;

    // Calcular la posición futura de la cabeza
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Detección de colisiones con bordes
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        endGame("Has chocado con la pared.");
        return;
    }

    // Detección de colisión consigo misma
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame("¡Te has mordido la cola!");
        return;
    }

    // Insertar nueva cabeza
    snake.unshift(head);

    // Detección de alimentación
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
        }
        updateScoreboard();
        playSound('eat');
        placeFood();
    } else {
        // Quitar la cola si no come (movimiento ordinario)
        snake.pop();
    }
}

// Renderizado gráfico con efectos Neón
function draw() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar rejilla retro sutil de fondo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= TILE_COUNT; i++) {
        // Líneas verticales
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        
        // Líneas horizontales
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }

    // Dibujar Comida (Círculo rosa neón pulsante)
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff007f';
    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    const foodRadius = GRID_SIZE / 2 - 2;
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        foodRadius,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    // Dibujar Serpiente (Cian neón brillante)
    snake.forEach((segment, index) => {
        ctx.save();
        ctx.shadowBlur = index === 0 ? 15 : 6;
        ctx.shadowColor = '#00f0ff';
        
        // Color ligeramente diferente para la cabeza
        ctx.fillStyle = index === 0 ? '#ffffff' : '#00f0ff';
        
        // Dibujo con bordes redondeados
        const r = 4; // Radio del redondeo
        const x = segment.x * GRID_SIZE + 1;
        const y = segment.y * GRID_SIZE + 1;
        const w = GRID_SIZE - 2;
        const h = GRID_SIZE - 2;
        
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    });
}

// Terminar juego
function endGame(message) {
    isGameOver = true;
    playSound('die');
    
    // Mostrar modal con estadísticas
    modalTitle.textContent = "GAME OVER";
    modalMsg.textContent = message;
    finalScoreEl.textContent = score;
    modal.classList.remove('hidden');
    
    btnStart.textContent = "INICIAR";
    isPaused = true;
}

// Alternar entre pausa e inicio
function togglePlay() {
    if (isGameOver) {
        resetGame();
    }
    
    if (isPaused) {
        isPaused = false;
        btnStart.textContent = "PAUSA";
        modal.classList.add('hidden');
        lastUpdateTime = performance.now();
        requestAnimationFrame(gameLoop);
    } else {
        isPaused = true;
        btnStart.textContent = "REANUDAR";
        modalTitle.textContent = "PAUSA";
        modalMsg.textContent = "Presiona Reanudar o la tecla de inicio.";
        finalScoreEl.textContent = score;
        modal.classList.remove('hidden');
    }
}

// Cambios de dirección e impedir que se mueva directamente al sentido opuesto
function changeDirection(newDx, newDy) {
    if (isPaused || isGameOver) return;
    
    // Evita autocolisión de 180 grados
    if (newDx !== 0 && dx === -newDx) return;
    if (newDy !== 0 && dy === -newDy) return;

    nextDx = newDx;
    nextDy = newDy;
}

// Configuración de Controles por Teclado
document.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
            changeDirection(0, -1);
            e.preventDefault();
            break;
        case 'arrowdown':
        case 's':
            changeDirection(0, 1);
            e.preventDefault();
            break;
        case 'arrowleft':
        case 'a':
            changeDirection(-1, 0);
            e.preventDefault();
            break;
        case 'arrowright':
        case 'd':
            changeDirection(1, 0);
            e.preventDefault();
            break;
        case ' ': // Tecla barra espaciadora para Pausa/Inicio
            togglePlay();
            e.preventDefault();
            break;
    }
});

// Eventos de botones táctiles para móviles
btnUp.addEventListener('touchstart', (e) => { changeDirection(0, -1); e.preventDefault(); });
btnDown.addEventListener('touchstart', (e) => { changeDirection(0, 1); e.preventDefault(); });
btnLeft.addEventListener('touchstart', (e) => { changeDirection(-1, 0); e.preventDefault(); });
btnRight.addEventListener('touchstart', (e) => { changeDirection(1, 0); e.preventDefault(); });

btnUp.addEventListener('mousedown', () => changeDirection(0, -1));
btnDown.addEventListener('mousedown', () => changeDirection(0, 1));
btnLeft.addEventListener('mousedown', () => changeDirection(-1, 0));
btnRight.addEventListener('mousedown', () => changeDirection(1, 0));

// Botón de Inicio e interacción
btnStart.addEventListener('click', () => {
    initAudio();
    togglePlay();
});

btnRestart.addEventListener('click', () => {
    initAudio();
    resetGame();
    togglePlay();
});

// Botón de Silenciador
btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        muteIcon.textContent = "🔇";
        btnMute.style.borderColor = "var(--neon-pink)";
    } else {
        muteIcon.textContent = "🔊";
        btnMute.style.borderColor = "var(--border-color)";
    }
});

// Forzar actualización inicial
highScoreEl.textContent = formatNumber(highScore);
resetGame();
draw();
