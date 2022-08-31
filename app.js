// get the screen canvas
const screen = document.getElementById('screen');
const ctx = screen.getContext('2d');
let volleyCtr = 0; // needs to be in global scope so it's not reset every frame

// functions to draw things
// rectangle
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// circle
function drawCirc(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI, true);
    ctx.fillStyle = color;
    ctx.fill();
}

// text
function drawText(text, x, y, color) {
    ctx.font = "100px monospace";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

// net
function drawNet() {
    for (let i = 5; i <= screen.height; i += 30) {
        drawRect(screen.width / 2 - 2, i, 4, 20, 'white');
    }
}

// used to get offset for score display
function getOffset(score) {
    return 28 * `${score}`.length;
}

// objects used in the game
// ball
let ball = {
    x: screen.width / 2,
    y: screen.height / 2,
    radius: 15,
    color: 'white',
    speed: 15,
    xVel: 0,
    yVel: 0
}

// left paddle
let left = {
    x: 0,
    y: screen.height / 2 - 70,
    width: 15,
    height: 140,
    score: 0,
    color: 'white',
    speed: 10
}


// right paddle
let right = {
    x: screen.width - 15,
    y: screen.height / 2 - 70,
    width: 15,
    height: 140,
    score: 0,
    color: 'white',
    speed: 10
}

// gameplay functions
// show screen
function showScreen() {
    drawRect(0, 0, screen.width, screen.height, 'black'); // background
    drawText(left.score, screen.width / 4 - getOffset(left.score), screen.height / 5, left.color); // left score
    drawText(right.score, 3 * screen.width / 4 - getOffset(right.score), screen.height / 5, right.color); // right score
    drawNet();
    drawRect(left.x, left.y, left.width, left.height, left.color); // left paddle
    drawRect(right.x, right.y, right.width, right.height, right.color); // right paddle
    drawCirc(ball.x, ball.y, ball.radius, ball.color); // ball
}

// update game
function updateGame() {
    // move ball
    ball.x += ball.xVel;
    ball.y += ball.yVel;

    // detect collision with top or bottom
    if (ball.y < ball.radius || ball.y > screen.height - ball.radius) {
        ball.yVel = -ball.yVel;
    }
    // fix bug that makes ball stick to top or bottom
    if (ball.y > 0 && ball.y < ball.radius) {
        ball.y = ball.radius;
    }
    if (ball.y < screen.height && ball.y > screen.height - ball.radius) {
        ball.y = screen.height - ball.radius;
    }

    // detect collistion with paddle
    // select paddle to detect collision with
    if (ball.x > screen.width / 2) {
        var paddle = right;
        var angleShift = Math.PI;
        var angleFlip = -1;
    } else {
        var paddle = left;
        var angleShift = 0;
        var angleFlip = 1;
    }
    // detect collistion and make ball bounce
    if (detectCollision(ball, paddle)) {
        // angle of bounce depends on location of collision with paddle
        // center = 0deg, edge = 45deg, linear relationship
        let collisionPoint = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
        let angle = ((collisionPoint * Math.PI / 4) + angleShift) * angleFlip;
        volleyCtr += 0.5;
        console.log(volleyCtr)
        // volley counter events
        if (volleyCtr == 3) {
            ball.speed += 10;
        }
        if (volleyCtr == 6) {
            ball.speed += 5;
            left.speed += 10;
            right.speed += 10;
        }
        if (volleyCtr == 9){
            ball.speed += 10;
            ball.color = 'yellow'
        }
        // set new speed after checking volley count
        ball.xVel = ball.speed * Math.cos(angle);
        ball.yVel = ball.speed * Math.sin(angle);
    }

    // detect score
    if (ball.x > screen.width) {
        left.score++;
        resetVolley();
        spawnBall(false, server='left');
    }
    if (ball.x < 0) {
        right.score++;
        resetVolley();
        spawnBall(false, server='right');
    }
}

// reset volley effects
function resetVolley() {
    volleyCtr = 0;
    ball.speed = 15;
    ball.color = 'white';
    left.speed = 10;
    right.speed = 10;
}

// collsion detection
function detectCollision(b, p) {
    // boundaries for ball
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.right = b.x + b.radius;
    b.left = b.x - b.radius;

    // boundaries for paddle
    p.top = p.y;    
    p.bottom = p.y + p.height;
    p.right = p.x + p.width;
    p.left = p.x;

    return b.right > p.left && b.left < p.right && b.top < p.bottom && b.bottom > p.top;
}

// function to spawn new ball, both at start and when a score happens
function spawnBall(newGame, server='') {
    // set location to center, random height if not new game
    ball.x = screen.width / 2;
    ball.y = newGame ? screen.height / 2 : (Math.random() * (screen.height - 100)) + 50;

    // set random angle for serve (range is a 90deg cone pointing right or left depending on server)
    let randAngle = Math.random() * 0.5 * Math.PI - Math.PI / 4;

    // get server/random if new game
    if (!newGame) {
        if (server == 'right') {
            randAngle = randAngle + Math.PI;
        }
    } else {
        randAngle = (Math.random() > 0.5) ? randAngle : randAngle + Math.PI;
    }

    // set ball velocity
    ball.xVel = ball.speed * Math.cos(randAngle);
    ball.yVel = ball.speed * Math.sin(randAngle);
}

// controls
document.addEventListener('keydown', (e) => {
    // left
    let code = e.code
    if (code == 'KeyW' && left.y > 0) {
        left.y -= left.speed;
    }
    if (code == 'KeyS' && left.y < screen.height - left.height) {
        left.y += left.speed;
    }
    // right 
    if (code == 'ArrowUp' && right.y > 0) {
        right.y -= right.speed;
    }
    if (code == 'ArrowDown' && right.y < screen.height - right.height) {
        right.y += right.speed;
    }
    });

// sleeper function
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}

// show title screen
function showTitleScreen() {
    drawRect(0, 0, screen.width, screen.height, 'black');
    ctx.font = "200px monospace";
    ctx.fillStyle = 'white';
    ctx.fillText('PONG-ish', 60, 370);
}
showTitleScreen();

// start game
let startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);

async function startGame() {
    // button color change
    startButton.style.backgroundColor = 'gray';
    await sleep(100);
    startButton.style.backgroundColor = 'lightgray';

    // reset values from previous game
    resetVolley();
    left.score = 0;
    right.score = 0;
    left.y = screen.height / 2 - 70;
    right.y = screen.height / 2 - 70;

    spawnBall(true)
    // main loop
    function game() {
        showScreen();
        updateGame();

        // add listener for reset button
        let resetButton = document.getElementById('reset-button')
        resetButton.addEventListener('click', async () => {
            // button color change
            resetButton.style.backgroundColor = 'gray';
            await sleep(100);
            resetButton.style.backgroundColor = 'lightgray';
            // stop gameloop and show title screen again
            clearInterval(gameInterval);
            showTitleScreen();
        })
    }
    gameInterval = setInterval(game, 50);
}
