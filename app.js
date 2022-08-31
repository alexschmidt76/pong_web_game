// get the screen canvas
const screen = document.getElementById('screen');
const ctx = screen.getContext('2d');

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
    color: 'white'
}


// right paddle
let right = {
    x: screen.width - 15,
    y: screen.height / 2 - 70,
    width: 15,
    height: 140,
    score: 0,
    color: 'white'
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
        ball.xVel = ball.speed * Math.cos(angle);
        ball.yVel = ball.speed * Math.sin(angle);
        console.log(angle * 180 / Math.PI)
    }
    // detect score
    if (ball.x > screen.width) {
        left.score++;
        spawnBall(false, server='left');
    }
    if (ball.x < 0) {
        right.score++;
        spawnBall(false, server='right');
    }
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
    let code = e.code
    if (code == 'KeyW' && left.y > 0) {
        left.y -= 10;
    }
    if (code == 'KeyS' && left.y < screen.height - left.height) {
        left.y += 10;
    }
    if (true) {
        if (code == 'ArrowUp' && right.y > 0) {
            right.y -= 10;
        }
        if (code == 'ArrowDown' && right.y < screen.height - right.height) {
            right.y += 10;
        }
    }
    });

// start game
spawnBall(true)
// main loop
function game() {
    showScreen();
    updateGame();
}
setInterval(game, 50);