//Constants
const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

const audioBackground = new Audio('audio/background.mp3');
const audioX = new Audio('audio/X.wav');
const audioO = new Audio('audio/O.wav');
const audioEnd1 = new Audio('audio/Glass.mp3');
const audioEnd2 = new Audio('audio/Bomb.mp3');
const player = {
    '1': 'X',
    '-1': 'O',
    'null': '',
}

// Variables (state)
let board = [null, null, null, null, null, null, null, null, null];
let turn = 1;
let isWinner = '';
let sound = false;
let isPlayerVsPlayer = false;

// Cached Element References
const boardEl = document.querySelectorAll('.board > div');
let msgDiv = document.getElementById('message');
let audio = document.getElementById('audio');
let details = document.getElementById("details");
let newGame = false


// Event Listeners
document.getElementById('audio').addEventListener('click', toggleAudio)
document.getElementById('info').addEventListener('click', infoDetails);
document.querySelectorAll('.board').forEach(boardEl => {
    boardEl.addEventListener('click', handleClick);
});
document.getElementById('players').addEventListener('click', (evt) => {
    isPlayerVsPlayer = true;
    newGame = true
    initialState();
    evt.target.classList.add("active")
});
document.getElementById('computer').addEventListener('click', (evt) => {
    isPlayerVsPlayer = false;
    newGame = true
    initialState();
    evt.target.classList.add("active")
});

// Functions

// Initialize
function initialState() {
    document.querySelectorAll("button").forEach(btn => {
        btn.classList.remove("active")
    })
    if (newGame) {
        msgDiv.innerText = `Player X, it's your turn`;
    }
    details.style.visibility = 'collapse';
    board = [null, null, null, null, null, null, null, null, null]
    isWinner = null;
    turn = 1;
    render();
}

// Click Handler
function handleClick(evt) {
    if (!newGame) return
    if (!isWinner) {
        let sqIdx = parseInt(evt.target.id.replace('sq', ''));
        if (board[sqIdx] === null) {
            board[sqIdx] = turn;
            checkWinner();
            turn = isPlayerVsPlayer ? turn * -1 : -1; // if isPlayerVsPlayer is true, switch turn between players. Otherwise, computer's turn
            render();
            if (!isWinner && !isPlayerVsPlayer) {
                computerTurn(); // if playing against computer and it's computer's turn
            }
        }
    }
}

// using probability
function computerTurn() {
    setTimeout(() => {
        let availableSquares = [];
        board.forEach(function (square, idx) {
            if (square === null) {
                availableSquares.push(idx);
            }
        });

        let computerIdx;
        if (turn === -1) {
            let bestScore = -Infinity;
            for (let i = 0; i < availableSquares.length; i++) {
                let idx = availableSquares[i];
                board[idx] = turn;
                let score = minimax(board, false, -Infinity, Infinity);
                board[idx] = null;
                if (score > bestScore) {
                    bestScore = score;
                    computerIdx = idx;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < availableSquares.length; i++) {
                let idx = availableSquares[i];
                board[idx] = turn;
                let score = minimax(board, true, -Infinity, Infinity);
                board[idx] = null;
                if (score < bestScore) {
                    bestScore = score;
                    computerIdx = idx;
                }
            }
        }

        board[computerIdx] = -1;
        checkWinner();
        turn = 1;
        render();
    }, 1000);

}

function minimax(board, isMaximizingPlayer, alpha, beta) {
    let winner = checkBoard(board);
    if (winner !== null) {
        return winner * turn;
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = turn;
                let score = minimax(board, false, alpha, beta);
                board[i] = null;
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = turn * -1;
                let score = minimax(board, true, alpha, beta);
                board[i] = null;
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    }
}

function checkBoard(board) {
    for (let i = 0; i < winningCombos.length; i++) {
        let [a, b, c] = winningCombos[i];
        if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            return null;
        }
    }
    return 0;
}

// Check Winner
function checkWinner() {
    winningCombos.forEach(function (square) {
        let total = 0;
        square.forEach(function (val) {
            total = total + board[val];
        });
        if (Math.abs(total) === 3) {
            if (isPlayerVsPlayer) {
                isWinner = turn;
            } else {
                isWinner = board[square[0]];
            }
        }
    });
    if (!isWinner) {
        if (!board.includes(null)) {
            isWinner = 'tie';
        }
    }
}

function render() {
    boardEl.forEach((square, idx) => {
        if (player[board[idx]] == 'X') {
            square.innerHTML = '<img class="gun-shot" src="images/gun.png">';
        }
        else if (player[board[idx]] == 'O') {
            square.innerHTML = '<img class="gun-shot" src="images/shot.png">';
        }
        else if (board[idx] == null) {
            square.innerHTML = ''
        }
    })

    if (isWinner === 1) {
        msgDiv.textContent = `Player X wins!`;
        audioEnd1.volume = 0.5;
        audioEnd2.volume = 0.5;
        audioEnd1.play();
        audioEnd2.play();
    } else if (isWinner === -1) {
        msgDiv.textContent = `Player O wins!`;
        audioEnd1.volume = 0.5;
        audioEnd2.volume = 0.5;
        audioEnd1.play();
        audioEnd2.play();
    } else if (isWinner === 'tie') {
        msgDiv.textContent = `It's a tie! Try again!`;
        audioEnd1.volume = 0.5;
        audioEnd2.volume = 0.5;
        audioEnd1.play();
        audioEnd2.play();
    } else {
        board.forEach(function (square, idx) {
            if (square !== null) {
                if (turn === 1) {
                    msgDiv.innerText = `Player X, it's your turn`;
                    audioX.volume = 0.5;
                    audioX.play();
                } else {
                    msgDiv.innerText = `Player O, it's your turn`;
                    audioX.volume = 0.5;
                    audioO.play();
                }
            }
        });
    }
}

//Function for audio effects. Toggle on/off
function toggleAudio() {
    if (!sound) {
        sound = true;
        audioBackground.volume = 0.5;
        audioBackground.play();
        audio.style.backgroundImage = "url('images/audioOn.png')";
    }
    else {
        sound = false;
        audioBackground.pause();
        audio.style.backgroundImage = "url('images/audioOff.png')";
    }
}

function infoDetails() {
    if (details.style.visibility === "collapse") {
        details.style.visibility = "unset";
    } else {
        details.style.visibility = "collapse";
    }
}

