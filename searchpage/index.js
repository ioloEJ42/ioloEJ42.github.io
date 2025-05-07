document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    updateClock();
  }
};

function updateClock() {
  const date = new Date();
  const timeText = date.toLocaleTimeString([], { hourCycle: "h23" });
  const timeElement = document.getElementById("current-time-text");

  // Update time display only
  timeElement.innerText = timeText;
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

// Modal elements
const modal = document.getElementById("modal");
const helpButton = document.getElementById("help-button");
const closeButton = document.getElementById("close-modal");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const pageTitle = document.getElementById("page-title");
const modalContent = document.getElementById("modal-content");

// Page configuration
const pages = [
  { title: "i3WM_", jsonFile: "json/i3wm.json" },
  { title: "TMUX_", jsonFile: "json/tmux.json" },
  { title: "NANO_", jsonFile: "json/nano.json" },
];

let currentPageIndex = 0;

// Load and render functions
async function loadPageContent(jsonFile) {
  try {
    const response = await fetch(jsonFile);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading shortcuts:", error);
    return null;
  }
}

function renderShortcuts(data) {
  if (!data) return;
  const pageData = data[Object.keys(data)[0]];
  let html = '<div class="shortcuts-container">';

  pageData.sections.forEach((section) => {
    html += `
      <div class="shortcut-section">
        <h3 class="section-title">${section.name}</h3>
        <div class="shortcut-list">
    `;

    section.shortcuts.forEach((shortcut) => {
      html += `
        <div class="shortcut-item">
          <span class="shortcut-key">${shortcut.key}</span>
          <span class="shortcut-desc">${shortcut.desc}</span>
        </div>
      `;
    });

    html += `</div></div>`;
  });

  html += "</div>";
  modalContent.innerHTML = html;
}

async function updatePage() {
  pageTitle.textContent = pages[currentPageIndex].title;
  const data = await loadPageContent(pages[currentPageIndex].jsonFile);
  renderShortcuts(data);
}

// Modal control functions
function toggleModal() {
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
  if (modal.style.display === "flex") {
    currentPageIndex = 0;
    updatePage();
  }
}

// Event listeners
helpButton.onclick = toggleModal;
closeButton.onclick = () => (modal.style.display = "none");

// Navigation handlers
prevButton.onclick = () => {
  currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
  updatePage();
};

nextButton.onclick = () => {
  currentPageIndex = (currentPageIndex + 1) % pages.length;
  updatePage();
};

// Keyboard controls
document.addEventListener("keydown", function (event) {
  // Toggle modal with 'h' key when search isn't focused
  if (event.key === "h" && document.activeElement !== searchInput) {
    event.preventDefault();
    toggleModal();
  }

  // Handle arrow keys when modal is open and search isn't focused
  if (
    modal.style.display === "flex" &&
    document.activeElement !== searchInput
  ) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevButton.click();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextButton.click();
    }
  }
});

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
