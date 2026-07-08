//========================
// FLAPPY İREM - PART 1
//========================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

const menu = document.getElementById("menu");
const gameOver = document.getElementById("gameOver");
const scoreText = document.getElementById("scoreText");

// Resimler
const bg = new Image();
bg.src = "images/bg.PNG";

const birdImg = new Image();
birdImg.src = "images/irem.PNG";

const pipeImg = new Image();
pipeImg.src = "images/pipe.PNG";

const cloudImg = new Image();
cloudImg.src = "images/cloud.PNG";

const heartImg = new Image();
heartImg.src = "images/heart.PNG";

// Sesler
const jumpSound = document.getElementById("jumpSound");
const hitSound = document.getElementById("hitSound");
const pointSound = document.getElementById("pointSound");
const music = document.getElementById("music");

// Oyun değişkenleri
let playing = false;
let loveLevel = 0;
let score = 0;
let best = Number(localStorage.getItem("best")) || 0;

const gravity = 0.45;
const jumpPower = -8;
const pipeWidth = 90;

const bird = {
    x: 90,
    y: 300,
    w: 60,
    h: 60,
    vel: 0
};

let pipes = [];
let hearts = [];
let clouds = [];

for (let i = 0; i < 5; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * 220,
        s: Math.random() * 0.5 + 0.7
    });
}

function createPipe() {
    const gap = 180;
    const top = Math.random() * 220 + 80;

    pipes.push({
        x: canvas.width,
        top: top,
        bottom: top + gap,
        passed: false
    });
}

function startGame() {

    menu.style.display = "none";
    gameOver.style.display = "none";
    canvas.style.display = "block";

    bird.x = 90;
    bird.y = 300;
    bird.vel = 0;

    score = 0;

    pipes = [];
    hearts = [];

    createPipe();

   playing = true;

music.pause();
music.currentTime = 0;
music.play().catch(()=>{});

requestAnimationFrame(loop);

}

function restartGame(){
    startGame();
}

function backMenu(){

    playing = false;

    canvas.style.display = "none";
    gameOver.style.display = "none";
    menu.style.display = "flex";

}

function flap(){

    if(!playing) return;

    bird.vel = jumpPower;

    jumpSound.currentTime = 0;
    jumpSound.play().catch(()=>{});

}

canvas.addEventListener("click", flap);

canvas.addEventListener("touchstart", e=>{
    e.preventDefault();
    flap();
});

document.addEventListener("keydown", e=>{
    if(e.code==="Space"){
        flap();
    }
});//========================
// ÇİZİM FONKSİYONLARI
//========================

function drawBackground() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
}

