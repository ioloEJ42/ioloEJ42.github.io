document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    updateClock();
  }
};

function updateClock() {
  const date = new Date();
  const timeText = date.toLocaleTimeString([], { hourCycle: "h23" });
  const timeElement = document.getElementById("current-time-text");
  const greetingElement = document.getElementById("time-greeting-text");

  // Update time display
  timeElement.innerText = timeText;
  timeElement.setAttribute("data-text", timeText);

  // Update greeting based on time
  const hour = date.getHours();
  let greetingText = "";

  if (hour < 5 || hour >= 18) {
    greetingText = "Noswaith dda, Iolo_";
  } else if (hour < 12) {
    greetingText = "Bore da, Iolo_";
  } else {
    greetingText = "Prynhawn da, Iolo_";
  }

  greetingElement.innerText = greetingText;
  greetingElement.setAttribute("data-text", greetingText);
}

// Update clock every second
setInterval(updateClock, 1000);

// Search functionality
function doSearch() {
  const query = document.getElementById("search-input").value;
  const searchEngine = document.getElementById("search-engine-select").value;

  // Add glitch effect before search
  document.body.classList.add("searching");

  setTimeout(() => {
    switch (searchEngine) {
      case "google":
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          query
        )}`;
        break;
      case "bing":
        window.location.href = `https://www.bing.com/?q=${encodeURIComponent(
          query
        )}`;
        break;
      case "ddg":
        window.location.href = `https://www.duckduckgo.com/?q=${encodeURIComponent(
          query
        )}`;
        break;
    }
  }, 300); // Short delay for glitch effect
}

// Search input event listener
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", function onEvent(event) {
  if (event.key === "Enter") {
    document.getElementById("search-button").click();
  }
});

// Remove searching class after animation completes
document.body.addEventListener("animationend", (e) => {
  if (e.animationName === "gridGlitch") {
    document.body.classList.remove("searching");
  }
});

// Color combinations array
const colorCombos = [
  { bg: "#000000", fg: "#ffffff" }, // Classic
  { bg: "#0D0221", fg: "#F6019D" }, // Neon Pink
  { bg: "#2D00F7", fg: "#E500A4" }, // Electric
  { bg: "#390099", fg: "#FF5400" }, // Sunset
  { bg: "#1A1B41", fg: "#C2E7D9" }, // Pastel Ice
  { bg: "#241734", fg: "#F0C808" }, // Gold Night
  { bg: "#2E294E", fg: "#FFD400" }, // Royal Sun
  { bg: "#1B1B1E", fg: "#7DBA84" }, // Forest
  { bg: "#2B061E", fg: "#F7D6E0" }, // Rose
  { bg: "#2D3047", fg: "#F7FFF7" }, // Clean Slate
  { bg: "#1A535C", fg: "#FFE66D" }, // Ocean Sun
  { bg: "#172A3A", fg: "#09BC8A" }, // Mint
  { bg: "#004E89", fg: "#FFD93D" }, // Navy Gold
  { bg: "#780116", fg: "#F7B538" }, // Ruby
  { bg: "#373F51", fg: "#DAA49A" }, // Dusty Rose
  { bg: "#451F55", fg: "#F7ECE1" }, // Royal Cream
  { bg: "#1E2019", fg: "#E2C044" }, // Dark Gold
  { bg: "#0B3954", fg: "#FF6B6B" }, // Ocean Coral
  { bg: "#2E0219", fg: "#84DCCF" }, // Wine Mint
  { bg: "#1A1423", fg: "#F1BF98" }, // Night Sand
];

let isAnimating = false;
const SEGMENT_DELAY = 90; // Faster timing (was 100)

// Function to animate color transition
function animateColorTransition(newBg, newFg) {
  const segments = document.querySelectorAll(".color-segment");
  const root = document.documentElement;

  // Reset animation state
  segments.forEach((segment) => {
    segment.style.opacity = "0";
    segment.style.backgroundColor = newBg;
  });

  // Animate segments from bottom to top
  segments.forEach((segment, index) => {
    setTimeout(() => {
      segment.style.opacity = "1"; // Full opacity
      segment.style.backgroundColor = newBg;
    }, (segments.length - index - 1) * SEGMENT_DELAY);
  });

  // Update CSS variables after last segment
  setTimeout(() => {
    root.style.setProperty("--pure-black", newBg);
    root.style.setProperty("--pure-white", newFg);
    isAnimating = false;
  }, segments.length * SEGMENT_DELAY + 100);
}

// Color switch button click handler
document.getElementById("color-switch").addEventListener("click", () => {
  // Allow new animation to start even if one is in progress
  const randomCombo =
    colorCombos[Math.floor(Math.random() * colorCombos.length)];
  animateColorTransition(randomCombo.bg, randomCombo.fg);
});
