document.addEventListener("DOMContentLoaded", () => {
  // Game variables
  let targetColor;
  let guessCount = 0;
  const maxGuesses = 6;
  let gameOver = false;
  let gameWon = false;
  let gameMode = "daily"; // 'daily' or 'random'
  let guessedColors = new Set(); // Track colors that have been guessed

  // DOM elements
  const colorDisplay = document.getElementById("color-display");
  const guessInput = document.getElementById("guess-input");
  const submitGuessBtn = document.getElementById("submit-guess");
  const guessesList = document.getElementById("guesses-list");
  const howToPlayLink = document.getElementById("how-to-play");
  const howToPlayModal = document.getElementById("how-to-play-modal");
  const learnButton = document.getElementById("learn-button");
  const learnModal = document.getElementById("learn-modal");
  const dailyButton = document.getElementById("daily-button");
  const randomButton = document.getElementById("random-button");
  const resultModal = document.getElementById("result-modal");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const resultColor = document.getElementById("result-color");
  const resultColorCode = document.getElementById("result-color-code");
  const shareResult = document.getElementById("share-result");
  const copyResultButton = document.getElementById("copy-result");
  const closeButtons = document.querySelectorAll(".close-modal");
  const closeRestartButtons = document.querySelectorAll(".close-modal-restart");
  const gameInstructions = document.querySelector(".game-instructions");

  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // Initialize the game
  initGame("daily");

  // Add event listeners
  guessInput.addEventListener("keypress", handleGuessInput);
  submitGuessBtn.addEventListener("click", handleSubmitButton);
  howToPlayLink.addEventListener("click", showHowToPlayModal);
  learnButton.addEventListener("click", showLearnModal);
  dailyButton.addEventListener("click", () => initGame("daily"));
  randomButton.addEventListener("click", () => initGame("random"));
  copyResultButton.addEventListener("click", copyResultToClipboard);
  closeButtons.forEach((button) =>
    button.addEventListener("click", closeModals)
  );
  closeRestartButtons.forEach((button) =>
    button.addEventListener("click", restartGame)
  );

  // Function to initialize the game
  function initGame(mode) {
    gameMode = mode;

    // Update active nav link
    document
      .querySelectorAll(".nav-links li")
      .forEach((item) => item.classList.remove("active"));
    if (mode === "daily") {
      dailyButton.parentElement.classList.add("active");
      targetColor = generateDailyColor();
    } else {
      randomButton.parentElement.classList.add("active");
      targetColor = generateRandomColor();
    }

    // Set the color display
    colorDisplay.style.backgroundColor = targetColor;

    // Reset game state
    guessCount = 0;
    gameOver = false;
    gameWon = false;
    guessesList.innerHTML = "";
    guessInput.value = "";
    guessInput.disabled = false;
    guessInput.focus();
    guessedColors.clear(); // Clear previously guessed colors
  }

  // Function to generate a daily color
  function generateDailyColor() {
    const today = new Date();
    const dateString = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;

    // Simple hash function to generate a seed from the date
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
      seed = (seed << 5) - seed + dateString.charCodeAt(i);
      seed = seed & seed; // Convert to 32bit integer
    }

    // Use the seed to generate a consistent color for the day
    const pseudoRandom = function () {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const r = Math.floor(pseudoRandom() * 256)
      .toString(16)
      .padStart(2, "0");
    const g = Math.floor(pseudoRandom() * 256)
      .toString(16)
      .padStart(2, "0");
    const b = Math.floor(pseudoRandom() * 256)
      .toString(16)
      .padStart(2, "0");

    return `#${r}${g}${b}`.toUpperCase();
  }

  // Function to generate a random color
  function generateRandomColor() {
    const r = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const g = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const b = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");

    return `#${r}${g}${b}`.toUpperCase();
  }

  // Function to handle submit button click
  function handleSubmitButton() {
    if (!gameOver) {
      processGuessInput(guessInput.value);
    }
  }

  // Function to handle guess input
  function handleGuessInput(event) {
    if (event.key === "Enter" && !gameOver) {
      processGuessInput(guessInput.value);
    }
  }

  // Function to process guess input
  function processGuessInput(inputValue) {
    const guess = inputValue.trim().toUpperCase();

    // Validate input (must be a valid hex color code)
    if (!/^#[0-9A-F]{6}$/.test(guess)) {
      showMessage("Invalid hex code. Please use format #RRGGBB (e.g., #FF5733).");
      guessInput.value = "";
      return;
    }

    // Check if color has already been guessed
    if (guessedColors.has(guess)) {
      showMessage("You already guessed that color. Try another one.");
      guessInput.value = "";
      return;
    }

    // Add to guessed colors set
    guessedColors.add(guess);

    // Process the guess
    processGuess(guess);

    // Clear input field
    guessInput.value = "";
  }

  // Function to show message in game instructions
  function showMessage(text) {
    const messageP = document.createElement("p");
    messageP.textContent = text;
    messageP.className = "message";

    // Add to game instructions
    gameInstructions.appendChild(messageP);

    // Remove after delay
    setTimeout(() => {
      if (gameInstructions.contains(messageP)) {
        gameInstructions.removeChild(messageP);
      }
    }, 3000);
  }

  // Function to process a guess
  function processGuess(guess) {
    guessCount++;

    // Calculate feedback
    const feedback = calculateFeedback(guess, targetColor);

    // Add guess to the list
    addGuessToList(guess, feedback);

    // Check if the guess is correct
    if (guess === targetColor) {
      gameWon = true;
      gameOver = true;
      endGame(true);
    } else if (guessCount >= maxGuesses) {
      gameOver = true;
      endGame(false);
    }
  }

  // Function to calculate feedback for a guess
  function calculateFeedback(guess, target) {
    const result = Array(6).fill("⬛"); // Start with all incorrect
    const targetChars = target.substring(1).split("");
    const guessChars = guess.substring(1).split("");

    // First pass: Check for correct position
    for (let i = 0; i < 6; i++) {
      if (guessChars[i] === targetChars[i]) {
        result[i] = "🟩"; // Correct position
        targetChars[i] = null; // Mark as used
        guessChars[i] = null; // Mark as used
      }
    }

    // Second pass: Check for correct digit but wrong position
    for (let i = 0; i < 6; i++) {
      if (guessChars[i] !== null) {
        const targetIndex = targetChars.indexOf(guessChars[i]);
        if (targetIndex !== -1) {
          result[i] = "🟨"; // Correct digit, wrong position
          targetChars[targetIndex] = null; // Mark as used
        }
      }
    }

    return result.join("");
  }

  // Function to add a guess to the list
  function addGuessToList(guess, feedback) {
    const guessItem = document.createElement("div");
    guessItem.className =
      "guess-item" + (guess === targetColor ? " correct" : "");

    // Create color swatch
    const colorSwatch = document.createElement("div");
    colorSwatch.className = "guess-color";
    colorSwatch.style.backgroundColor = guess;

    // Create hex code
    const hexCode = document.createElement("div");
    hexCode.className = "guess-hex";
    hexCode.textContent = guess;

    // Create feedback
    const feedbackElement = document.createElement("div");
    feedbackElement.className = "guess-feedback";
    feedbackElement.textContent = feedback;

    // Add elements to guess item
    guessItem.appendChild(colorSwatch);
    guessItem.appendChild(hexCode);
    guessItem.appendChild(feedbackElement);

    // Add guess item to list
    guessesList.appendChild(guessItem);
  }

  // Function to end the game
  function endGame(won) {
    guessInput.disabled = true;
    
    if (won) {
      showMessage(`Congratulations! You guessed the color in ${guessCount} ${guessCount === 1 ? 'try' : 'tries'}.`);
    } else {
      showMessage(`Game over. The color was ${targetColor}.`);
    }

    // Show result modal after a brief delay
    setTimeout(() => {
      showResultModal(won);
    }, 1500);
  }

  // Function to show the result modal
  function showResultModal(won) {
    resultTitle.textContent = won ? "Congratulations!" : "Game Over";
    resultMessage.textContent = won
      ? `You guessed the color in ${guessCount} ${guessCount === 1 ? 'try' : 'tries'}!`
      : `The correct color was: ${targetColor}`;
    
    resultColor.style.backgroundColor = targetColor;
    resultColorCode.textContent = targetColor;
    
    // Generate share text
    shareResult.textContent = generateShareText(won, guessCount);
    
    // Show modal
    resultModal.classList.add("active");
  }

  // Function to generate share text
  function generateShareText(won, guessCount) {
    const date = new Date();
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    
    let text = `Hexathon ${dateString} - ${gameMode.toUpperCase()}\n`;
    
    if (won) {
      text += `Solved in ${guessCount}/6 tries\n`;
    } else {
      text += `X/6 - Failed to guess ${targetColor}\n`;
    }
    
    // Add guess pattern
    const guessItems = document.querySelectorAll('.guess-feedback');
    guessItems.forEach(item => {
      text += item.textContent + '\n';
    });
    
    return text;
  }

  // Function to copy result to clipboard
  function copyResultToClipboard() {
    const text = shareResult.textContent;
    
    navigator.clipboard.writeText(text).then(
      () => {
        copyResultButton.textContent = "Copied!";
        setTimeout(() => {
          copyResultButton.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
        }, 2000);
      },
      () => {
        alert("Failed to copy result to clipboard");
      }
    );
  }

  // Function to show how to play modal
  function showHowToPlayModal() {
    howToPlayModal.classList.add("active");
  }

  // Function to show learn modal
  function showLearnModal() {
    learnModal.classList.add("active");
  }

  // Function to close modals
  function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove("active");
    });
  }

  // Function to restart game
  function restartGame() {
    closeModals();
    initGame(gameMode);
  }
});
