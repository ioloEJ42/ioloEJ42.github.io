document.addEventListener("DOMContentLoaded", function () {
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
  const themeSelect = document.getElementById("theme-select");
  themeSelect.addEventListener("change", function () {
    const theme = this.value;
    document.body.className = ""; // Remove all theme classes
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else if (theme === "parchment") {
      document.body.classList.add("parchment-theme");
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

    // Confirm before loading if there are unsaved changes
    if (hasUnsavedChanges()) {
      if (
        !confirm("You have unsaved changes. Load another character anyway?")
      ) {
        // Reset select to previous value
        this.value = currentCharacter || "";
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
      })
      .catch((error) => {
        console.error("Error loading character:", error);
        alert(`Error loading character: ${error.message}`);
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
            if (
              label &&
              label.textContent
                .toLowerCase()
                .startsWith(skillName.replace(/-/g, " "))
            ) {
              const box = skillElement.querySelector(".proficiency-box");
              if (box) {
                box.setAttribute("data-state", value);
              }
              break;
            }
          }
        } else if (key.startsWith("skill-") && key.endsWith("-value")) {
          const skillName = key.replace("skill-", "").replace("-value", "");
          const skillElements = document.querySelectorAll(".skill");

          for (const skillElement of skillElements) {
            const label = skillElement.querySelector("label");
            if (
              label &&
              label.textContent
                .toLowerCase()
                .startsWith(skillName.replace(/-/g, " "))
            ) {
              const input = skillElement.querySelector(".skill-value");
              if (input) {
                input.value = value;
              }
              break;
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

      let name = label.textContent
        .replace(/\s+\(.+\)$/, "") // Remove ability in parentheses for skills
        .toLowerCase()
        .replace(/\s+/g, "-");

      // Add type prefix for proper identification
      const prefix = isSkill ? "skill-" : isSave ? "save-" : "";

      formData[`${prefix}${name}-proficiency`] = box.getAttribute("data-state");
    });

    // Skill and save values
    document.querySelectorAll(".skill-value, .save-value").forEach((input) => {
      const parent = input.closest(".skill, .save");
      const label = parent.querySelector("label");
      if (!label) return;

      const isSkill = parent.classList.contains("skill");
      const isSave = parent.classList.contains("save");

      let name = label.textContent
        .replace(/\s+\(.+\)$/, "") // Remove ability in parentheses for skills
        .toLowerCase()
        .replace(/\s+/g, "-");

      // Add type prefix for proper identification
      const prefix = isSkill ? "skill-" : isSave ? "save-" : "";

      formData[`${prefix}${name}-value`] = input.value;
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

    // Download JSON file
    downloadCharacterFile(formData);

    // Update edited data
    editedData = formData;
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
});
