const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;

// Menü
const menu = document.getElementById("menu");
const gameOver = document.getElementById("gameOver");
const scoreText = document.getElementById("scoreText");

// Sesler
const jumpSound = document.getElementById("jumpSound");
const hitSound = document.getElementById("hitSound");
const pointSound = document.getElementById("pointSound");
const music = document.getElementById("music");

// Resimler
const bg = new Image();
bg.src = "images/bg.PNG";

const bird = new Image();
bird.src = "images/irem.PNG";

const pipe = new Image();
pipe.src = "images/pipe.PNG";

const cloud = new Image();
cloud.src = "images/cloud.PNG";

const heart = new Image();
heart.src = "images/heart.PNG";


// Kuş
let birdX = 90;
let birdY = 300;
let birdSize = 80;

let velocity = 0;
let gravity = 0.55;


// Oyun
let score = 0;
let bestScore = Number(localStorage.getItem("bestScore") || 0);

let playing = false;


// Borular
let pipes = [];


// Bulutlar
let clouds = [
    {x:20,y:50,s:1},
    {x:180,y:150,s:0.8},
    {x:340,y:80,s:1.2}
];


// Kalp parçaları
let particles = [];


// Başlat
function startGame(){

    menu.style.display="none";
    gameOver.style.display="none";
    canvas.style.display="block";

    birdY=300;
    velocity=-8;

    score=0;

    pipes=[];
    particles=[];

    createPipe();

    playing=true;

    music.currentTime=0;
    music.volume=.35;

    music.play().catch(()=>{});

    loop();
}


// Yeniden başlat
function restartGame(){

    startGame();

}


// Menü
function backMenu(){

    playing=false;

    music.pause();

    canvas.style.display="none";
    gameOver.style.display="none";
    menu.style.display="flex";

}


// Zıplama
function jump(){

    if(!playing) return;

    velocity=-8;

    jumpSound.currentTime=0;
    jumpSound.play().catch(()=>{});

}


document.addEventListener("mousedown",jump);

document.addEventListener("touchstart",function(e){
    e.preventDefault();
    jump();
},{passive:false});


// Boru oluştur
function createPipe(){

    const gap = 220;

    const top = Math.random()*220+70;


    pipes.push({

        x:canvas.width,

        top:top,

        bottom:top+gap,

        passed:false

    });

}// =========================
// ARKA PLAN
// =========================

function drawBackground(){

    ctx.drawImage(
        bg,
        0,
        0,
        canvas.width,
        canvas.height
    );

}


// =========================
// BULUTLAR
// =========================

function drawClouds(){

    clouds.forEach(c=>{

        c.x-=0.4*c.s;

        if(c.x<-180){

            c.x=canvas.width+50;

            c.y=Math.random()*220;

        }


        ctx.drawImage(

            cloud,

            c.x,

            c.y,

            150*c.s,

            80*c.s

        );

    });

}


// =========================
// BORULAR
// =========================

function drawPipes(){

    pipes.forEach(p=>{


        ctx.drawImage(

            pipe,

            p.x,

            0,

            80,

            p.top

        );


        ctx.save();

        ctx.translate(
            p.x+40,
            p.bottom
        );

        ctx.rotate(Math.PI);


        ctx.drawImage(

            pipe,

            -40,

            0,

            80,

            canvas.height-p.bottom

        );


        ctx.restore();


    });

}


// =========================
// KUŞ
// =========================

function drawBird(){

    ctx.save();


    ctx.translate(

        birdX+birdSize/2,

        birdY+birdSize/2

    );


    ctx.rotate(

        velocity*0.05

    );


    ctx.drawImage(

        bird,

        -birdSize/2,

        -birdSize/2,

        birdSize,

        birdSize

    );


    ctx.restore();

}


// =========================
// KALP EFEKTİ
// =========================

function drawParticles(){

    for(let i=particles.length-1;i>=0;i--){

        let p=particles[i];


        p.y-=1.2;

        p.life--;


        ctx.globalAlpha=p.life/30;


        ctx.drawImage(

            heart,

            p.x,

            p.y,

            18,

            18

        );


        ctx.globalAlpha=1;


        if(p.life<=0){

            particles.splice(i,1);

        }

    }

}


// =========================
// GÜNCELLEME
// =========================

function update(){


    velocity += gravity;

    birdY += velocity;



    pipes.forEach(p=>{


        p.x -= 3.5;



        if(

            birdX + birdSize - 15 > p.x &&

            birdX + 15 < p.x + 80 &&

            (

                birdY + 15 < p.top ||

                birdY + birdSize - 15 > p.bottom

            )

        ){

            endGame();

        }



        if(

            !p.passed &&

            p.x + 80 < birdX

        ){

            p.passed=true;

            score++;


            pointSound.currentTime=0;

            pointSound.play().catch(()=>{});



            for(let i=0;i<10;i++){

                particles.push({

                    x:birdX+40+Math.random()*20-10,

                    y:birdY+40,

                    life:30

                });

            }

        }


    });



    pipes=pipes.filter(p=>p.x>-100);



    if(

        pipes.length===0 ||

        pipes[pipes.length-1].x<220

    ){

        createPipe();

    }



    if(

        birdY<0 ||

        birdY+birdSize>canvas.height

    ){

        endGame();

    }


}



// =========================
// SKOR
// =========================

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



// =========================
// OYUN BİTTİ
// =========================

function endGame(){


    if(!playing)return;


    playing=false;


    music.pause();


    hitSound.currentTime=0;

    hitSound.play().catch(()=>{});



    if(navigator.vibrate){

        navigator.vibrate(150);

    }



    if(score>bestScore){

        bestScore=score;


        localStorage.setItem(

            "bestScore",

            bestScore

        );

    }



    scoreText.textContent =

    "Skor : "+score+

    " | En İyi : "+bestScore;



    gameOver.style.display="flex";


}



// =========================
// OYUN DÖNGÜSÜ
// =========================

function loop(){


    if(!playing)return;



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


    drawParticles();


    drawBird();


    drawScore();



    requestAnimationFrame(loop);

}
