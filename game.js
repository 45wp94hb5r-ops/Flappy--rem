const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

const menu = document.getElementById("menu");
const gameOver = document.getElementById("gameOver");
const scoreText = document.getElementById("scoreText");

const bird = new Image();
bird.src = "irem.png";

let gravity = 0.45;
let velocity = 0;
let birdX = 90;
let birdY = 300;
let birdSize = 80;

let pipes = [];
let score = 0;
let bestScore = Number(localStorage.getItem("bestScore") || 0);

let playing = false;

function startGame() {
    menu.style.display = "none";
    canvas.style.display = "block";
    gameOver.style.display = "none";

    birdY = 300;
    velocity = 0;
    score = 0;
    pipes = [];
    playing = true;

    createPipe();
    requestAnimationFrame(loop);
}

function restartGame() {
    startGame();
}

document.addEventListener("mousedown", jump);
document.addEventListener("touchstart", jump);

function jump() {
    if (!playing) return;
    velocity = -8;
}
function createPipe() {
    const gap = 190;
    const topHeight = Math.random() * 220 + 80;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap,
        passed: false
    });
}

function drawBird() {
    ctx.drawImage(bird, birdX, birdY, birdSize, birdSize);
}

function drawPipes() {

    ctx.fillStyle = "#ff8fc6";

    pipes.forEach(pipe => {

        ctx.fillRect(pipe.x, 0, 70, pipe.top);

        ctx.fillRect(
            pipe.x,
            pipe.bottom,
            70,
            canvas.height - pipe.bottom
        );

    });

}

function updatePipes() {

    pipes.forEach(pipe => {

        pipe.x -= 3;

        if (!pipe.passed && pipe.x + 70 < birdX) {

            pipe.passed = true;
            score++;

        }

        if (
            birdX + birdSize > pipe.x &&
            birdX < pipe.x + 70 &&
            (
                birdY < pipe.top ||
                birdY + birdSize > pipe.bottom
            )
        ) {

            endGame();

        }

    });

    pipes = pipes.filter(pipe => pipe.x > -70);

    if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x < 220
    ) {

        createPipe();

    }

}
