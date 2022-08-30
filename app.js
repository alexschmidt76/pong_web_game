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

// create the objects used in the game
// ball
let ball = {
    x: screen.width / 2,
    y: screen.height / 2,
    radius: 15,
    color: 'white'
}
// left player
let left = {
    x: 0,
    y: screen.height / 2 - 80,
    width: 15,
    height: 160,
    score: 0,
    color: 'white'
}
// right player
let right = {
    x: screen.width - 15,
    y: screen.height / 2 - 80,
    width: 15,
    height: 160,
    score: 0,
    color: 'white'
}

// gameplay functions
// show screen
function updateScreen() {
    drawRect(0, 0, screen.width, screen.height, 'black'); // background
    drawText(left.score, screen.width / 4 - getOffset(left.score), screen.height / 5, left.color); // left score
    drawText(right.score, 3 * screen.width / 4 - getOffset(right.score), screen.height / 5, right.color); // right score
    drawNet();
    drawRect(left.x, left.y, left.width, left.height, left.color); // left paddle
    drawRect(right.x, right.y, right.width, right.height, right.color); // right paddle
    drawCirc(ball.x, ball.y, ball.radius, ball.color); // ball
}

updateScreen();