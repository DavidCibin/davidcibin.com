/*------Constants------*/
const spin = new Audio('audio/spin.mp3');
const handle = new Audio('audio/handle.mp3');
const jackpot = new Audio('audio/jackpot.wav');
const win = new Audio('audio/win.wav');
const lose = new Audio('audio/lose.wav');

const scoreCard = [
    { emojiValue: 0, emoji: '🤢' },
    { emojiValue: 1, emoji: '😱' },
    { emojiValue: 2, emoji: '😭' },
    { emojiValue: 3, emoji: '🤬' },
    { emojiValue: 4, emoji: '😃' },
    { emojiValue: 5, emoji: '🤑' },
    { emojiValue: 6, emoji: '💎' },
    { emojiValue: 7, emoji: '🎰' },
]

/*------Variables (state)------*/
let totalPoints = 0;
let results = null;
let reel1 = null;
let reel2 = null;
let reel3 = null;
let sound = true;
let reel1EmojiObject = null;
let reel2EmojiObject = null;
let reel3EmojiObject = null

/*------Cached Element References------*/
const slot1 = document.getElementById('reel1');
const slot2 = document.getElementById('reel2');
const slot3 = document.getElementById('reel3');
let score = document.getElementById('points');
let status = document.getElementById('status')
let audio = document.getElementById('audio');
let newGame = document.getElementById('spinBtn');
let infoMenu = document.getElementById("payout");

/*------Event Listeners------*/
document.getElementById('spinBtn').addEventListener('click', spinClick);
document.getElementById('handle').addEventListener('click', handleSpin);
document.getElementById('audio').addEventListener('click', toggleAudio);
document.getElementById('info').addEventListener('click', infoPayout);


/*------Functions------*/
//Spins the reels generating random numbers and assign each number to a predefined emoji scoreboard
function spinClick() {
    status.innerText = '✰ ✰ ✰ ✰ ✰ SPINNING ✰ ✰ ✰ ✰ ✰';
    setTimeout(() => {
        status.innerText = `✰ ✰ ✰ ✰ ✰ ✰ GOOD LUCK ✰ ✰ ✰ ✰ ✰ ✰`;
    }, 3600);
    if (totalPoints === 0) {
        init()
    }
    else {
        confetti.stop() // confetti stop
        totalPoints -= 5
        score.innerText = -5
        setTimeout(() => {
            score.innerText = totalPoints
        }, 2000);
        document.getElementById('spinBtn').style.pointerEvents = 'none' // Disable SPIN button after spinning
        document.getElementById('handle').style.pointerEvents = 'none' // Disable SPIN handle after spinning
        document.getElementById('spinBtn').style.backgroundColor = "#37474F";
        

        //Block SPIN button for been pressed during spinning
        let currentTime = 0;
        let interval = 200;     //Add interval to get a random number every 0.25 second
        let maxTime = 4600;      //For a total time of 4.5 seconds
        // console.log('START')
        let slotInterval = setInterval(function () {
            // console.log('Interval ==> ', currentTime)
            if (currentTime < maxTime) {
                currentTime += interval
                reel1 = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
                reel2 = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
                reel3 = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
                console.log('reelnums', reel1, reel2, reel3); //debug random numbers each time functions "runs"

                //Assign the emojis to the random number from reel1, reel2, reel3 using the function findEmoji
                reel1EmojiObject = findEmoji(reel1);
                slot1.innerText = reel1EmojiObject[0].emoji
                reel2EmojiObject = findEmoji(reel2);
                slot2.innerText = reel2EmojiObject[0].emoji
                reel3EmojiObject = findEmoji(reel3);
                slot3.innerText = reel3EmojiObject[0].emoji

                if (sound) {
                    spin.play();
                }
            } else {
                // console.log('END')
                document.getElementById('spinBtn').style.pointerEvents = 'auto' //Enable SPIN button back after spinning
                document.getElementById('handle').style.pointerEvents = 'auto' //Enable SPIN handle back after spinning
                document.getElementById('spinBtn').style.backgroundColor = "#ef1010";
                clearInterval(slotInterval)
                render()
            }
        }, interval)
    }
}

function findEmoji(foundNum) {                              //foundNum is the parameter that correspond to each random reel
    if (foundNum === null) {
        return;
    }
    let emojiFound = scoreCard.filter(function (obj) {      //returns(creates) an array from the scoreBoard using the filter method
        // console.log('find emoji??', obj.emojiValue)      //log each emoji value from the scoreBoard
        return obj.emojiValue === foundNum
    })
    // console.log('emoji found', emojiFound)               //log each emoji value from the scoreBoard
    return emojiFound;
}

//Initialization function:
function init() {
    reel1 = null
    reel2 = null
    reel3 = null
    results = null
    totalPoints = 50
    slot1.innerText = scoreCard[7].emoji;
    slot2.innerText = scoreCard[7].emoji;
    slot3.innerText = scoreCard[7].emoji;
    score.innerText = totalPoints;
    setTimeout(() => {
        status.innerText = `✰ ✰ ✰ ✰ ✰ ✰ LET'S PLAY ✰ ✰ ✰ ✰ ✰ ✰`;
    }, 2500);
    status.innerText = `✰ ✰ ✰ ✰ ✰ ✰ WELCOME!! ✰ ✰ ✰ ✰ ✰ ✰`;
    infoMenu.style.visibility = 'collapse';
    newGame.innerText = 'SPIN';
    getWinner();
    render();
}

