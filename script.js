const gameArea = document.getElementById('gameArea');
const restartButton = document.getElementById('restartButton');
const gameSize = 400;
const cellSize = 20;

let snake, direction, food, gameLoop;

function initGame() {
    snake = [{x: 200, y: 200}];
    direction = {x: cellSize, y: 0};  // Mengatur arah awal ke kanan
    food = {x: 100, y: 100};
    restartButton.style.display = 'none';  // Sembunyikan tombol restart saat game dimulai
    gameLoop = setInterval(() => {
        moveSnake();
        drawSnake();
    }, 100);
}

function createDiv(className) {
    const div = document.createElement('div');
    div.className = className;
    div.style.position = 'absolute';
    div.style.width = cellSize + 'px';
    div.style.height = cellSize + 'px';
    return div;
}

function drawSnake() {
    gameArea.innerHTML = '';  // Bersihkan area permainan sebelum menggambar ulang

    // Gambar ulang setiap bagian ular
    snake.forEach(part => {
        const snakePart = createDiv('snake');
        snakePart.style.left = part.x + 'px';
        snakePart.style.top = part.y + 'px';
        gameArea.appendChild(snakePart);
    });

    // Gambar makanan
    drawFood();
}

function drawFood() {
    // Buat elemen makanan
    const foodDiv = createDiv('food');
    foodDiv.style.left = food.x + 'px';
    foodDiv.style.top = food.y + 'px';
    gameArea.appendChild(foodDiv);
}

function moveSnake() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    if (head.x === food.x && head.y === food.y) {
        // Pindahkan makanan ke lokasi baru
        food = {
            x: Math.floor(Math.random() * (gameSize / cellSize)) * cellSize,
            y: Math.floor(Math.random() * (gameSize / cellSize)) * cellSize
        };
    } else {
        snake.pop();  // Hapus bagian terakhir ular kecuali jika makanan dimakan
    }

    snake.unshift(head);  // Tambahkan kepala baru di depan ular

    // Periksa jika ular bertabrakan dengan dinding atau dengan dirinya sendiri
    if (
        head.x < 0 || head.x >= gameSize || 
        head.y < 0 || head.y >= gameSize || 
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    ) {
        clearInterval(gameLoop);  // Hentikan game loop saat kalah
        restartButton.style.display = 'block';  // Tampilkan tombol restart
        alert('Game Over');
    }
}

function changeDirection(event) {
    const keyMap = {
        37: {x: -cellSize, y: 0},  // Kiri
        38: {x: 0, y: -cellSize},  // Atas
        39: {x: cellSize, y: 0},   // Kanan
        40: {x: 0, y: cellSize}    // Bawah
    };

    const newDirection = keyMap[event.keyCode];

    if (newDirection) {
        const currentDirection = snake.length > 1 
            ? {x: snake[0].x - snake[1].x, y: snake[0].y - snake[1].y}
            : direction;

        // Cegah ular berbalik arah ke dirinya sendiri
        if (newDirection.x !== -currentDirection.x && newDirection.y !== -currentDirection.y) {
            direction = newDirection;
        }
    }
}

function handleMobileControl(buttonId) {
    const controlMap = {
        up: {x: 0, y: -cellSize},
        down: {x: 0, y: cellSize},
        left: {x: -cellSize, y: 0},
        right: {x: cellSize, y: 0}
    };

    const newDirection = controlMap[buttonId];

    if (newDirection) {
        const currentDirection = snake.length > 1 
            ? {x: snake[0].x - snake[1].x, y: snake[0].y - snake[1].y}
            : direction;

        if (newDirection.x !== -currentDirection.x && newDirection.y !== -currentDirection.y) {
            direction = newDirection;
        }
    }
}

document.addEventListener('keydown', changeDirection);
restartButton.addEventListener('click', () => {
    clearInterval(gameLoop);  // Hentikan game loop jika sedang berjalan
    initGame();  // Mulai game baru
});

document.getElementById('up').addEventListener('click', () => handleMobileControl('up'));
document.getElementById('down').addEventListener('click', () => handleMobileControl('down'));
document.getElementById('left').addEventListener('click', () => handleMobileControl('left'));
document.getElementById('right').addEventListener('click', () => handleMobileControl('right'));

initGame();  // Inisialisasi game saat pertama kali dimuat
