// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
//Global Variables
var pattern = [];
var progress = 0;
var gamePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  secretpattern();
  playClueSequence();
}

function stopGame() {
  //stops game variables
  progress = 0;
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 550,
  6: 650
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  //https://www.w3schools.com/js/js_comparisons.asp
  //Used w3schools.com to ensure I was using the correct operators
  if (pattern[guessCounter] == btn) {
    //if the guess matches button pressed, it is correct
    if (guessCounter == progress) {
      //if the number of guesses matches progress made
      if (progress + 1 == pattern.length) {
        //if last turn and guess correct, win game
        winGame();
      } else {
        //if it isn't the last turn, add 1 to progress, and continue to next button in the pattern
        progress++;
        playClueSequence();
      }
    } else {
      //if the turn isn't over, add 1 in guessCounter
      guessCounter++;
    }
  } else {
    //if guess isn't correct, lase game
    loseGame();
  }
}

//https://www.w3schools.com/jsref/jsref_random.asp
//https://www.w3schools.com/js/js_random.asp
//https://www.w3schools.com/js/js_loop_for.asp
//https://www.w3schools.com/jsref/jsref_push.asp
//Optional 3: Random secret pattern
function secretpattern(){
  var i;
  //generates a random number 1 through 6 and is added to the array "pattern"
  for (let i = 0; i < 5; i++) {
    pattern.push(Math.floor(Math.random() * 6) + 1);
  }
}