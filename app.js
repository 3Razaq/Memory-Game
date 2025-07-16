const board = document.getElementById("game-board");
const reset = document.getElementById("reset-btn");
const darkBtn = document.querySelector(".dark");
const loseVideo = document.getElementById("loseVideo");


const matchSound = new Audio('matchSound.wav');
const mismatchSound = new Audio('mismatchSound.mp4');
const winSound = new Audio('winSound.mp3');
const flipSound = new Audio('flipSound.mp3');


let letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
let first = null;
let second = null;
let flipping = false;
let matchCount = 0;

let timer = null;
let timeLeft = 60; // seconds
ount = 0; 


// Shuffle the cards
function mix(arr) {
  for(let i = arr.length -1; i >0 ;i -- ){
     let random = Math.floor(Math.random()*(i+1));
     [arr[i],arr[random]] = [arr[random],arr[i]];
  }
  return arr
}


function makeBoard() {
  let all = mix([...letters, ...letters]);
  board.innerHTML = "";
  document.getElementById("message").textContent = "";
  document.getElementById("timer").textContent = "Time: 60s";
  matchCount = 0;
  timeLeft = 60;

  if (timer) clearInterval(timer); // stop old timer

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      flipping = true;
      document.getElementById("message").textContent = "⏰ Time's up! You Lose!";
      // Optionally flip all remaining cards
      revealAllCards();
    }
  }, 1000);

  all.forEach((letter) => {
    let card = document.createElement("div");
    card.className = "card";
    card.dataset.value = letter;
    card.textContent = "";
    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });

  // first = null;
  // second = null;
  // flipping = false;
}


// Flip a card
function flipCard(card) {
  if (flipping || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.textContent = card.dataset.value;
  card.classList.add("flipped");
  flipSound.volume = 0.5;
  flipSound.play();
  if (!first) {
    first = card;
    return;
  }

  second = card;
  flipping = true;

  if (first.dataset.value === second.dataset.value) {
    first.classList.add("matched");
    second.classList.add("matched");
    matchSound.volume = 0.5;
    matchSound.play();
    matchCount++;
    if (matchCount === 8) {
        clearInterval(timer);
        document.getElementById("message").textContent = `🎉 You Win in ${60 - timeLeft} seconds!`;
        winSound.volume = 0.5;
        winSound.play();
    }


    clearTurn();


  } else {

    mismatchSound.volume = 0.5;
    mismatchSound.play(); 
    
    setTimeout(() => {
      first.textContent = null;
      second.textContent = null;
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      clearTurn();
      
    }, 1000);
  }
}

// Reset the turn
function clearTurn() {
  first = null;
  second = null;
  flipping = false;
}

// When reset button is clicked
reset.addEventListener("click", makeBoard)
// When dark button is clicked
darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkBtn.textContent = document.body.classList.contains("dark-mode") ? "☀" : "🌙";
});

// Start the game
makeBoard();