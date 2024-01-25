/*------Constants------*/
const slotsPerReel = 12
const reelRadious = 300;
const spin = new Audio('audio/spin.mp3');
const handle = new Audio('audio/handle.mp3');
const jackpot = new Audio('audio/jackpot.wav');
const win = new Audio('audio/win.wav');
const lose = new Audio('audio/lose.wav');

const replacementMap = {
    '0': '😭',
    '1': '🤬',
    '2': '😃',
    '3': '🤑',
    '4': '💎',
    '5': '🎰',
    '6': '😭',
    '7': '🤬',
    '8': '😃',
    '9': '🤑',
    '10': '💎',
    '11': '🎰',
};

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
let score = document.getElementById('points');
let statusBar = document.getElementById('statusBar')
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
    // console.log("SPIN!?!?");
    // time for the first spint to stop (in seconds)
    const timer = 3;
    spinReels(timer);

    statusBar.innerText = '✰ ✰ ✰ ✰ ✰ SPINNING ✰ ✰ ✰ ✰ ✰';
    setTimeout(() => {
        statusBar.innerText = `✰ ✰ ✰ ✰ ✰ ✰ GOOD LUCK ✰ ✰ ✰ ✰ ✰ ✰`;
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
        console.log('START')
        let slotInterval = setInterval(function () {
            console.log('Interval ==> ', currentTime)
            if (currentTime < maxTime) {
                currentTime += interval
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

//Initialization function:
function init() {
    reel1 = null
    reel2 = null
    reel3 = null
    results = null
    totalPoints = 50
    score.innerText = totalPoints;
    setTimeout(() => {
        statusBar.innerText = `✰ ✰ ✰ ✰ ✰ ✰ LET'S PLAY ✰ ✰ ✰ ✰ ✰ ✰`;
    }, 2500);
    statusBar.innerText = `✰ ✰ ✰ ✰ ✰ ✰ WELCOME!! ✰ ✰ ✰ ✰ ✰ ✰`;
    infoMenu.style.visibility = 'collapse';
    newGame.innerText = 'SPIN';
    console.log(document.querySelector('#ring1'), "HELLO")
    createSlots('#ring1');
    createSlots('#ring2');
    createSlots('#ring3');
    getWinner();
    render();
}

function getSeed() {
    // generate random number smaller than 13 then floor it to settle between 0 and 12 inclusive
    return Math.floor(Math.random() * (slotsPerReel));
}

function spinReels(timer) {
    // Get all elements with the class 'ring'
    const ringElements = document.querySelectorAll('.ring');
    // Loop through each 'ring' element and set margin-top to 7px
    ringElements.forEach(el => { el.style.marginTop = '7px' });
    const seeds = []
    for (var i = 1; i < 6; i++) {
        var ringElement = document.getElementById('ring' + i);

        if (ringElement) {
            var oldSeed = -1;

            // Checking that the old seed from the previous iteration is not the same as the current iteration;
            // If this happens, then the reel will not spin at all
            var oldClass = ringElement.className;
            if (oldClass.length > 4) {
                oldSeed = parseInt(oldClass.slice(10));
            }

            var seed = getSeed();
            while (oldSeed === seed) {
                seed = getSeed();
            }

            ringElement.style.animation = 'back-spin 1s, spin-' + seed + ' ' + (timer + i * 0.5) + 's';
            ringElement.className = 'ring spin-' + seed;
        } else {
            console.error('Element with ID "ring' + i + '" not found.');
        }
        if ([3, 9, 4, 10].includes(seed)) {
            seed = 0
        } else if ([5, 11].includes(seed)) {
            seed = 4
        } else if ([0, 6].includes(seed)) {
            seed = 5
        } else if ([1, 7].includes(seed)) {
            seed = 6
        } else if ([2, 8].includes(seed)) {
            seed = 7
        }
        seeds.push(seed)
    }
    reel1 = seeds[0]
    reel2 = seeds[1]
    reel3 = seeds[2]

}

function createSlots(ringId) {
    var slotAngle = 360 / slotsPerReel;
    var seed = 11;

    for (var i = 0; i < slotsPerReel; i++) {
        var slot = document.createElement('div');
        slot.className = 'slot';

        // Compute and assign the transform for this slot
        slot.style.transform = 'rotateX(' + (slotAngle * i) + 'deg) translateZ(' + reelRadious + 'px)';

        // Setup the number to show inside the slots; the position is randomized
        var content = document.createElement('p');
        content.textContent = replacementMap[(seed + i) % 6];
        slot.appendChild(content);

        // Add the slot to the row
        const ring = document.querySelector(ringId)
        console.log(ring, ringId);
        ring.appendChild(slot);
    }
}

// Function to check for matchs and handle points
function getWinner() {
    console.log("reels result:", reel1, reel2, reel3);
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
        statusBar.innerText = "✰ ✰ ✰ ✰ ✰ ✰ JACKPOT ✰ ✰ ✰ ✰ ✰ ✰";
        points += 100;

        if (sound) {
            jackpot.play();
        }
        confetti.start();   // confetti start
    }
    else if (results === 'happy-line') {
        statusBar.innerText = "✰ ✰ ✰ ✰ ✰ HAPPY LINE ✰ ✰ ✰ ✰ ✰";
        points += 15;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'cash-line') {
        statusBar.innerText = "✰ ✰ ✰ ✰ ✰ ✰ CASH LINE ✰ ✰ ✰ ✰ ✰ ✰";
        points += 30;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'diamond-line') {
        statusBar.innerText = "✰ ✰ ✰ ✰ ✰ DIAMOND LINE ✰ ✰ ✰ ✰ ✰";
        points += 50;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'double-happy') {
        statusBar.innerText = "✰ ✰ ✰ ✰ ✰ DOUBLE HAPPY ✰ ✰ ✰ ✰ ✰";
        points += 10;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'double-cash') {
        statusBar.innerText = "✰ ✰ ✰ ✰ ✰ DOUBLE CASH ✰ ✰ ✰ ✰ ✰";
        points += 20;
        if (sound) {
            win.play();
        }
    }
    else if (results === 'double-diamond') {
        statusBar.innerText = "✰ ✰ ✰ ✰ ✰ DOUBLE DIAMOND ✰ ✰ ✰ ✰ ✰";
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
            statusBar.innerText = "✰ ✰ ✰ ✰ ✰ SPIN AGAIN ✰ ✰ ✰ ✰ ✰";
        } else {
            statusBar.innerText = "😭 😭 😭 😭 GAME OVER 😭 😭 😭 😭";
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