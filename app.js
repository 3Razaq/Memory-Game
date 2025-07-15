const board = document.getElementById("game-board");
const reset = document.getElementById("reset-btn");
const darkBtn = document.querySelector(".dark");

let letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
let first = null;
let second = null;
let stopClick = false;
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
      stopClick = true;
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

  first = null;
  second = null;
  stopClick = false;
}


// Flip a card
function flipCard(card) {
  if (stopClick || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.textContent = card.dataset.value;
  card.classList.add("flipped");

  if (!first) {
    first = card;
    return;
  }

  second = card;
  stopClick = true;

  if (first.dataset.value === second.dataset.value) {
    first.classList.add("matched");
    second.classList.add("matched");
    matchCount++;
    if (matchCount === 8) {
        clearInterval(timer);
        document.getElementById("message").textContent = `🎉 You Win in ${60 - timeLeft} seconds!`;
    }


    clearTurn();


  } else {
    setTimeout(() => {
      first.textContent = "";
      second.textContent = "";
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
  stopClick = false;
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