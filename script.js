// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;
const ballSpeed = 5;

let gameStarted = false;
let gameSpeed = ballSpeed;

// Paddle positions
let playerPaddleY = canvas.height / 2 - paddleHeight / 2;
let computerPaddleY = canvas.height / 2 - paddleHeight / 2;

// Ball position and velocity
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelX = ballSpeed;
let ballVelY = ballSpeed;

// Scores
let playerScore = 0;
let computerScore = 0;

// Keyboard input
const keys = {
    up: false,
    down: false
};

// Mouse tracking
let mouseY = canvas.height / 2;

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        if (!gameStarted) {
            gameStarted = true;
            document.getElementById('gameStatus').textContent = 'Game Running...';
        }
    }
    if (e.key === 'ArrowUp') {
        keys.up = true;
    }
    if (e.key === 'ArrowDown') {
        keys.down = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        keys.up = false;
    }
    if (e.key === 'ArrowDown') {
        keys.down = false;
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle with mouse or keyboard
function updatePlayerPaddle() {
    // Mouse control
    if (mouseY > 0 && mouseY < canvas.height) {
        playerPaddleY = mouseY - paddleHeight / 2;
    }

    // Keyboard control (overrides mouse if used)
    if (keys.up && playerPaddleY > 0) {
        playerPaddleY -= 6;
    }
    if (keys.down && playerPaddleY < canvas.height - paddleHeight) {
        playerPaddleY += 6;
    }

    // Boundary check
    if (playerPaddleY < 0) playerPaddleY = 0;
    if (playerPaddleY > canvas.height - paddleHeight) {
        playerPaddleY = canvas.height - paddleHeight;
    }
}

// Computer AI (simple tracking)
function updateComputerPaddle() {
    const computerCenter = computerPaddleY + paddleHeight / 2;
    const difficulty = 4;

    if (computerCenter < ballY - 35) {
        if (computerPaddleY < canvas.height - paddleHeight) {
            computerPaddleY += difficulty;
        }
    } else if (computerCenter > ballY + 35) {
        if (computerPaddleY > 0) {
            computerPaddleY -= difficulty;
        }
    }

    // Boundary check
    if (computerPaddleY < 0) computerPaddleY = 0;
    if (computerPaddleY > canvas.height - paddleHeight) {
        computerPaddleY = canvas.height - paddleHeight;
    }
}

// Update ball position
function updateBall() {
    ballX += ballVelX;
    ballY += ballVelY;

    // Top and bottom wall collision
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballVelY = -ballVelY;
        // Ensure ball stays in bounds
        ballY = Math.max(ballSize, Math.min(canvas.height - ballSize, ballY));
    }

    // Left paddle collision
    if (
        ballX - ballSize < paddleWidth &&
        ballY > playerPaddleY &&
        ballY < playerPaddleY + paddleHeight
    ) {
        ballVelX = -ballVelX;
        ballX = paddleWidth + ballSize;
        // Add some variation based on where ball hits paddle
        const collidePoint = ballY - (playerPaddleY + paddleHeight / 2);
        ballVelY = (collidePoint / (paddleHeight / 2)) * ballSpeed;
    }

    // Right paddle collision
    if (
        ballX + ballSize > canvas.width - paddleWidth &&
        ballY > computerPaddleY &&
        ballY < computerPaddleY + paddleHeight
    ) {
        ballVelX = -ballVelX;
        ballX = canvas.width - paddleWidth - ballSize;
        // Add some variation based on where ball hits paddle
        const collidePoint = ballY - (computerPaddleY + paddleHeight / 2);
        ballVelY = (collidePoint / (paddleHeight / 2)) * ballSpeed;
    }

    // Scoring
    if (ballX - ballSize < 0) {
        computerScore++;
        resetBall();
        document.getElementById('computerScore').textContent = computerScore;
    }

    if (ballX + ballSize > canvas.width) {
        playerScore++;
        resetBall();
        document.getElementById('playerScore').textContent = playerScore;
    }
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVelX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = (Math.random() - 0.5) * ballSpeed;
    gameStarted = false;
    document.getElementById('gameStatus').textContent = 'Press SPACE to continue';
}

// Draw functions
function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawCenterLine();
    drawPaddle(5, playerPaddleY, paddleWidth, paddleHeight, '#00ff00');
    drawPaddle(
        canvas.width - paddleWidth - 5,
        computerPaddleY,
        paddleWidth,
        paddleHeight,
        '#ff0066'
    );
    drawBall();
}

// Main game loop
function gameLoop() {
    if (gameStarted) {
        updatePlayerPaddle();
        updateComputerPaddle();
        updateBall();
    } else {
        updatePlayerPaddle();
        updateComputerPaddle();
    }

    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Initialize display
document.getElementById('playerScore').textContent = playerScore;
document.getElementById('computerScore').textContent = computerScore;
