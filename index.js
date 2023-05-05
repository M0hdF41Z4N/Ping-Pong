
// Initilalizing variable to access html element
const ball = document.getElementById('ball');
const paddle_1 = document.getElementById('paddle-1');
const paddle_2 = document.getElementById('paddle-2');

// To store winner Name, score and other stuff
const storeScore = "MaxScore";
const playerName = "PlayerName";
const paddle1Name = "Rod 1";
const paddle2Name = "Rod 2";

// for score calculation , initialize ball speed etc.
let score , maxScore , ball_movement , paddle, 
ballSpeedY = 2 , ballSpeedX = 2;

// Initially gameStatus is off
let gameStatus = false;

// windows width and height
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

// IIFE to check previous scores , setting the board 
// positing paddles and ball 

(function() {
    // retreiving information from localstorage / browser
    paddle = localStorage.getItem(playerName);
    maxScore = localStorage.getItem(storeScore);

    if (paddle === null || maxScore === null ) {
        alert("This is the first time you are playing this game. LET'S START");
        maxScore=0;
        paddle = 'Rod 1';
    }else {
        alert(paddle+" has maximum score of "+maxScore*100);
    }

    resetBoard(paddle);
})();


// Function to reset the board
function resetBoard(paddleName) {

    paddle_1.style.left = (winWidth-paddle_1.offsetWidth)/2+'px';
    paddle_2.style.left = (winWidth-paddle_2.offsetWidth)/2+'px';
    ball.style.left = (winWidth-ball.offsetWidth)/2+'px';

    // Assiging ball
    if (paddleName === paddle2Name) {
        ball.style.top = (paddle_1.offsetTop + paddle_1.offsetHeight)+'px';
        ballSpeedY = 2;
    }else {
        ball.style.bottom = (paddle_2.offsetTop - paddle_2.offsetHeight)+'px';
        ballSpeedY = -2; // Reversing the direction
    }

    // reseting score
    score = 0;
    // switching game status to off
    gameStatus = false;
}

// Function to store the score and related information
function storeInfo(paddle,score) {
    if (score > maxScore) {
        maxScore = score;
        // Storing information into local storage / browser
        localStorage.setItem(playerName,paddle);
        localStorage.setItem(storeScore,maxScore);
    }

    // Stopping the game or interval
    clearInterval(ball_movement);
    // resetting the board
    resetBoard(paddle);

    alert(paddle + " wins with a score of " + (score * 100) + ". Max score is: " + 
    (maxScore * 100));

}

window.addEventListener('keypress',

function () {

    // Initializing paddle speed
    let paddleSpeed = 20;

    // Getting co-ordinates of paddle
    let paddle_coord = paddle_1.getBoundingClientRect();

    if (event.code === "KeyD" && ((paddle_coord.x + paddle_coord.width) < winWidth)) {
        paddle_1.style.left = (paddle_coord.x) + paddleSpeed + 'px';
        paddle_2.style.left = paddle_1.style.left;
    }else if (event.code === 'KeyA' && (paddle_coord.x > 0)) {
        paddle_1.style.left = (paddle_coord.x) - paddleSpeed + 'px';
        paddle_2.style.left = paddle_1.style.left;
    }

    // if game staus is off
    if (!gameStatus) {
        
        // switch game status to on
        gameStatus = true;

        // Getting ball co-ordinates
        let ball_coord = ball.getBoundingClientRect();
        let ballX = ball_coord.x;
        let ballY = ball_coord.y;
        let ball_diameter = ball_coord.width;

        //  Getting co-ordinates of paddles
        let paddle1Height = paddle_1.offsetHeight;
        let paddle2Height = paddle_2.offsetHeight;
        let paddle1Width = paddle_1.offsetWidth;
        let paddle2Width = paddle_2.offsetWidth;

        ball_movement = setInterval(
            function () {
                // Moving the ball
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                // Getting co-ordinates of paddles
                paddle1X = paddle_1.getBoundingClientRect().x;
                paddle2X = paddle_2.getBoundingClientRect().x;

                // Reflecting ball position changes to HTML DOM
                ball.style.left = ballX+'px';
                ball.style.top = ballY+'px';

                // If ball going outside the window reverse the direction
                if ((ballX+ball_diameter) > winWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; // Reversing the direction
                }

                // 
                let ballPos = ballX+ball_diameter / 2;

                // Check for collision with paddle 1 or upper side of window
                if (ballY <= paddle1Height) {
                    ballSpeedY = -ballSpeedY; // Reverse the direction
                    score++;

                    // In-case of collision with upper wall
                    if ((ballPos < paddle1X) || (ballPos > (paddle1X + paddle1Width))) {
                        storeInfo(paddle2Name,score);
                    }
                }

                // Check for collision with paddle 2 or down side of window
                else if ((ballY+ ball_diameter) >= (winHeight - paddle2Height)) {
                    ballSpeedY = -ballSpeedY;
                    score++;

                    // In-case of collision with down wall
                    if ((ballPos < paddle2X) || (ballPos > paddle2X + paddle2Width)) {
                        storeInfo(paddle1Name,score);
                    }
                }

            },10);

    }
});
