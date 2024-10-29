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
