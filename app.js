// Get DOM elements
const board = document.getElementById("game-board");
const reset = document.getElementById("reset-btn");
const darkBtn = document.querySelector(".dark");
const loseVideo = document.getElementById("loseVideo");

// Load sound effects
const matchSound = new Audio('matchSound.wav');
const mismatchSound = new Audio('mismatchSound.mp4');
const winSound = new Audio('winSound.mp3');
const flipSound = new Audio('flipSound.mp3');

// Game variables
let letters = ["A", "B", "C", "D", "E", "F", "G", "H"]; // Card values
let first = null;      // First flipped card
let second = null;     // Second flipped card
let flipping = false;  // Prevent clicks while cards are flipping or matched
let matchCount = 0;    // Number of matched pairs found

let timer = null;      // Interval timer reference
let timeLeft = 60;     // Time left in seconds

// Shuffle the cards array using Fisher-Yates algorithm
function mix(arr) {
  for(let i = arr.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[random]] = [arr[random], arr[i]];
  }
  return arr;
}

// Initialize and display the game board
function makeBoard() {
  // Create shuffled array of pairs (2 of each letter)
  let all = mix([...letters, ...letters]);
  
  // Clear previous board and messages
  board.innerHTML = "";
  document.getElementById("message").textContent = "";
  document.getElementById("timer").textContent = "Time: 60s";

  // Reset game state variables
  matchCount = 0;
  timeLeft = 60;

  // Hide and reset lose video
  loseVideo.pause();
  loseVideo.currentTime = 0;
  loseVideo.style.display = "none";

  // Clear any existing timer before starting new one
  if (timer) clearInterval(timer);

  // Start countdown timer
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time: ${timeLeft}s`;

    // When time runs out
    if (timeLeft <= 0) {
      clearInterval(timer);
      flipping = true; // Stop further card flipping
      document.getElementById("message").textContent = "⏰ Time's up! You Lose!";

      // Show and play the lose video
      loseVideo.style.display = "block";
      loseVideo.play();
    }
  }, 1000);

  // Create card elements and add click event listeners
  all.forEach((letter) => {
    let card = document.createElement("div");
    card.className = "card";
    card.dataset.value = letter;
    card.textContent = ""; // Hide letter initially
    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

// Handle flipping a card
function flipCard(card) {
  // Ignore clicks if flipping in progress or card already flipped/matched
  if (flipping || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  // Show the card's value
  card.textContent = card.dataset.value;
  card.classList.add("flipped");

  // Play flip sound effect
  flipSound.volume = 0.5;
  flipSound.play();

  // If this is the first card flipped, store it and return
  if (!first) {
    first = card;
    return;
  }

  // Otherwise, this is the second card flipped
  second = card;
  flipping = true; // Prevent further clicks until check is done

  // Check for match
  if (first.dataset.value === second.dataset.value) {
    // Mark both cards as matched
    first.classList.add("matched");
    second.classList.add("matched");

    // Play match sound
    matchSound.volume = 0.5;
    matchSound.play();

    matchCount++;

    // Check if all pairs matched -> player wins
    if (matchCount === letters.length) {
      clearInterval(timer);
      document.getElementById("message").textContent = `🎉 You Win in ${60 - timeLeft} seconds!`;
      winSound.volume = 0.5;
      winSound.play();
    }

    // Reset flip state for next turn
    clearTurn();

  } else {
    // Not a match: play mismatch sound and flip cards back after delay
    mismatchSound.volume = 0.5;
    mismatchSound.play();

    setTimeout(() => {
      first.textContent = "";
      second.textContent = "";
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      clearTurn();
    }, 500);
  }
}

// Reset flip state variables for next turn
function clearTurn() {
  first = null;
  second = null;
  flipping = false;
}

// Event listeners for buttons
reset.addEventListener("click", makeBoard);

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkBtn.textContent = document.body.classList.contains("dark-mode") ? "☀" : "🌙";
});

// Start the game on page load
makeBoard();
