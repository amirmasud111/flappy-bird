var cvs = document.getElementById("mycanvas");
var ctx = cvs.getContext("2d");

var degree = Math.PI / 180;
var frames = 0;

var backGround = new Image();
backGround.src = "assets/images/background-day.png";
var forGround = new Image();
forGround.src = "assets/images/base.png";
var birdupflap = new Image();
birdupflap.src = "assets/images/bluebird-upflap.png";
var birdmidflap = new Image();
birdmidflap.src = "assets/images/bluebird-midflap.png";
var birddownflap = new Image();
birddownflap.src = "assets/images/bluebird-downflap.png";
var getReady = new Image();
getReady.src = "assets/images/message.png";
var gameOver = new Image();
gameOver.src = "assets/images/gameover.png";
var pipeLineUp = new Image();
pipeLineUp.src = "assets/images/pipe-green.png";
var pipeLineDw = new Image();
pipeLineDw.src = "assets/images/pipe-green-down.png";

var SCORE = new Audio();
SCORE.src = "assets/audio/point.wav";


var FLAP = new Audio();
FLAP.src = "assets/audio/wing.wav";


var HIT = new Audio();
HIT.src = "assets/audio/hit.wav";

var DIE = new Audio();
DIE.src = "assets/audio/die.wav";

var START = new Audio();
START.src = "assets/audio/swoosh.wav";





var state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

function clickHandler() {
    switch (state.current) {
        case state.getReady:
            START.play();
            state.current = state.game;
            break;
        case state.game:
            FLAP.play();
            bird.flap();
            break;
        default:
            bird.speed = 0;
            bird.rotation = 0;
            pipes.position = [];
            score.value = 0;
            state.current = state.getReady;
            break;
    }
}

document.addEventListener("click", clickHandler);
document.addEventListener("keydown", (e) => {
    if (e.code == "Space") {
        clickHandler();
    }
})


var bg = {
    sX: 0,
    sY: 0,
    w: 288,
    h: 512,
    x: 0,
    y: cvs.height - 512,
    draw: function () {
        ctx.drawImage(backGround, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(backGround, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
    }
}


var fg = {
    sX: 0,
    sY: 0,
    w: 316,
    h: 112,
    x: 0,
    dx: 5,
    y: cvs.height - 112,
    draw: function () {
        ctx.drawImage(forGround, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(forGround, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
    },
    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w);
        }
    }
}


var bird = {
    animation: [birdupflap, birdmidflap, birddownflap, birdmidflap],
    sX: 0,
    sY: 0,
    w: 34,
    h: 24,
    x: 50,
    y: 150,
    speed: 0,
    gravity: 0.25,
    animationIndex: 0,
    rotation: 0,
    jump: 4.6,
    radius: 12,
    draw: function () {

        let bird = this.animation[this.animationIndex];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(bird, this.sX, this.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
    },
    update: function () {
        let period = state.current == state.getReady ? 10 : 5;
        this.animationIndex += frames % period == 0 ? 1 : 0;
        this.animationIndex = this.animationIndex % this.animation.length;
        if (state.current == state.getReady) {
            this.y = 150;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;
            if (this.speed < this.jump) {

                this.rotation = -25 * degree;
            } else {
                this.rotation = 50 * degree;
            }
        }
        if (this.y + this.h / 2 >= cvs.height - fg.h) {
            this.y = cvs.height - fg.h - this.h / 2;
            this.animationIndex = 1;
            if (state.current == state.game) {
                DIE.play();
                state.current = state.over;

            }
        }
    },
    flap: function () {
        this.speed = -this.jump;

    }
}

var score = {
    best: parseInt(localStorage.getItem("best") || 0),
    value: 0,
    draw: function () {
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "black";
        if (state.current == state.game) {

            ctx.lineWidth = 2;
            ctx.font = "35px IMPACT";
            ctx.fillText(this.value, cvs.width / 2, 50);
            ctx.strokeText(this.value, cvs.width / 2, 50);

        } else if (state.current == state.over) {

            ctx.lineWidth = 2;
            ctx.font = "35px IMPACT";


            ctx.fillText(this.value, 90, 170);
            ctx.strokeText(this.value, 90, 170);
            ctx.fillText(this.best, 210, 170);
            ctx.strokeText(this.best, 210, 170);
            ctx.fillText("Score", 60, 135);
            ctx.strokeText("Score", 60, 135);
            ctx.fillText("Best", 190, 135);
            ctx.strokeText("Best", 190, 135);


        }
    }
}

var pipes = {
    sX: 0,
    sY: 0,
    w: 52,
    h: 320,
    dx: 2,
    gap: 100,
    position: [],
    maxYPos: -130,
    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            let topYPos = p.y;
            let bottomYpos = p.y + this.h + this.gap;

            ctx.drawImage(pipeLineDw, this.sX, this.sY, this.w, this.h, p.x, topYPos, this.w, this.h);
            ctx.drawImage(pipeLineUp, this.sX, this.sY, this.w, this.h, p.x, bottomYpos, this.w, this.h);
        }
    },
    update: function () {
        if (state.current != state.game) return;
        if (frames % 100 == 0) {
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random() + 1)
            })
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.dx;

            let bottomPipesPos = p.y + this.h + this.gap;

            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
                HIT.play();
                DIE.play();
                state.current = state.over;
         
            }
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipesPos && bird.y - bird.radius < bottomPipesPos + this.h) {
                HIT.play();
                DIE.play();
                state.current = state.over;
            }

            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;
                SCORE.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    }
}

var gR = {
    sX: 0,
    sY: 0,
    w: 184,
    h: 267,
    x: cvs.width / 2 - 184 / 2,
    y: 80,
    draw: function () {
        if (state.current == state.getReady) {
            ctx.drawImage(getReady, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

var gO = {
    sX: 0,
    sY: 0,
    w: 192,
    h: 42,
    x: cvs.width / 2 - 192 / 2,
    y: 180,
    draw: function () {
        if (state.current == state.over) {
            ctx.drawImage(gameOver, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}


function update() {
    bird.update();
    fg.update();
    pipes.update();
}
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    gR.draw();
    gO.draw();
    score.draw();
}

function animate() {
    update();
    draw();
    frames++;
    requestAnimationFrame(animate);
}

animate();