function drawClouds() {

    clouds.forEach(c => {

        c.x -= 0.4 * c.s;

        if (c.x < -180) {

            c.x = canvas.width + 30;
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

        // Alt boru
        ctx.drawImage(
            pipeImg,
            p.x,
            p.bottom,
            pipeWidth,
            canvas.height - p.bottom
        );

        // Üst boru
        ctx.save();

        ctx.translate(
            p.x + pipeWidth / 2,
            p.top
        );

        ctx.rotate(Math.PI);

        ctx.drawImage(
            pipeImg,
            -pipeWidth / 2,
            -0,
            pipeWidth,
            p.top
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

}

function drawScore() {

    ctx.fillStyle = "white";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        score,
        canvas.width / 2,
        60
    );

}//========================
// OYUN GÜNCELLEME
//========================

function update() {

    bird.vel += gravity;
    bird.y += bird.vel;

    pipes.forEach(p => {

        p.x -= 3.5;

        // Çarpışma
const hitbox = 24;

if (
    bird.x + bird.w - hitbox > p.x + 10 &&
    bird.x + hitbox < p.x + pipeWidth - 10 &&
    (
        bird.y + hitbox < p.top ||
        bird.y + bird.h - hitbox > p.bottom
    )
) {
    endGame();
}


        // Skor
       if (!p.passed && p.x + pipeWidth - 10 < bird.x) {

            p.passed = true;
            score++;

            pointSound.currentTime = 0;
            pointSound.play().catch(()=>{});

            for(let i=0;i<5;i++){

                hearts.push({
                    x:bird.x+bird.w/2+(Math.random()*20-10),
                    y:bird.y+bird.h/2,
                    life:30
                });

            }

        }

    });

    pipes = pipes.filter(p=>p.x>-100);

    if(
        pipes.length===0 ||
        pipes[pipes.length-1].x<220
    ){
        createPipe();
    }

    if(
        bird.y<0 ||
        bird.y+bird.h>canvas.height
    ){
        endGame();
    }

}

function endGame(){

    if(!playing) return;

    playing=false;

    music.pause();
    music.currentTime = 0;

    hitSound.currentTime=0;
    hitSound.play().catch(()=>{});

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
    
    requestAnimationFrame(loop)

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

}//========================
// BAŞLANGIÇ AYARLARI
//========================

// Resimler yüklenince ilk ekranı çiz
bg.onload = () => {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
};
// Canvas'a odaklan
canvas.setAttribute("tabindex", "1");
// ❤️ İrem butonu

const loveButton = document.getElementById("loveButton");

const loveLevels = [10, 40, 70, 100, "emin"];
let loveIndex = 0;

loveButton.onclick = function () {

    const value = loveLevels[loveIndex];
    const mesaj = document.createElement("div");

    if (value === "emin") {

        mesaj.innerHTML = `
        🤨<br><br>
        <b>Emin misin?</b><br><br>
        ❤️ Fazla dozda İrem almaya devam edeceksin.
        `;

    } else if (value < 100) {

        mesaj.innerHTML = `
        ❤️<br><br>
        <b>İrem Dozu</b><br><br>
        <span style="font-size:55px;">%${value}</span>
        `;

    } else {

        mesaj.innerHTML = `
        ❤️❤️❤️<br><br>
        <span style="font-size:55px;">%100</span><br><br>
        <b>⚠️ Fazla dozda İrem aldın! 💖</b>
        `;

        // 💖 Büyük aşk patlaması
        for (let i = 0; i < 180; i++) {

            const heart = document.createElement("div");
            const emojis = ["💖","💗","💕","❤️","💘","✨","🌸"];

            heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

            heart.style.position = "fixed";
            heart.style.left = Math.random() * window.innerWidth + "px";
            heart.style.top = Math.random() * window.innerHeight + "px";
            heart.style.fontSize = (20 + Math.random() * 50) + "px";
            heart.style.pointerEvents = "none";
            heart.style.zIndex = "999999";
            heart.style.transition = "all 3s ease-out";

            document.body.appendChild(heart);

            setTimeout(() => {
                heart.style.transform =
                    `translate(${Math.random()*600-300}px, ${Math.random()*600-300}px)
                     rotate(${Math.random()*1080}deg)
                     scale(${1 + Math.random()*2})`;
                heart.style.opacity = "0";
            }, 30);

            setTimeout(() => {
                heart.remove();
            }, 3000);
        }
    }

    mesaj.style.position = "fixed";
    mesaj.style.top = "50%";
    mesaj.style.left = "50%";
    mesaj.style.transform = "translate(-50%,-50%)";
    mesaj.style.background = "#ff69b4";
    mesaj.style.color = "white";
    mesaj.style.padding = "30px";
    mesaj.style.borderRadius = "25px";
    mesaj.style.textAlign = "center";
    mesaj.style.fontSize = "28px";
    mesaj.style.fontWeight = "bold";
    mesaj.style.boxShadow = "0 0 30px hotpink";
    mesaj.style.zIndex = "99999";

    document.body.appendChild(mesaj);

    setTimeout(() => {
        mesaj.remove();
    }, 1800);

    loveIndex++;

    if (loveIndex >= loveLevels.length) {
        loveIndex = 0;
    }
};
// 💖 Büyük aşk patlaması
for (let i = 0; i < 180; i++) {

    const heart = document.createElement("div");

    const emojis = ["💖","💗","💕","❤️","💘","✨","🌸"];
    heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

    heart.style.position = "fixed";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.top = Math.random() * window.innerHeight + "px";
    heart.style.fontSize = (20 + Math.random() * 50) + "px";
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "999999";
    heart.style.transition = "all 3s ease-out";

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.style.transform =
            `translate(${Math.random()*600-300}px, ${Math.random()*600-300}px)
             rotate(${Math.random()*1080}deg)
             scale(${1 + Math.random()*2})`;

        heart.style.opacity = "0";
    }, 30);

    setTimeout(() => {
        heart.remove();
    }, 3000);
}
    }

    mesaj.style.position = "fixed";

    mesaj.style.top = "50%";

    mesaj.style.left = "50%";

    mesaj.style.transform = "translate(-50%,-50%)";

    mesaj.style.background = "#ff69b4";

    mesaj.style.color = "white";

    mesaj.style.padding = "30px";

    mesaj.style.borderRadius = "25px";

    mesaj.style.textAlign = "center";

    mesaj.style.fontSize = "28px";

    mesaj.style.fontWeight = "bold";

    mesaj.style.boxShadow = "0 0 30px hotpink";

    mesaj.style.zIndex = "99999";

    document.body.appendChild(mesaj);

    // 💖 Kalp efekti

    for (let i = 0; i < 40; i++) {

        const heart = document.createElement("div");

        heart.innerHTML = "💖";

        heart.style.position = "fixed";

        heart.style.left = Math.random() * window.innerWidth + "px";

        heart.style.top = window.innerHeight + "px";

        heart.style.fontSize = (20 + Math.random() * 30) + "px";

        heart.style.pointerEvents = "none";

        heart.style.transition = "all 3s ease-out";

        heart.style.zIndex = "99998";

        document.body.appendChild(heart);

        setTimeout(() => {

            heart.style.top = (-100 - Math.random() * 200) + "px";

            heart.style.left =

                (parseFloat(heart.style.left) + (Math.random() * 300 - 150)) + "px";

            heart.style.opacity = "0";

            heart.style.transform = `rotate(${Math.random() * 720}deg) scale(1.5)`;

        }, 20);

        setTimeout(() => {

            heart.remove();

        }, 3000);

    }

    setTimeout(() => {

        mesaj.remove();

    }, 1800);

    loveIndex++;

    if (loveIndex >= loveLevels.length) {

        loveIndex = 0;

    }

};

// Telefonlarda kaydırmayı engelle

document.body.addEventListener(

    "touchmove",

    function (e) {

        if (playing) e.preventDefault();

    },

    { passive: false }
    );
    
