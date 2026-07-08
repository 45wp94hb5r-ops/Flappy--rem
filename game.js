function drawScore(){

    ctx.fillStyle="white";
    ctx.font="bold 42px Arial";
    ctx.textAlign="center";

    ctx.fillText(
        score,
        canvas.width/2,
        60
    );

}

function endGame(){

    if(!playing) return;

    playing=false;

    music.pause();

    hitSound.currentTime=0;
    hitSound.play().catch(()=>{});

    if(navigator.vibrate){
        navigator.vibrate(150);
    }

    if(score>best){
        best=score;
        localStorage.setItem("best",best);
    }

    scoreText.textContent=
        "Skor : "+score+
        " | En İyi : "+best;

    gameOver.style.display="flex";

}

function loop(){

    if(!playing) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();

    update();

    drawClouds();

    drawPipes();

    drawHearts();

    drawBird();

    drawScore();

    requestAnimationFrame(loop);

}function drawBackground() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
}

function drawClouds() {
    clouds.forEach(c => {

        c.x -= 0.4 * c.s;

        if (c.x < -180) {
            c.x = canvas.width + 50;
            c.y = Math.random() * 220;
        }

        ctx.drawImage(
            cloudImg,
            c.x,
            c.y,
            150 * c.s,
            80 * c.s
        );

    });
}

function drawBird() {

    ctx.save();

    ctx.translate(
        bird.x + bird.w / 2,
        bird.y + bird.h / 2
    );

    ctx.rotate(bird.vel * 0.05);

    ctx.drawImage(
        birdImg,
        -bird.w / 2,
        -bird.h / 2,
        bird.w,
        bird.h
    );

    ctx.restore();

}

function drawPipes() {

    pipes.forEach(p => {

        ctx.drawImage(
            pipeImg,
            p.x,
            0,
            80,
            p.top
        );

        ctx.save();

        ctx.translate(
            p.x + 40,
            p.bottom
        );

        ctx.rotate(Math.PI);

        ctx.drawImage(
            pipeImg,
            -40,
            0,
            80,
            canvas.height - p.bottom
        );

        ctx.restore();

    });

}

function drawHearts() {

    for (let i = hearts.length - 1; i >= 0; i--) {

        let h = hearts[i];

        h.y -= 1.2;
        h.life--;

        ctx.globalAlpha = h.life / 30;

        ctx.drawImage(
            heartImg,
            h.x,
            h.y,
            18,
            18
        );

        ctx.globalAlpha = 1;

        if (h.life <= 0) {
            hearts.splice(i, 1);
        }

    }

}function update() {

    bird.vel += gravity;
    bird.y += bird.vel;

    pipes.forEach(p => {

        p.x -= 3.5;

        if (
            bird.x + bird.w - 15 > p.x &&
            bird.x + 15 < p.x + 80 &&
            (
                bird.y + 15 < p.top ||
                bird.y + bird.h - 15 > p.bottom
            )
        ) {
            endGame();
        }

        if (!p.passed && p.x + 80 < bird.x) {

            p.passed = true;
            score++;

            pointSound.currentTime = 0;
            pointSound.play().catch(() => {});

            for (let i = 0; i < 10; i++) {

                hearts.push({
                    x: bird.x + bird.w / 2 + Math.random() * 20 - 10,
                    y: bird.y + bird.h / 2,
                    life: 30
                });

            }

        }

    });

    pipes = pipes.filter(p => p.x > -100);

    if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x < 220
    ) {
        createPipe();
    }

    if (
        bird.y < 0 ||
        bird.y + bird.h > canvas.height
    ) {
        endGame();
    }

}function drawScore() {

    ctx.fillStyle = "white";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        score,
        canvas.width / 2,
        60
    );

}

function endGame() {

    if (!playing) return;

    playing = false;

    music.pause();

    hitSound.currentTime = 0;
    hitSound.play().catch(() => {});

    if (navigator.vibrate) {
        navigator.vibrate(150);
    }

    if (score > best) {
        best = score;
        localStorage.setItem("best", best);
    }

    scoreText.textContent =
        "Skor : " + score +
        " | En İyi : " + best;

    gameOver.style.display = "flex";

}

function loop() {

    if (!playing) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();

    update();

    drawClouds();

    drawPipes();

    drawHearts();

    drawBird();

    drawScore();

    requestAnimationFrame(loop);

}