// Function to check for matchs and handle points
function getWinner() {
    results = null;
    if (reel1 === reel2 && reel1 === reel3 && reel2 === reel3) {
        if (reel1, reel2, reel3 === 7) {
            results = 'jackpot';
        }
        else {
            if (reel1, reel2, reel3 === 4) {
                results = 'happy-line';
                console.log(results);
            }
            else if (reel1, reel2, reel3 === 5) {
                results = 'cash-line';
            }
            else if (reel1, reel2, reel3 === 6) {
                results = 'diamond-line';
            }
            else {
                return;
            }
        }
    }
    else if (reel1 === reel2 || reel1 === reel3 || reel2 === reel3) {
        if (reel1 === reel2) {
            if (reel1 === 4) {
                results = 'double-happy'
            }
            if (reel1 === 5) {
                results = 'double-cash'
            }
            if (reel1 === 6) {
                results = 'double-diamond'
            }
        }
        else if (reel1 === reel3) {
            if (reel1 === 4) {
                results = 'double-happy'
            }
            if (reel1 === 5) {
                results = 'double-cash'
            }
            if (reel1 === 6) {
                results = 'double-diamond'
            }
        }
        else if (reel2 === reel3) {
            if (reel2 === 4) {
                results = 'double-happy'
            }
            if (reel2 === 5) {
                results = 'double-cash'
            }
            if (reel2 === 6) {
                results = 'double-diamond'
            }
        }
        else {
            return;
        }
    }
    else {
        return
    }
    console.log('spin result', reel1, reel2, reel3, results)  //Verify random numbers, check combos found
}

// Render function:
function render() {
    getWinner();
    console.log('verify my score:before all', totalPoints)  //verify score:before all
    points = 0;
    console.log('points before', points)
    if (results === 'jackpot') {
        status.innerText = "✰ ✰ ✰ ✰ ✰ ✰ JACKPOT ✰ ✰ ✰ ✰ ✰ ✰";
        points += 100;

        if (sound) {
            jackpot.play();
        }
        confetti.start();   // confetti start
    }
    else if (results === 'happy-line') {
        status.innerText = "✰ ✰ ✰ ✰ ✰ HAPPY LINE ✰ ✰ ✰ ✰ ✰";
        points += 15;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'cash-line') {
        status.innerText = "✰ ✰ ✰ ✰ ✰ ✰ CASH LINE ✰ ✰ ✰ ✰ ✰ ✰";
        points += 30;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'diamond-line') {
        status.innerText = "✰ ✰ ✰ ✰ ✰ DIAMOND LINE ✰ ✰ ✰ ✰ ✰";
        points += 50;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'double-happy') {
        status.innerText = "✰ ✰ ✰ ✰ ✰ DOUBLE HAPPY ✰ ✰ ✰ ✰ ✰";
        points += 10;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'double-cash') {
        status.innerText = "✰ ✰ ✰ ✰ ✰ DOUBLE CASH ✰ ✰ ✰ ✰ ✰";
        points += 20;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'double-diamond') {
        status.innerText = "✰ ✰ ✰ ✰ ✰ DOUBLE DIAMOND ✰ ✰ ✰ ✰ ✰";
        points += 40;
        if (sound) {
            win.play();
        }
    }
    else {
        if (reel1 === null) {
            return;
        }
        if (totalPoints > 0) {
            status.innerText = "✰ ✰ ✰ ✰ ✰ SPIN AGAIN ✰ ✰ ✰ ✰ ✰";
        } else {
            status.innerText = "😭 😭 😭 😭 GAME OVER 😭 😭 😭 😭";
            newGame.innerText = 'PLAY'
        }
        if (sound) {
            lose.play();
        }
    }
    console.log('points after', points)  //verify score:before all
    totalPoints += points
    if (points > 0) {
        score.innerText = `+${points}`
    }
    setTimeout(() => {
        score.innerText = totalPoints
        console.log(totalPoints)
    }, 2000);

    console.log('verify my score:after all', totalPoints)  //verify score:after all
}

//Function for audio effects. Toggle on/off
function toggleAudio() {
    if (!sound) {
        sound = true;
        audio.style.backgroundImage = "url('images/audioOn.png')";
    }
    else {
        sound = false;
        spin.pause();
        win.pause();
        lose.pause();
        jackpot.pause();
        audio.style.backgroundImage = "url('images/audioOff.png')";
    }
}

//Function for the info button - display the payout
function infoPayout() {
    if (infoMenu.style.visibility === "collapse") {
        infoMenu.style.visibility = "unset";
    } else {
        infoMenu.style.visibility = "collapse";
    }
}


function handleSpin() {
    if (sound) {
        handle.play();
        handle.volume = 0.5;
    }
    spinClick()
}

init();