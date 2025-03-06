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

  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // Initialize the game
  initGame("daily");

  // Add event listeners
  guessInput.addEventListener("keypress", handleGuessInput);
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

  // Function to handle guess input
  function handleGuessInput(event) {
    if (event.key === "Enter" && !gameOver) {
      const guess = guessInput.value.trim().toUpperCase();

      // Validate input (must be a valid hex color code)
      if (!/^#[0-9A-F]{6}$/.test(guess)) {
        addTerminalOutput(
          "Invalid hex code. Please use format #RRGGBB (e.g., #FF5733)."
        );
        guessInput.value = "";
        return;
      }

      // Check if color has already been guessed
      if (guessedColors.has(guess)) {
        addTerminalOutput("You already guessed that color. Try another one.");
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

  // Function to add text to the terminal output
  function addTerminalOutput(text) {
    const outputP = document.createElement("p");
    outputP.textContent = text;

    // Find the terminal output div
    const terminalOutput = document.querySelector(".terminal-output");
    terminalOutput.appendChild(outputP);
  }

  // Function to end the game
  function endGame(won) {
    guessInput.disabled = true;

    // Show result modal
    showResultModal(won);
  }

  // Function to show the result modal
  function showResultModal(won) {
    resultTitle.textContent = won ? "Success!" : "Game Over";
    resultMessage.textContent = won
      ? `You guessed the color in ${guessCount} ${
          guessCount === 1 ? "attempt" : "attempts"
        }!`
      : `The correct color was:`;

    resultColor.style.backgroundColor = targetColor;
    resultColorCode.textContent = targetColor;

    // Generate share text
    const shareText = generateShareText(won, guessCount);
    shareResult.textContent = shareText;

    // Show modal
    resultModal.style.display = "block";
  }

  // Function to generate share text
  function generateShareText(won, guessCount) {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    let text = `HexGuesser ${dateStr}\n`;
    if (gameMode === "daily") {
      text += `Daily `;
    } else {
      text += `Random `;
    }

    if (won) {
      text += `Solved in ${guessCount}/${maxGuesses} guesses\n\n`;
    } else {
      text += `Failed to solve\n\n`;
    }

    // Add emoji representation of guesses
    const guessItems = document.querySelectorAll(".guess-feedback");
    guessItems.forEach((item) => {
      text += item.textContent + "\n";
    });

    return text;
  }

  // Function to copy result to clipboard
  function copyResultToClipboard() {
    const text = shareResult.textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyResultButton.textContent = "Copied!";
      setTimeout(() => {
        copyResultButton.textContent = "Copy to Clipboard";
      }, 2000);
    });
  }

  // Functions to show/hide modals
  function showHowToPlayModal() {
    howToPlayModal.style.display = "block";
  }

  function showLearnModal() {
    learnModal.style.display = "block";
  }

  function closeModals() {
    howToPlayModal.style.display = "none";
    learnModal.style.display = "none";
    resultModal.style.display = "none";
  }

  // Function to restart the game
  function restartGame() {
    closeModals();
    initGame(gameMode);
  }

  // Close modals if clicking outside the content
  window.addEventListener("click", (event) => {
    if (event.target === howToPlayModal) {
      howToPlayModal.style.display = "none";
    } else if (event.target === learnModal) {
      learnModal.style.display = "none";
    } else if (event.target === resultModal) {
      resultModal.style.display = "none";
    }
  });
});
