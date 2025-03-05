document.addEventListener("DOMContentLoaded", function () {
  // Skill name mapping for abbreviated labels
  const skillMapping = {
    acr: "acrobatics",
    ani: "animal-handling",
    arc: "arcana",
    ath: "athletics",
    dec: "deception",
    his: "history",
    ins: "insight",
    int: "intimidation",
    inv: "investigation",
    med: "medicine",
    nat: "nature",
    per: "perception",
    perf: "performance",
    pers: "persuasion",
    rel: "religion",
    soh: "sleight-of-hand",
    ste: "stealth",
    sur: "survival",
  };

  // Function to calculate ability modifier from score
  function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
  }

  // Format modifier with + or - prefix
  function formatModifier(modifier) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  // Set up ability score modifier calculations
  const abilityScoreInputs = document.querySelectorAll(".ability-score");

  // Set up event listeners for each ability score input
  abilityScoreInputs.forEach((input) => {
    // Initial calculation when page loads
    updateModifier(input);

    // Listen for input changes
    input.addEventListener("input", function () {
      updateModifier(this);
    });
  });

  // Function to update the modifier based on the ability score
  function updateModifier(input) {
    const abilityId = input.id;
    const modifierId = abilityId.replace("score", "mod");
    const modifierElement = document.getElementById(modifierId);

    // Get the score value (default to 10 if empty or not a number)
    const scoreValue = parseInt(input.value) || 10;

    // Calculate and display the modifier
    const modifier = calculateModifier(scoreValue);
    modifierElement.textContent = formatModifier(modifier);
  }

  // Set up HP bar functionality if elements exist
  const currentHPInput = document.getElementById("current-hp");
  const maxHPInput = document.getElementById("max-hp");

  if (currentHPInput && maxHPInput) {
    // Check if HP bar exists, create it if not
    let hpContainer = document.querySelector(".hp-container");
    if (!hpContainer) {
      // Convert the stat-box to hp-container
      hpContainer = document.querySelector(".stat-box:has(#current-hp)");
      if (hpContainer) {
        hpContainer.classList.add("hp-container");

        // Create the HP bar container and bar
        const hpBarContainer = document.createElement("div");
        hpBarContainer.className = "hp-bar-container";

        const hpBar = document.createElement("div");
        hpBar.className = "hp-bar";
        hpBar.id = "hp-bar";

        hpBarContainer.appendChild(hpBar);
        hpContainer.appendChild(hpBarContainer);
      }
    }

    // Initial update of HP bar
    updateHPBar();

    // Add event listeners for HP changes
    currentHPInput.addEventListener("input", updateHPBar);
    maxHPInput.addEventListener("input", updateHPBar);
  }

  // Function to update the HP bar
  function updateHPBar() {
    const hpBar = document.getElementById("hp-bar");
    if (!hpBar) return;

    const currentHP =
      parseInt(document.getElementById("current-hp").value) || 0;
    const maxHP = parseInt(document.getElementById("max-hp").value) || 1;
    const percentage = Math.min(100, Math.max(0, (currentHP / maxHP) * 100));

    hpBar.style.width = percentage + "%";

    // Change color based on health percentage
    if (percentage <= 25) {
      hpBar.style.backgroundColor = "var(--danger-color)"; // Red for low health
    } else if (percentage <= 50) {
      hpBar.style.backgroundColor = "var(--warning-color)"; // Orange for medium health
    } else {
      hpBar.style.backgroundColor = "var(--success-color)"; // Green for good health
    }
  }

  // Add tooltips to proficiency boxes
  const proficiencyBoxes = document.querySelectorAll(".proficiency-box");

  proficiencyBoxes.forEach((box) => {
    // Make it a tooltip container
    box.classList.add("tooltip");

    // Create tooltip text element
    const tooltip = document.createElement("span");
    tooltip.className = "tooltiptext";
    tooltip.textContent = "Click to toggle: none → proficient → expert";

    box.appendChild(tooltip);
  });

  // Proficiency box toggling
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("proficiency-box")) {
      const box = event.target;
      const currentState = box.getAttribute("data-state");

      if (currentState === "none") {
        box.setAttribute("data-state", "proficient");
      } else if (currentState === "proficient") {
        box.setAttribute("data-state", "expert");
      } else {
        box.setAttribute("data-state", "none");
      }
    }
  });

  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Theme switching
  // Theme switching
  const themeSelect = document.getElementById("theme-select");
  themeSelect.addEventListener("change", function () {
    const theme = this.value;
    document.body.className = ""; // Remove all theme classes

    // Apply the selected theme class
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else if (theme === "parchment") {
      document.body.classList.add("parchment-theme");
    } else if (theme === "wizard") {
      document.body.classList.add("wizard-theme");
    } else if (theme === "barbarian") {
      document.body.classList.add("barbarian-theme");
    } else if (theme === "bard") {
      document.body.classList.add("bard-theme");
    } else if (theme === "cleric") {
      document.body.classList.add("cleric-theme");
    } else if (theme === "druid") {
      document.body.classList.add("druid-theme");
    } else if (theme === "fighter") {
      document.body.classList.add("fighter-theme");
    } else if (theme === "monk") {
      document.body.classList.add("monk-theme");
    } else if (theme === "paladin") {
      document.body.classList.add("paladin-theme");
    } else if (theme === "ranger") {
      document.body.classList.add("ranger-theme");
    } else if (theme === "rogue") {
      document.body.classList.add("rogue-theme");
    } else if (theme === "sorcerer") {
      document.body.classList.add("sorcerer-theme");
    } else if (theme === "warlock") {
      document.body.classList.add("warlock-theme");
    } else if (theme === "artificer") {
      document.body.classList.add("artificer-theme");
    } else if (theme === "bloodhunter") {
      document.body.classList.add("bloodhunter-theme");
    } else if (theme === "cyberpunk") {
      document.body.classList.add("cyberpunk-theme");
    } else if (theme === "ethereal") {
      document.body.classList.add("ethereal-theme");
    } else if (theme === "infernal") {
      document.body.classList.add("infernal-theme");
    } else if (theme === "nature") {
      document.body.classList.add("nature-theme");
    } else if (theme === "vampire") {
      document.body.classList.add("vampire-theme");
    } else if (theme === "desert") {
      document.body.classList.add("desert-theme");
    } else if (theme === "winter") {
      document.body.classList.add("winter-theme");
    } else if (theme === "halloween") {
      document.body.classList.add("halloween-theme");
    } else if (theme === "celestial") {
      document.body.classList.add("celestial-theme");
    } else if (theme === "retro") {
      document.body.classList.add("retro-theme");
    } else if (theme === "pirate") {
      document.body.classList.add("pirate-theme");
    }
    // light theme is default, no class needed

    // Save theme preference
    localStorage.setItem("dnd-theme", theme);
  });

  // Load saved theme preference
  const savedTheme = localStorage.getItem("dnd-theme");
  if (savedTheme) {
    themeSelect.value = savedTheme;
    themeSelect.dispatchEvent(new Event("change"));
  }

  // Character image upload
  const uploadImage = document.getElementById("upload-image");
  const characterPortrait = document.getElementById("character-portrait");
  const imagePlaceholder = document.getElementById("image-placeholder");

  document
    .querySelector(".character-image")
    .addEventListener("click", function () {
      uploadImage.click();
    });

  uploadImage.addEventListener("change", function (event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        characterPortrait.src = e.target.result;
        characterPortrait.style.display = "block";
        imagePlaceholder.style.display = "none";
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  });

  // Add weapon row
  document.getElementById("add-weapon").addEventListener("click", function () {
    const weaponsTable = document
      .getElementById("weapons-table")
      .getElementsByTagName("tbody")[0];
    const newRow = weaponsTable.insertRow();

    for (let i = 0; i < 3; i++) {
      const cell = newRow.insertCell(i);
      cell.setAttribute("contenteditable", "true");
    }
  });

  // Character file location paths
  const CHARACTER_BASE_PATH = "./Characters/";
  const MANIFEST_PATH = "./Characters/manifest.json";

  // Character tracking variables
  let currentCharacter = null;
  let editedData = null;

  // Character saving/loading functionality
  document
    .getElementById("save-button")
    .addEventListener("click", saveCharacter);
  document
    .getElementById("character-select")
    .addEventListener("change", loadSelectedCharacter);
  document
    .getElementById("new-character")
    .addEventListener("click", createNewCharacter);

  // Import file handling
  document
    .getElementById("import-file")
    .addEventListener("change", function (event) {
      if (event.target.files && event.target.files[0]) {
        importCharacter(event.target.files[0]);
      }
    });

  // Load character list on startup
  loadCharacterList();

  // Function to load the character list from manifest.json
  function loadCharacterList() {
    const characterSelect = document.getElementById("character-select");

    // Clear existing options except the default and import
    while (characterSelect.options.length > 2) {
      characterSelect.remove(2);
    }

    // Fetch the manifest file
    fetch(MANIFEST_PATH)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch character manifest");
        }
        return response.json();
      })
      .then((manifest) => {
        // Add each character to the dropdown
        manifest.characters.forEach((charData) => {
          const option = document.createElement("option");
          option.value = charData.filename;
          option.textContent = charData.name;
          characterSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error loading character list:", error);
        // For development, use sample data if manifest doesn't exist
        addSampleCharacters();
      });
  }

  // Add sample character for development/testing
  function addSampleCharacters() {
    const characterSelect = document.getElementById("character-select");

    const option = document.createElement("option");
    option.value = "Tharion_Nightwhisper.json";
    option.textContent = "Tharion Nightwhisper";
    characterSelect.appendChild(option);
  }

  // Function to load selected character
  function loadSelectedCharacter() {
    const filename = this.value;

    if (!filename) {
      return; // Default option selected
    }

    if (filename === "import") {
      // Trigger import file dialog
      document.getElementById("import-file").click();
      // Reset selection
      this.value = currentCharacter || "";
      return;
    }

    // Show loading state
    document.body.classList.add("loading");

    // Confirm before loading if there are unsaved changes
    if (hasUnsavedChanges()) {
      if (
        !confirm("You have unsaved changes. Load another character anyway?")
      ) {
        // Reset select to previous value
        this.value = currentCharacter || "";
        document.body.classList.remove("loading");
        return;
      }
    }

    // Fetch the character file
    fetch(CHARACTER_BASE_PATH + filename)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load character: ${filename}`);
        }
        return response.json();
      })
      .then((characterData) => {
        // Clear form and populate with character data
        clearForm();
        populateCharacterData(characterData);

        // Store current character info
        currentCharacter = filename;
        editedData = characterData;

        // Remove loading state
        document.body.classList.remove("loading");
      })
      .catch((error) => {
        console.error("Error loading character:", error);
        alert(`Error loading character: ${error.message}`);
        document.body.classList.remove("loading");
      });
  }

  // Function to populate form with character data
  function populateCharacterData(characterData) {
    // Standard inputs
    for (const [key, value] of Object.entries(characterData)) {
      const element = document.getElementById(key);

      if (!element) {
        // Handle skill proficiencies and values
        if (key.startsWith("skill-") && key.endsWith("-proficiency")) {
          const skillName = key
            .replace("skill-", "")
            .replace("-proficiency", "");
          const skillElements = document.querySelectorAll(".skill");

          for (const skillElement of skillElements) {
            const label = skillElement.querySelector("label");
            if (label) {
              const abbr = label.textContent.split(" ")[0].toLowerCase();
              if (skillMapping[abbr] === skillName) {
                const box = skillElement.querySelector(".proficiency-box");
                if (box) {
                  box.setAttribute("data-state", value);
                }
                break;
              }
            }
          }
        } else if (key.startsWith("skill-") && key.endsWith("-value")) {
          const skillName = key.replace("skill-", "").replace("-value", "");
          const skillElements = document.querySelectorAll(".skill");

          for (const skillElement of skillElements) {
            const label = skillElement.querySelector("label");
            if (label) {
              const abbr = label.textContent.split(" ")[0].toLowerCase();
              if (skillMapping[abbr] === skillName) {
                const input = skillElement.querySelector(".skill-value");
                if (input) {
                  input.value = value;
                }
                break;
              }
            }
          }
        }
        // Handle saving throw proficiencies and values
        else if (key.startsWith("save-") && key.endsWith("-proficiency")) {
          const saveName = key.replace("save-", "").replace("-proficiency", "");
          const saveElements = document.querySelectorAll(".save");

          for (const saveElement of saveElements) {
            const label = saveElement.querySelector("label");
            if (label && label.textContent.toLowerCase() === saveName) {
              const box = saveElement.querySelector(".proficiency-box");
              if (box) {
                box.setAttribute("data-state", value);
              }
              break;
            }
          }
        } else if (key.startsWith("save-") && key.endsWith("-value")) {
          const saveName = key.replace("save-", "").replace("-value", "");
          const saveElements = document.querySelectorAll(".save");

          for (const saveElement of saveElements) {
            const label = saveElement.querySelector("label");
            if (label && label.textContent.toLowerCase() === saveName) {
              const input = saveElement.querySelector(".save-value");
              if (input) {
                input.value = value;
              }
              break;
            }
          }
        }

        // Skip other entries that don't match any element ID
        continue;
      }

      if (element.tagName === "INPUT") {
        if (element.type === "checkbox") {
          element.checked = value;
        } else {
          element.value = value;

          // If this is an ability score, update the modifier
          if (element.classList.contains("ability-score")) {
            updateModifier(element);
          }
        }
      } else if (element.hasAttribute("contenteditable")) {
        element.innerHTML = value;
      }
    }

    // Handle weapons table
    if (characterData["weapons-table"]) {
      const weaponsTable = document
        .getElementById("weapons-table")
        .getElementsByTagName("tbody")[0];
      // Clear existing rows
      weaponsTable.innerHTML = "";

      // Add saved rows
      characterData["weapons-table"].forEach((rowData) => {
        if (!rowData) return; // Skip empty rows

        const row = weaponsTable.insertRow();
        rowData.forEach((cellData, index) => {
          const cell = row.insertCell(index);
          cell.setAttribute("contenteditable", "true");
          cell.innerHTML = cellData || "";
        });
      });
    }

    // Handle character image
    if (characterData["character-image"]) {
      const characterPortrait = document.getElementById("character-portrait");
      characterPortrait.src = characterData["character-image"];
      characterPortrait.style.display = "block";
      document.getElementById("image-placeholder").style.display = "none";
    }

    // Update HP bar if it exists
    if (document.getElementById("hp-bar")) {
      updateHPBar();
    }
  }

  // Function to save the current character
  function saveCharacter() {
    const characterName = document
      .getElementById("character-name")
      .value.trim();

    if (!characterName) {
      alert("Please enter a character name before saving.");
      return;
    }

    // Get all form inputs
    const formData = {};

    // Standard inputs
    document
      .querySelectorAll('input[type="text"], input[type="number"]')
      .forEach((input) => {
        formData[input.id] = input.value;
      });

    // Checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      formData[checkbox.id] = checkbox.checked;
    });

    // Skill proficiencies and saving throws
    document.querySelectorAll(".proficiency-box").forEach((box) => {
      // Determine if it's a skill or save
      const parent = box.closest(".skill, .save");
      const label = parent.querySelector("label");
      if (!label) return;

      const isSkill = parent.classList.contains("skill");
      const isSave = parent.classList.contains("save");

      if (isSkill) {
        // Extract abbreviation
        const abbr = label.textContent.split(" ")[0].toLowerCase();
        if (skillMapping[abbr]) {
          formData[`skill-${skillMapping[abbr]}-proficiency`] =
            box.getAttribute("data-state");
        }
      } else if (isSave) {
        let name = label.textContent.toLowerCase();
        formData[`save-${name}-proficiency`] = box.getAttribute("data-state");
      }
    });

    // Skill and save values
    document.querySelectorAll(".skill-value, .save-value").forEach((input) => {
      const parent = input.closest(".skill, .save");
      const label = parent.querySelector("label");
      if (!label) return;

      const isSkill = parent.classList.contains("skill");
      const isSave = parent.classList.contains("save");

      if (isSkill) {
        // Extract abbreviation (first part before space)
        const abbr = label.textContent.split(" ")[0].toLowerCase();
        if (skillMapping[abbr]) {
          formData[`skill-${skillMapping[abbr]}-value`] = input.value;
        }
      } else if (isSave) {
        let name = label.textContent.toLowerCase();
        formData[`save-${name}-value`] = input.value;
      }
    });

    // Contenteditable elements
    document.querySelectorAll('[contenteditable="true"]').forEach((element) => {
      // For table cells, we need to handle them differently
      if (element.tagName === "TD") {
        const rowIndex = element.parentElement.rowIndex;
        const cellIndex = element.cellIndex;
        const tableId = element.closest("table").id;

        if (!formData[tableId]) {
          formData[tableId] = [];
        }

        if (!formData[tableId][rowIndex]) {
          formData[tableId][rowIndex] = [];
        }

        formData[tableId][rowIndex][cellIndex] = element.innerHTML;
      } else {
        formData[element.id] = element.innerHTML;
      }
    });

    // Handle character image
    const characterPortrait = document.getElementById("character-portrait");
    if (characterPortrait.src && characterPortrait.style.display !== "none") {
      formData["character-image"] = characterPortrait.src;
    }

    // Show saving animation
    const saveButton = document.getElementById("save-button");
    const originalText = saveButton.textContent;
    saveButton.textContent = "Saving...";
    saveButton.disabled = true;

    // Simulate a delay for saving (remove in production)
    setTimeout(() => {
      // Download JSON file
      downloadCharacterFile(formData);

      // Update edited data
      editedData = formData;

      // Reset button
      saveButton.textContent = originalText;
      saveButton.disabled = false;
    }, 500);
  }

  // Download character as JSON file
  function downloadCharacterFile(characterData) {
    const characterName = characterData["character-name"];
    // Create a filename-friendly version of the character name
    const filename = characterName.replace(/\s+/g, "_") + ".json";

    // Format JSON with nice indentation
    const dataStr = JSON.stringify(characterData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    // Create and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);

    alert(
      `Character saved as ${filename}. Please add it to your DND/Characters/ directory and update the manifest if needed.`
    );
  }

  // Function to import character from JSON file
  function importCharacter(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const characterData = JSON.parse(e.target.result);

        // Check for character name
        if (!characterData["character-name"]) {
          alert("Invalid character file: No character name found.");
          return;
        }

        // Clear form and populate with character data
        clearForm();
        populateCharacterData(characterData);

        // Store as current character (but don't set dropdown)
        currentCharacter = file.name;
        editedData = characterData;

        alert(
          `Character "${characterData["character-name"]}" imported successfully!`
        );
      } catch (error) {
        alert("Error importing character: " + error.message);
      }
    };

    reader.readAsText(file);
  }

  // Function to create a new character
  function createNewCharacter() {
    // Confirm before clearing if there are unsaved changes
    if (
      hasUnsavedChanges() &&
      !confirm("You have unsaved changes. Create a new character anyway?")
    ) {
      return;
    }

    clearForm();
    currentCharacter = null;
    editedData = null;
    document.getElementById("character-select").value = "";
  }

  // Function to clear the form
  function clearForm() {
    // Clear inputs
    document
      .querySelectorAll('input[type="text"], input[type="number"]')
      .forEach((input) => {
        input.value = "";

        // If this is an ability score, update the modifier
        if (input.classList.contains("ability-score")) {
          updateModifier(input);
        }
      });

    // Uncheck checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Clear skill proficiency boxes and saving throw boxes
    document.querySelectorAll(".proficiency-box").forEach((box) => {
      box.setAttribute("data-state", "none");
    });

    // Clear skill values and saving throw values
    document.querySelectorAll(".skill-value, .save-value").forEach((input) => {
      input.value = "";
    });

    // Clear contenteditable elements
    document.querySelectorAll('[contenteditable="true"]').forEach((element) => {
      element.innerHTML = "";
    });

    // Reset character image
    document.getElementById("character-portrait").style.display = "none";
    document.getElementById("image-placeholder").style.display = "block";

    // Reset weapons table to just have 3 empty rows
    const weaponsTable = document
      .getElementById("weapons-table")
      .getElementsByTagName("tbody")[0];
    weaponsTable.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const row = weaponsTable.insertRow();
      for (let j = 0; j < 3; j++) {
        const cell = row.insertCell(j);
        cell.setAttribute("contenteditable", "true");
      }
    }

    // Update HP bar if it exists
    if (document.getElementById("hp-bar")) {
      updateHPBar();
    }
  }

  // Function to check for unsaved changes
  function hasUnsavedChanges() {
    if (
      !currentCharacter &&
      document.getElementById("character-name").value.trim() === ""
    ) {
      return false; // No character loaded and no data entered
    }

    if (editedData === null) {
      return document.getElementById("character-name").value.trim() !== "";
    }

    // Compare character name as a simple check
    return (
      document.getElementById("character-name").value !==
      editedData["character-name"]
    );
  }

  // Add a function to save the current character before the window is closed
  window.addEventListener("beforeunload", function (e) {
    if (hasUnsavedChanges()) {
      // Standard approach to show confirmation dialog
      const confirmationMessage =
        "You have unsaved changes. Are you sure you want to leave?";
      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    }
  });
});
