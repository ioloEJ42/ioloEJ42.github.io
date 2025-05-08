// DND Character Sheet - Script to handle loading/saving JSON character data
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components and listeners
  initApp();
  initQoLFeatures();
  
  // Initialize medieval theme
  loadTheme();
  
  // Show the character selection screen initially
  showCharacterSelect();
});

function initApp() {
  // DOM Elements - Initial Screen
  const characterSelectScreen = document.getElementById('character-select-screen');
  const loadCharacterBtn = document.getElementById('load-character-btn');
  const newCharacterBtn = document.getElementById('new-character-btn');
  const characterFileInput = document.getElementById('character-file-input');
  const jsonFileInput = document.getElementById('json-file-input');
  const imageFileInput = document.getElementById('image-file-input');
  const loadJsonBtn = document.getElementById('load-json-btn');
  const loadImageBtn = document.getElementById('load-image-btn');
  const loadFolderBtn = document.getElementById('load-folder-btn');
  const uploadError = document.getElementById('upload-error');
  const uploadSuccess = document.getElementById('upload-success');

  // DOM Elements - Character Sheet
  const characterSheet = document.getElementById('character-sheet');
  const backBtn = document.getElementById('back-btn');
  const saveCharacterBtn = document.getElementById('save-character-btn');
  const themeSelect = document.getElementById('theme-select');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  // Character image upload
  const uploadImageInput = document.getElementById('upload-image');
  const imagePlaceholder = document.getElementById('image-placeholder');
  const characterPortrait = document.getElementById('character-portrait');

  // Current character data
  let currentCharacter = null;
  let unsavedChanges = false;
  let characterImageFile = null;
  
  // Maximum allowed image file size (5MB)
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  // Add event listeners for the initial screen
  if (loadCharacterBtn) {
    // Show dropdown when load character button is clicked
    loadCharacterBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent document click from immediately closing the dropdown
      
      const uploadDropdown = document.getElementById('upload-dropdown');
      if (uploadDropdown) {
        // Toggle dropdown visibility
        const isVisible = uploadDropdown.style.display === 'block';
        
        if (isVisible) {
          uploadDropdown.style.display = 'none';
        } else {
          // Calculate position below the load button
          const btnRect = loadCharacterBtn.getBoundingClientRect();
          const containerRect = document.querySelector('.select-container').getBoundingClientRect();
          
          uploadDropdown.style.position = 'absolute';
          uploadDropdown.style.top = (btnRect.bottom - containerRect.top + 10) + 'px';
          uploadDropdown.style.left = (btnRect.left - containerRect.left + btnRect.width/2 - 100) + 'px';
          uploadDropdown.style.display = 'block';
          
          // Add click handlers for dropdown buttons
          const loadJsonBtn = document.getElementById('load-json-btn');
          const loadImageBtn = document.getElementById('load-image-btn');
          const loadFolderBtn = document.getElementById('load-folder-btn');
          
          if (loadJsonBtn) {
            loadJsonBtn.onclick = function(e) {
              e.stopPropagation();
              jsonFileInput.click();
              uploadDropdown.style.display = 'none';
            };
          }
          
          if (loadImageBtn) {
            loadImageBtn.onclick = function(e) {
              e.stopPropagation();
              imageFileInput.click();
              uploadDropdown.style.display = 'none';
            };
          }
          
          if (loadFolderBtn) {
            loadFolderBtn.onclick = function(e) {
              e.stopPropagation();
              characterFileInput.click();
              uploadDropdown.style.display = 'none';
            };
          }
          
          // Close dropdown when clicking elsewhere
          document.addEventListener('click', function closeDropdown(e) {
            if (!uploadDropdown.contains(e.target) && e.target !== loadCharacterBtn) {
              uploadDropdown.style.display = 'none';
              document.removeEventListener('click', closeDropdown);
            }
          });
        }
      }
    });
  }
  
  if (newCharacterBtn) {
    newCharacterBtn.addEventListener('click', createNewCharacter);
  }
  
  if (characterFileInput) {
    characterFileInput.addEventListener('change', handleFolderUpload);
  }
  
  if (jsonFileInput) {
    jsonFileInput.addEventListener('change', handleJsonUpload);
  }
  
  if (imageFileInput) {
    imageFileInput.addEventListener('change', handleImageUpload);
  }
  
  // Add event listeners for the character sheet
  if (backBtn) {
    backBtn.addEventListener('click', goBackToSelectScreen);
  }
  
  if (saveCharacterBtn) {
    saveCharacterBtn.addEventListener('click', saveCharacterData);
  }
  
  if (themeSelect) {
    themeSelect.addEventListener('change', applyTheme);
    
    // Set default theme
    applyTheme();
  }
  
  // Add event listeners for tab navigation
  tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
  
  // Add event listener for character image upload
  if (uploadImageInput && imagePlaceholder) {
    uploadImageInput.addEventListener('change', handleProfileImageUpload);
    imagePlaceholder.addEventListener('click', () => uploadImageInput.click());
  }
  
  // Add event listeners for HP bar visualization
  const currentHpInput = document.getElementById('current-hp');
  const maxHpInput = document.getElementById('max-hp');
  
  if (currentHpInput && maxHpInput) {
    currentHpInput.addEventListener('input', updateHpBar);
    maxHpInput.addEventListener('input', updateHpBar);
  }
  
  // Add weapon button
  const addWeaponBtn = document.getElementById('add-weapon');
  if (addWeaponBtn) {
    addWeaponBtn.addEventListener('click', () => addWeaponRow());
  }
  
  // Track changes in all input fields, textareas, and checkboxes
  const allInputs = document.querySelectorAll('input, textarea, select');
  allInputs.forEach(input => {
    input.addEventListener('change', () => {
      unsavedChanges = true;
    });
  });
  
  // Handle JSON file upload (single file)
  function handleJsonUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset error and success messages
    resetMessages();
    
    if (!file.name.toLowerCase().endsWith('.json')) {
      showUploadError("The selected file is not a JSON file.");
      return;
    }
    
    // Check file size - limit to 10MB for JSON
    if (file.size > 10 * 1024 * 1024) {
      showUploadError("JSON file too large. Maximum size is 10MB.");
      return;
    }
    
    // Load the JSON file
    loadJsonOnly(file);
    
    // Reset the file input
    event.target.value = '';
  }
  
  // Handle image file upload (single file)
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset error and success messages
    resetMessages();
    
    if (!file.type.startsWith('image/')) {
      showUploadError("The selected file is not an image.");
      return;
    }
    
    // Check image file size
    if (file.size > MAX_IMAGE_SIZE) {
      showUploadError(`Image file too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`);
      return;
    }
    
    // Create new character with the image
    createNewCharacterWithImage(file);
    
    // Reset the file input
    event.target.value = '';
  }
  
  // Function to handle profile image upload (when already in character sheet)
  function handleProfileImageUpload(event) {
    const file = event.target.files[0];
    if (!file || !characterPortrait || !imagePlaceholder) return;
    
    // Check image file size
    if (file.size > MAX_IMAGE_SIZE) {
      showUploadError(`Image file too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`);
      return;
    }
    
    const reader = new FileReader();

    reader.onload = function(e) {
      characterPortrait.src = e.target.result;
      characterPortrait.style.display = 'block';
      imagePlaceholder.style.display = 'none';
      unsavedChanges = true;
    };
    
    reader.onerror = function() {
      showUploadError("Error reading image file.");
    };
    
    reader.readAsDataURL(file);
  }
  
  // Function to reset error and success messages
  function resetMessages() {
    if (uploadError) {
      uploadError.style.display = 'none';
      uploadError.textContent = '';
    }
    
    if (uploadSuccess) {
      uploadSuccess.style.display = 'none';
      uploadSuccess.textContent = '';
    }
  }

  // Show new character sheet
  function createNewCharacter() {
    // Reset all form fields to create a new character
    const allInputs = document.querySelectorAll('input:not([type="file"]), textarea');
    allInputs.forEach(input => {
      input.value = '';
      if (input.type === 'checkbox') {
        input.checked = false;
        
        // Reset proficiency states and tooltips
        if (input.classList.contains('proficiency-check')) {
          input.setAttribute('data-state', 'none');
          updateProficiencyTooltip(input, 'Not Proficient');
        }
      }
    });
    
    // Reset character image
    if (characterPortrait && imagePlaceholder) {
      characterPortrait.style.display = 'none';
      imagePlaceholder.style.display = 'flex';
    }
    
    // Reset HP bar
    const hpBar = document.getElementById('hp-bar');
    if (hpBar) {
      hpBar.style.width = '100%';
      // Reset HP color classes
      hpBar.classList.remove('low', 'medium');
      hpBar.classList.add('high');
    }
    
    // Show character sheet
    currentCharacter = null;
    unsavedChanges = false;
    showCharacterSheet();
    
    // Reinitialize all QoL features to ensure proper functionality
    initQoLFeatures();
  }

  // Function to handle folder upload
  function handleFolderUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Reset error and success messages
    resetMessages();
    
    // Check for unsupported or dangerous file types
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check for potentially dangerous file types
      if (file.name.endsWith('.exe') || file.name.endsWith('.bat') || 
          file.name.endsWith('.sh') || file.name.endsWith('.php')) {
        showUploadError("Potentially dangerous file detected. Only JSON and image files are allowed.");
        event.target.value = ''; // Clear the file input
        return;
      }
    }
    
    // Check files in the folder
    let jsonFiles = [];
    let imageFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.toLowerCase().endsWith('.json')) {
        // Check JSON file size
        if (file.size > 10 * 1024 * 1024) {
          showUploadError("JSON file too large. Maximum size is 10MB.");
          event.target.value = '';
          return;
        }
        jsonFiles.push(file);
      } else if (file.type.startsWith('image/')) {
        // Check image file size
        if (file.size > MAX_IMAGE_SIZE) {
          showUploadError(`Image file too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`);
          event.target.value = '';
          return;
        }
        imageFiles.push(file);
      }
    }
    
    // Handle case where multiple JSON files exist
    if (jsonFiles.length > 1) {
      showUploadError("Multiple JSON files found. Please upload a folder with only one character JSON file.");
      event.target.value = '';
      return;
    }
    
    // Handle case where multiple image files exist
    if (imageFiles.length > 1) {
      showUploadError("Multiple image files found. Please upload a folder with only one character image.");
      event.target.value = '';
      return;
    }
    
    // Case 1: No files found at all
    if (jsonFiles.length === 0 && imageFiles.length === 0) {
      showUploadError("No character data or image found in the folder.");
      event.target.value = '';
      return;
    }
    
    // Case 2: Only JSON file exists
    if (jsonFiles.length === 1 && imageFiles.length === 0) {
      const jsonFile = jsonFiles[0];
      loadJsonOnly(jsonFile);
    }
    // Case 3: Only image file exists
    else if (jsonFiles.length === 0 && imageFiles.length === 1) {
      const imageFile = imageFiles[0];
      createNewCharacterWithImage(imageFile);
    }
    // Case 4: Both JSON and image exist
    else {
      const jsonFile = jsonFiles[0];
      const imageFile = imageFiles[0];
      loadJsonWithImage(jsonFile, imageFile);
    }
    
    // Reset the file input so the same folder can be loaded again if needed
    event.target.value = '';
  }
  
  // Function to show upload error
  function showUploadError(message) {
    if (uploadError) {
      uploadError.textContent = message;
      uploadError.style.display = 'block';
      uploadError.setAttribute('role', 'alert'); // Accessibility improvement
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        uploadError.style.display = 'none';
        uploadError.removeAttribute('role');
      }, 5000);
    } else {
      alert(message);
    }
  }

  // Function to show upload success
  function showUploadSuccess(message) {
    if (uploadSuccess) {
      uploadSuccess.textContent = message;
      uploadSuccess.style.display = 'block';
      uploadSuccess.setAttribute('role', 'status'); // Accessibility improvement
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        uploadSuccess.style.display = 'none';
        uploadSuccess.removeAttribute('role');
      }, 3000);
    }
  }

  // Function to load only a JSON file
  function loadJsonOnly(jsonFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const characterData = JSON.parse(e.target.result);
        
        // Validate character data
        const validationResult = validateCharacterData(characterData);
        if (!validationResult.valid) {
          showUploadError("Invalid character data: " + validationResult.message);
          return;
        }
        
        loadCharacterData(characterData);
        showCharacterSheet();
        // Reinitialize QoL features for the loaded character
        initQoLFeatures();
        showUploadSuccess("Character data loaded successfully (no image found).");
      } catch (error) {
        showUploadError("Error loading character file: " + error.message);
        console.error('Error parsing JSON:', error);
      }
    };
    reader.onerror = function() {
      showUploadError("Error reading JSON file.");
    };
    reader.readAsText(jsonFile);
  }

  // Function to validate character data
  function validateCharacterData(data) {
    // Check for basic required fields
    if (!data) {
      return { valid: false, message: "Empty character data" };
    }
    
    // Check that certain fields exist and are in the right format
    if (!data.name) {
      return { valid: false, message: "Missing character name" };
    }
    
    // Make sure abilities are in the right format if they exist
    if (data.abilities) {
      const requiredAbilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
      for (const ability of requiredAbilities) {
        if (data.abilities[ability] && 
            (typeof data.abilities[ability] !== 'object' || 
             data.abilities[ability] === null)) {
          return { valid: false, message: `Invalid format for ${ability} ability` };
        }
      }
    }
    
    // Check HP format if it exists
    if (data.combat && data.combat.hp) {
      if (typeof data.combat.hp !== 'object' || data.combat.hp === null) {
        return { valid: false, message: "Invalid format for HP data" };
      }
    }
    
    // If we get here, the character data is valid enough to load
    return { valid: true };
  }

  // Function to create a new character with just an image
  function createNewCharacterWithImage(imageFile) {
    // Create a new blank character
    createNewCharacter();
    
    // Then load the image
    const imageReader = new FileReader();
    imageReader.onload = function(imgEvent) {
      if (characterPortrait && imagePlaceholder) {
        characterPortrait.src = imgEvent.target.result;
        characterPortrait.style.display = 'block';
        imagePlaceholder.style.display = 'none';
        showUploadSuccess("Character image loaded successfully (new character created).");
      }
    };
    imageReader.onerror = function() {
      showUploadError("Error reading image file.");
    };
    imageReader.readAsDataURL(imageFile);
  }

  // Function to load JSON with image
  function loadJsonWithImage(jsonFile, imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const characterData = JSON.parse(e.target.result);
        
        // Validate character data
        const validationResult = validateCharacterData(characterData);
        if (!validationResult.valid) {
          showUploadError("Invalid character data: " + validationResult.message);
          return;
        }
        
        // Load character data first
        loadCharacterData(characterData);
        
        // Then load the character image
        const imgReader = new FileReader();
        imgReader.onload = function(imgEvent) {
          if (characterPortrait && imagePlaceholder) {
            // Show the character portrait and hide placeholder
            characterPortrait.src = imgEvent.target.result;
            characterPortrait.style.display = 'block';
            imagePlaceholder.style.display = 'none';
          }
          
          showCharacterSheet();
          // Reinitialize QoL features for the loaded character
          initQoLFeatures();
          showUploadSuccess("Character loaded successfully with image.");
        };
        imgReader.onerror = function() {
          showUploadError("Error reading image file.");
          // Still load the character data even if image fails
          showCharacterSheet();
          // Reinitialize QoL features for the loaded character
          initQoLFeatures();
        };
        imgReader.readAsDataURL(imageFile);
      } catch (error) {
        showUploadError("Error loading character file: " + error.message);
        console.error('Error parsing JSON:', error);
      }
    };
    reader.onerror = function() {
      showUploadError("Error reading JSON file.");
    };
    reader.readAsText(jsonFile);
  }

  // Load character data into the form
  function loadCharacterData(data) {
    currentCharacter = data;
    unsavedChanges = false;
    
    // Load basic character info
    setInputValue('character-name', data.name);
    setInputValue('character-class', data.class);
    setInputValue('character-race', data.race);
    setInputValue('character-background', data.background);
    
    // Load ability scores
    setInputValue('str-score', data.abilities?.strength?.score);
    setInputValue('str-mod', data.abilities?.strength?.modifier);
    setInputValue('dex-score', data.abilities?.dexterity?.score);
    setInputValue('dex-mod', data.abilities?.dexterity?.modifier);
    setInputValue('con-score', data.abilities?.constitution?.score);
    setInputValue('con-mod', data.abilities?.constitution?.modifier);
    setInputValue('int-score', data.abilities?.intelligence?.score);
    setInputValue('int-mod', data.abilities?.intelligence?.modifier);
    setInputValue('wis-score', data.abilities?.wisdom?.score);
    setInputValue('wis-mod', data.abilities?.wisdom?.modifier);
    setInputValue('cha-score', data.abilities?.charisma?.score);
    setInputValue('cha-mod', data.abilities?.charisma?.modifier);
    
    // Load combat stats
    setInputValue('armor-class', data.combat?.armorClass);
    setInputValue('initiative', data.combat?.initiative);
    setInputValue('speed', data.combat?.speed);
    setInputValue('current-hp', data.combat?.hp?.current);
    setInputValue('max-hp', data.combat?.hp?.max);
    setInputValue('hit-dice', data.combat?.hitDice);
    
    // Update HP bar
    updateHpBar();
    
    // Load saving throws with new proficiency states
    if (data.savingThrows) {
      const savingThrows = document.querySelectorAll('.save');
      const savingThrowData = [
        { 
          key: 'strength', 
          proficiencyState: data.savingThrows.strength?.proficiencyState || 'none',
          value: data.savingThrows.strength?.value 
        },
        { 
          key: 'dexterity', 
          proficiencyState: data.savingThrows.dexterity?.proficiencyState || 'none',
          value: data.savingThrows.dexterity?.value 
        },
        { 
          key: 'constitution', 
          proficiencyState: data.savingThrows.constitution?.proficiencyState || 'none',
          value: data.savingThrows.constitution?.value 
        },
        { 
          key: 'intelligence', 
          proficiencyState: data.savingThrows.intelligence?.proficiencyState || 'none',
          value: data.savingThrows.intelligence?.value 
        },
        { 
          key: 'wisdom', 
          proficiencyState: data.savingThrows.wisdom?.proficiencyState || 'none',
          value: data.savingThrows.wisdom?.value 
        },
        { 
          key: 'charisma', 
          proficiencyState: data.savingThrows.charisma?.proficiencyState || 'none',
          value: data.savingThrows.charisma?.value 
        }
      ];
      
      savingThrows.forEach((save, index) => {
        if (index < savingThrowData.length) {
          const checkbox = save.querySelector('.proficiency-check');
          const input = save.querySelector('.save-value');
          
          if (checkbox) {
            // Handle legacy data format (backward compatibility)
            if (data.savingThrows[savingThrowData[index].key]?.proficient === true) {
              checkbox.setAttribute('data-state', 'proficient');
              checkbox.checked = true; // Update checkbox checked property
            } 
            // Handle new proficiency state format
            else if (savingThrowData[index].proficiencyState) {
              checkbox.setAttribute('data-state', savingThrowData[index].proficiencyState);
              // Update checkbox checked property based on state
              checkbox.checked = (savingThrowData[index].proficiencyState === 'proficient' || 
                                   savingThrowData[index].proficiencyState === 'expertise');
            } else {
              checkbox.setAttribute('data-state', 'none');
              checkbox.checked = false; // Update checkbox checked property
            }
            
            // Update tooltip based on the state
            updateTooltipBasedOnState(checkbox);
          }
          
          if (input) input.value = savingThrowData[index].value || '';
        }
      });
    }
    
    // Load skills with new proficiency states
    if (data.skills) {
      const skills = document.querySelectorAll('.skill');
      const skillData = [
        { 
          key: 'acrobatics', 
          proficiencyState: data.skills.acrobatics?.proficiencyState || 'none',
          value: data.skills.acrobatics?.value 
        },
        { 
          key: 'animalHandling', 
          proficiencyState: data.skills.animalHandling?.proficiencyState || 'none',
          value: data.skills.animalHandling?.value 
        },
        { 
          key: 'arcana', 
          proficiencyState: data.skills.arcana?.proficiencyState || 'none',
          value: data.skills.arcana?.value 
        },
        { 
          key: 'athletics', 
          proficiencyState: data.skills.athletics?.proficiencyState || 'none',
          value: data.skills.athletics?.value 
        },
        { 
          key: 'deception', 
          proficiencyState: data.skills.deception?.proficiencyState || 'none',
          value: data.skills.deception?.value 
        },
        { 
          key: 'history', 
          proficiencyState: data.skills.history?.proficiencyState || 'none',
          value: data.skills.history?.value 
        },
        { 
          key: 'insight', 
          proficiencyState: data.skills.insight?.proficiencyState || 'none',
          value: data.skills.insight?.value 
        },
        { 
          key: 'intimidation', 
          proficiencyState: data.skills.intimidation?.proficiencyState || 'none',
          value: data.skills.intimidation?.value 
        },
        { 
          key: 'investigation', 
          proficiencyState: data.skills.investigation?.proficiencyState || 'none',
          value: data.skills.investigation?.value 
        },
        { 
          key: 'medicine', 
          proficiencyState: data.skills.medicine?.proficiencyState || 'none',
          value: data.skills.medicine?.value 
        },
        { 
          key: 'nature', 
          proficiencyState: data.skills.nature?.proficiencyState || 'none',
          value: data.skills.nature?.value 
        },
        { 
          key: 'perception', 
          proficiencyState: data.skills.perception?.proficiencyState || 'none',
          value: data.skills.perception?.value 
        },
        { 
          key: 'performance', 
          proficiencyState: data.skills.performance?.proficiencyState || 'none',
          value: data.skills.performance?.value 
        },
        { 
          key: 'persuasion', 
          proficiencyState: data.skills.persuasion?.proficiencyState || 'none',
          value: data.skills.persuasion?.value 
        },
        { 
          key: 'religion', 
          proficiencyState: data.skills.religion?.proficiencyState || 'none',
          value: data.skills.religion?.value 
        },
        { 
          key: 'sleightOfHand', 
          proficiencyState: data.skills.sleightOfHand?.proficiencyState || 'none',
          value: data.skills.sleightOfHand?.value 
        },
        { 
          key: 'stealth', 
          proficiencyState: data.skills.stealth?.proficiencyState || 'none',
          value: data.skills.stealth?.value 
        },
        { 
          key: 'survival', 
          proficiencyState: data.skills.survival?.proficiencyState || 'none',
          value: data.skills.survival?.value 
        }
      ];
      
      skills.forEach((skill, index) => {
        if (index < skillData.length) {
          const checkbox = skill.querySelector('.proficiency-check');
          const input = skill.querySelector('.skill-value');
          
          if (checkbox) {
            // Handle legacy data format (backward compatibility)
            if (data.skills[skillData[index].key]?.proficient === true) {
              checkbox.setAttribute('data-state', 'proficient');
              checkbox.checked = true; // Update checkbox checked property
            } 
            // Handle new proficiency state format
            else if (skillData[index].proficiencyState) {
              checkbox.setAttribute('data-state', skillData[index].proficiencyState);
              // Update checkbox checked property based on state
              checkbox.checked = (skillData[index].proficiencyState === 'proficient' || 
                                   skillData[index].proficiencyState === 'expertise');
            } else {
              checkbox.setAttribute('data-state', 'none');
              checkbox.checked = false; // Update checkbox checked property
            }
            
            // Update tooltip based on the state
            updateTooltipBasedOnState(checkbox);
          }
          
          if (input) input.value = skillData[index].value || '';
        }
      });
    }
    
    // Load weapons
    if (data.weapons && data.weapons.length > 0) {
      // Clear existing weapon rows except the first one
      const weaponTable = document.getElementById('weapons-table');
      if (weaponTable) {
        const tbody = weaponTable.querySelector('tbody');
        
        // Keep the first row
        const firstRow = tbody.querySelector('tr');
        tbody.innerHTML = '';
        tbody.appendChild(firstRow);
        
        // Add weapon rows from data
        data.weapons.forEach((weapon, index) => {
          if (index === 0) {
            // First row already exists
            const inputs = firstRow.querySelectorAll('input');
            inputs[0].value = weapon.name || '';
            inputs[1].value = weapon.attackBonus || '';
            inputs[2].value = weapon.damage || '';
          } else {
            addWeaponRow(weapon);
          }
        });
      }
    }
    
    // Load features and inventory
    setTextContent('features', data.features);
    setTextContent('inventory', data.inventory);
    
    // Load spellcasting info
    setInputValue('spellcasting-class', data.spellcasting?.class);
    setSelectValue('spellcasting-ability', data.spellcasting?.ability);
    setInputValue('spell-save-dc', data.spellcasting?.saveDC);
    setInputValue('spell-attack-bonus', data.spellcasting?.attackBonus);
    
    // Load spell slots
    for (let i = 1; i <= 9; i++) {
      setInputValue(`slots-used-${i}`, data.spellcasting?.slots?.[i]?.used);
      setInputValue(`slots-total-${i}`, data.spellcasting?.slots?.[i]?.total);
    }
    
    // Load spell lists
    setTextContent('cantrips', data.spells?.cantrips);
    for (let i = 1; i <= 9; i++) {
      setTextContent(`level-${i}-spells`, data.spells?.[`level${i}`]);
    }
    
    // Load personal info
    if (data.portrait && characterPortrait && imagePlaceholder) {
      characterPortrait.src = data.portrait;
      characterPortrait.style.display = 'block';
      imagePlaceholder.style.display = 'none';
    } else if (characterPortrait && imagePlaceholder) {
      characterPortrait.style.display = 'none';
      imagePlaceholder.style.display = 'flex';
    }
    
    setTextContent('appearance-notes', data.appearance);
    setTextContent('background-content', data.personalBackground);
    setTextContent('personality-traits', data.personalityTraits);
    setTextContent('ideals', data.ideals);
    setTextContent('bonds', data.bonds);
    setTextContent('flaws', data.flaws);
    
    // Set theme if available
    if (data.theme && themeSelect) {
      themeSelect.value = data.theme;
      applyTheme();
    }
    
    // Ensure rich text formatting is applied after loading
    setTimeout(() => {
      // Refresh the rich text editors in case the formatting wasn't applied
      if (window.richTextFormatting) {
        const allEditors = document.querySelectorAll('[contenteditable="true"]');
        allEditors.forEach(editor => {
          if (!editor.parentNode.classList.contains('rich-text-editor-container')) {
            window.richTextFormatting.apply(editor);
          }
        });
      }
      
      // Make sure we're on the right tab
      if (currentTab) {
        switchTab(currentTab);
      } else {
        switchTab('main');
      }
    }, 100);
  }

  // Helper functions for loading data into form fields
  function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      element.value = value;
    }
  }

  function setTextContent(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      if (element.isContentEditable) {
        // Set HTML content directly for contenteditable elements
        element.innerHTML = value;
      } else {
        element.value = value;
      }
    }
  }

  function setSelectValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      element.value = value;
    }
  }

  // Update saveCharacterData for folder download
  function saveCharacterData() {
    // Ensure rich text formatting is preserved before saving
    if (typeof ensureRichTextPreservation === 'function') {
      ensureRichTextPreservation();
    }
    
    const characterData = collectCharacterData();
    const characterName = characterData.name || 'character';
    const sanitizedName = sanitizeFileName(characterName);
    
    // Create a folder-like structure using JSZip
    createZip(characterData, sanitizedName);
  }
  
  // Function to sanitize file names
  function sanitizeFileName(fileName) {
    if (!fileName) return 'character';
    
    // Replace spaces with underscores
    let sanitized = fileName.replace(/\s+/g, '_');
    
    // Remove special characters that might cause issues in file systems
    sanitized = sanitized.replace(/[\\/:*?"<>|]/g, '');
    
    // Handle other special characters by converting to ASCII-friendly versions
    sanitized = sanitized.replace(/[àáâãäå]/g, 'a')
                        .replace(/[èéêë]/g, 'e')
                        .replace(/[ìíîï]/g, 'i')
                        .replace(/[òóôõö]/g, 'o')
                        .replace(/[ùúûü]/g, 'u')
                        .replace(/[ýÿ]/g, 'y')
                        .replace(/æ/g, 'ae')
                        .replace(/ç/g, 'c')
                        .replace(/ñ/g, 'n')
                        .replace(/[^\w\-\.]/g, '');
    
    // Convert to lowercase for consistency
    sanitized = sanitized.toLowerCase();
    
    // If the name ends up empty after sanitization, use a default
    if (!sanitized) {
      sanitized = 'character';
    }
    
    return sanitized;
  }
  
  // Function to create a zip file containing the character data and image
  function createZip(characterData, baseName) {
    // Check if JSZip is available
    if (typeof JSZip === 'undefined') {
      // Load JSZip dynamically if not available
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = function() {
        createZipWithLibrary(characterData, baseName);
      };
      document.head.appendChild(script);
    } else {
      createZipWithLibrary(characterData, baseName);
    }
  }
  
  // Function to create a zip with the JSZip library
  function createZipWithLibrary(characterData, baseName) {
    const zip = new JSZip();
    
    // Extract the portrait image if present
    const portraitData = characterData.portrait;
    // Remove the large base64 image from the JSON data to avoid duplication
    delete characterData.portrait;
    
    // Add the JSON file
    const jsonString = JSON.stringify(characterData, null, 2);
    zip.file(`${baseName}.json`, jsonString);
    
    // Add the portrait image if available
    if (portraitData && portraitData.startsWith('data:image')) {
      // Extract base64 data
      const imageType = portraitData.split(';')[0].split(':')[1];
      const extension = imageType.split('/')[1];
      const base64Data = portraitData.split(',')[1];
      
      // Add image to zip
      zip.file(`${baseName}.${extension}`, base64Data, {base64: true});
    }
    
    // Generate the zip file
    zip.generateAsync({type: 'blob'}).then(function(content) {
      // Create download link
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `${baseName}.zip`;
      a.click();
      
      // Clean up
      URL.revokeObjectURL(a.href);
    });
    
    unsavedChanges = false;
  }

  // Collect character data from form fields
  function collectCharacterData() {
    const data = {
      name: getInputValue('character-name'),
      class: getInputValue('character-class'),
      race: getInputValue('character-race'),
      background: getInputValue('character-background'),
      theme: themeSelect ? themeSelect.value : 'light',
      
      abilities: {
        strength: {
          score: getInputValue('str-score'),
          modifier: getInputValue('str-mod')
        },
        dexterity: {
          score: getInputValue('dex-score'),
          modifier: getInputValue('dex-mod')
        },
        constitution: {
          score: getInputValue('con-score'),
          modifier: getInputValue('con-mod')
        },
        intelligence: {
          score: getInputValue('int-score'),
          modifier: getInputValue('int-mod')
        },
        wisdom: {
          score: getInputValue('wis-score'),
          modifier: getInputValue('wis-mod')
        },
        charisma: {
          score: getInputValue('cha-score'),
          modifier: getInputValue('cha-mod')
        }
      },
      
      combat: {
        armorClass: getInputValue('armor-class'),
        initiative: getInputValue('initiative'),
        speed: getInputValue('speed'),
        hp: {
          current: getInputValue('current-hp'),
          max: getInputValue('max-hp')
        },
        hitDice: getInputValue('hit-dice')
      },
      
      savingThrows: getSavingThrowsData(),
      skills: getSkillsData(),
      weapons: getWeaponsData(),
      
      features: getTextContent('features'),
      inventory: getTextContent('inventory'),
      
      spellcasting: {
        class: getInputValue('spellcasting-class'),
        ability: document.getElementById('spellcasting-ability')?.value,
        saveDC: getInputValue('spell-save-dc'),
        attackBonus: getInputValue('spell-attack-bonus'),
        slots: getSpellSlotsData()
      },
      
      spells: {
        cantrips: getTextContent('cantrips'),
        level1: getTextContent('level-1-spells'),
        level2: getTextContent('level-2-spells'),
        level3: getTextContent('level-3-spells'),
        level4: getTextContent('level-4-spells'),
        level5: getTextContent('level-5-spells'),
        level6: getTextContent('level-6-spells'),
        level7: getTextContent('level-7-spells'),
        level8: getTextContent('level-8-spells'),
        level9: getTextContent('level-9-spells')
      },
      
      portrait: characterPortrait && characterPortrait.style.display !== 'none' ? characterPortrait.src : null,
      appearance: getTextContent('appearance-notes'),
      personalBackground: getTextContent('background-content'),
      personalityTraits: getTextContent('personality-traits'),
      ideals: getTextContent('ideals'),
      bonds: getTextContent('bonds'),
      flaws: getTextContent('flaws')
    };
    
    return data;
  }

  // Helper functions for collecting data
  function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
  }

  function getTextContent(id) {
    const element = document.getElementById(id);
    if (!element) return '';
    
    if (element.isContentEditable) {
      // For all rich text contenteditable areas, preserve HTML formatting
      return element.innerHTML;
    } else {
      return element.value || '';
    }
  }

  function getSavingThrowsData() {
    const savingThrows = document.querySelectorAll('.save');
    const data = {};
    
    const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    savingThrows.forEach((save, index) => {
      if (index < abilityNames.length) {
        const checkbox = save.querySelector('.proficiency-check');
        const input = save.querySelector('.save-value');
        
        let proficiencyState = 'none';
        if (checkbox) {
          proficiencyState = checkbox.getAttribute('data-state') || 'none';
        }
        
        data[abilityNames[index]] = {
          proficiencyState: proficiencyState,
          value: input ? input.value : ''
        };
      }
    });
    
    return data;
  }

  function getSkillsData() {
    const skills = document.querySelectorAll('.skill');
    const data = {};
    
    const skillNames = [
      'acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception',
      'history', 'insight', 'intimidation', 'investigation', 'medicine',
      'nature', 'perception', 'performance', 'persuasion', 'religion',
      'sleightOfHand', 'stealth', 'survival'
    ];
    
    skills.forEach((skill, index) => {
      if (index < skillNames.length) {
        const checkbox = skill.querySelector('.proficiency-check');
        const input = skill.querySelector('.skill-value');
        
        let proficiencyState = 'none';
        if (checkbox) {
          proficiencyState = checkbox.getAttribute('data-state') || 'none';
        }
        
        data[skillNames[index]] = {
          proficiencyState: proficiencyState,
          value: input ? input.value : ''
        };
      }
    });
    
    return data;
  }

  function getWeaponsData() {
    const weaponRows = document.querySelectorAll('#weapons-table tbody tr');
    const weapons = [];
    
    weaponRows.forEach(row => {
      const inputs = row.querySelectorAll('input');
      if (inputs.length >= 3) {
        weapons.push({
          name: inputs[0].value,
          attackBonus: inputs[1].value,
          damage: inputs[2].value
        });
      }
    });
    
    return weapons;
  }

  function getSpellSlotsData() {
    const slots = {};
    
    for (let i = 1; i <= 9; i++) {
      slots[i] = {
        used: getInputValue(`slots-used-${i}`),
        total: getInputValue(`slots-total-${i}`)
      };
    }
    
    return slots;
  }

  // UI Functions
  function showCharacterSheet() {
    if (characterSelectScreen && characterSheet) {
      characterSelectScreen.style.display = 'none';
      characterSheet.style.display = 'block';
      
      // Ensure the first tab is active
      switchTab('main');
      
      // Accessibility improvements - set focus to first input
      const characterNameInput = document.getElementById('character-name');
      if (characterNameInput) {
        characterNameInput.focus();
      }
      
      // Ensure rich text formatting is correctly applied
      setupRichTextFormatting();
    }
  }

  function goBackToSelectScreen() {
    if (unsavedChanges) {
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to go back without saving?');
      if (!confirmLeave) {
        return;
      }
    }
    
    if (characterSheet && characterSelectScreen) {
      characterSheet.style.display = 'none';
      characterSelectScreen.style.display = 'flex';
      
      // Accessibility improvement - focus the new character button
      if (newCharacterBtn) {
        newCharacterBtn.focus();
      }
    }
  }

  // Add current tab tracking
  let currentTab = 'main';

  function switchTab(tabId) {
    // Update current tab tracking
    currentTab = tabId;
    
    // Hide all tab contents
    tabContents.forEach(content => {
      content.classList.remove('active');
      content.setAttribute('aria-hidden', 'true'); // Accessibility improvement
    });
    
    // Show the selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
      selectedTab.classList.add('active');
      selectedTab.setAttribute('aria-hidden', 'false'); // Accessibility improvement
    }
    
    // Update active tab button
    tabButtons.forEach(button => {
      if (button.dataset.tab === tabId) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true'); // Accessibility improvement
        button.setAttribute('tabindex', '0');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false'); // Accessibility improvement
        button.setAttribute('tabindex', '-1');
      }
    });
  }

  function applyTheme() {
    const themeSelect = document.getElementById('theme-select');
    const theme = themeSelect ? themeSelect.value : 'medieval';
    
    // Remove all theme classes
    document.body.classList.remove('light-theme', 'dark-theme', 'medieval-theme');
    
    // Add the selected theme class or default to medieval
    document.body.classList.add(theme + '-theme');
    
    // Save the theme preference to local storage
    localStorage.setItem('dnd-theme', theme);
  }

  function updateHpBar() {
    const currentHp = document.getElementById('current-hp');
    const maxHp = document.getElementById('max-hp');
    const hpBar = document.getElementById('hp-bar');
    
    if (currentHp && maxHp && hpBar) {
      const current = parseInt(currentHp.value) || 0;
      const max = parseInt(maxHp.value) || 1; // Avoid division by zero
      
      const percentage = Math.min(100, Math.max(0, (current / max) * 100));
      hpBar.style.width = `${percentage}%`;
      
      // Change color based on HP percentage
      hpBar.classList.remove('high', 'medium', 'low');
      if (percentage <= 25) {
        hpBar.classList.add('low');
        
        // Accessibility improvement - alert when HP is low
        if (percentage > 0) {
          hpBar.setAttribute('aria-label', 'Health critically low');
        } else {
          hpBar.setAttribute('aria-label', 'No health remaining');
        }
      } else if (percentage <= 50) {
        hpBar.classList.add('medium');
        hpBar.setAttribute('aria-label', 'Health below half');
      } else {
        hpBar.classList.add('high');
        hpBar.setAttribute('aria-label', 'Health is good');
      }
      
      // Set ARIA values for accessibility
      hpBar.setAttribute('role', 'progressbar');
      hpBar.setAttribute('aria-valuemin', '0');
      hpBar.setAttribute('aria-valuemax', max.toString());
      hpBar.setAttribute('aria-valuenow', current.toString());
      hpBar.setAttribute('aria-valuetext', `${current} out of ${max} hit points`);
    }
  }

  function addWeaponRow(weaponData = null) {
    const weaponTable = document.getElementById('weapons-table');
    if (!weaponTable) return;
    
    const tbody = weaponTable.querySelector('tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
      <td><input type="text" class="weapon-name" value="${weaponData?.name || ''}" aria-label="Weapon name"></td>
      <td><input type="text" class="weapon-bonus" value="${weaponData?.attackBonus || ''}" aria-label="Attack bonus"></td>
      <td><input type="text" class="weapon-damage" value="${weaponData?.damage || ''}" aria-label="Damage formula"></td>
    `;
    
    tbody.appendChild(newRow);
    
    // Add change listener to the new inputs
    const inputs = newRow.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        unsavedChanges = true;
      });
    });
    
    unsavedChanges = true;
    return newRow;
  }

  // Warn about unsaved changes when leaving the page
  window.addEventListener('beforeunload', (event) => {
    if (unsavedChanges) {
      const message = 'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = message;
      return message;
    }
  });

  // Fix by adding a compatibility function for setTextareaValue
  function setTextareaValue(id, value) {
    setTextContent(id, value);
  }

  // Add getHTMLContent for rich content preservation
  function getHTMLContent(id) {
    const element = document.getElementById(id);
    if (!element || !element.isContentEditable) return '';
    return element.innerHTML;
  }

  // QoL improvement - Add tabbing between inputs in ability scores
  function setupAbilityScoreTabbing() {
    const abilityScores = document.querySelectorAll('.ability-score');
    const abilityMods = document.querySelectorAll('.ability-modifier');
    
    // Automatically focus the next input when tabbing through ability scores
    abilityScores.forEach((score, index) => {
      score.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
          // Focus the corresponding modifier
          if (abilityMods[index]) {
            e.preventDefault();
            abilityMods[index].focus();
          }
        }
      });
    });
    
    // Auto-calculate modifiers based on scores
    abilityScores.forEach((score, index) => {
      score.addEventListener('input', () => {
        if (abilityMods[index]) {
          const scoreVal = parseInt(score.value) || 0;
          const modifier = Math.floor((scoreVal - 10) / 2);
          abilityMods[index].value = modifier >= 0 ? `+${modifier}` : modifier;
        }
      });
    });
  }

  // QoL improvement - Double click to clear an input field
  function setupDoubleClearInputs() {
    const allInputs = document.querySelectorAll('input[type="text"]');
    allInputs.forEach(input => {
      input.addEventListener('dblclick', () => {
        input.value = '';
        input.focus();
        // If it's a current HP input, update the HP bar
        if (input.id === 'current-hp') {
          updateHpBar();
        }
      });
    });
  }

  // QoL improvement - Rich text basic formatting
  function setupRichTextFormatting() {
    // Clear any existing rich-text-editor-containers first
    const existingContainers = document.querySelectorAll('.rich-text-editor-container');
    existingContainers.forEach(container => {
      const editor = container.querySelector('[contenteditable="true"]');
      if (editor) {
        // Move the editor outside the container to its original position
        container.parentNode.insertBefore(editor, container);
        container.remove();
      }
    });

    // Apply rich text editing to all contenteditable elements
    const richTextEditors = document.querySelectorAll('[contenteditable="true"]');
    
    if (window.richTextFormatting && window.richTextFormatting.apply) {
      richTextEditors.forEach(editor => {
        window.richTextFormatting.apply(editor);
      });
    } else {
      console.warn('Rich text formatting module not available');
    }
  }

  // Function to sanitize HTML for paste operations
  function sanitizeHTML(html) {
    // Create a temporary element
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove unwanted elements
    const unwantedElements = temp.querySelectorAll('script, style, link, meta');
    unwantedElements.forEach(el => el.remove());
    
    // Remove all attributes except some allowed ones
    const allElements = temp.querySelectorAll('*');
    const allowedAttributes = ['href', 'src', 'alt', 'title'];
    
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (!allowedAttributes.includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    // Return the cleaned HTML
    return temp.innerHTML;
  }

  // QoL improvement - Toggle sections visibility to save space
  function setupCollapsibleSections() {
    const sectionHeaders = document.querySelectorAll('.equipment-section h3, .spell-level-section h3');
    
    sectionHeaders.forEach(header => {
      header.style.cursor = 'pointer';
      
      // Add a small indicator
      const indicator = document.createElement('span');
      indicator.innerHTML = ' ▼';
      indicator.style.fontSize = '0.7em';
      header.appendChild(indicator);
      
      // Make headers focusable and keyboard accessible
      header.setAttribute('tabindex', '0');
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'true');
      
      const toggleSection = () => {
        const content = header.nextElementSibling;
        if (content) {
          if (content.style.display === 'none') {
            content.style.display = '';
            indicator.innerHTML = ' ▼';
            header.setAttribute('aria-expanded', 'true');
          } else {
            content.style.display = 'none';
            indicator.innerHTML = ' ►';
            header.setAttribute('aria-expanded', 'false');
          }
        }
      };
      
      // Support both click and keyboard activation
      header.addEventListener('click', toggleSection);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSection();
        }
      });
    });
  }
  
  // Add spell slot tracking warning
  function setupSpellSlotTracking() {
    const spellSlotUsedInputs = document.querySelectorAll('.slot-used');
    const spellSlotTotalInputs = document.querySelectorAll('.slot-total');
    
    spellSlotUsedInputs.forEach((input, index) => {
      input.addEventListener('change', () => {
        const totalInput = spellSlotTotalInputs[index];
        if (totalInput) {
          const used = parseInt(input.value) || 0;
          const total = parseInt(totalInput.value) || 0;
          
          if (used > total && total > 0) {
            showUploadError(`Warning: You've used more level ${index+1} spell slots than you have available.`);
          }
        }
      });
    });
  }

  // Function to set up three-state proficiency toggles
  function setupProficiencyExpertise() {
    const proficiencyChecks = document.querySelectorAll('.proficiency-check');
    
    proficiencyChecks.forEach(check => {
      // Initialize state attribute if not present
      if (!check.hasAttribute('data-state')) {
        check.setAttribute('data-state', 'none');
        check.checked = false; // Ensure it starts unchecked
      } else {
        // Make sure checkbox checked state matches data-state
        const state = check.getAttribute('data-state');
        check.checked = (state === 'proficient' || state === 'expertise');
      }
      
      // Initialize tooltips based on current state
      updateTooltipBasedOnState(check);
      
      // First, remove any existing click listeners to avoid duplicates
      check.removeEventListener('click', proficiencyClickHandler);
      
      // Add click handler for state cycling
      check.addEventListener('click', proficiencyClickHandler);
    });
  }
  
  // Separate the handler function for reuse and clarity
  function proficiencyClickHandler(e) {
    // Prevent default checkbox behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Get current state
    const currentState = this.getAttribute('data-state') || 'none';
    let nextState;
    
    // Determine next state in cycle: none -> proficient -> expertise -> none
    if (currentState === 'none') {
      nextState = 'proficient';
      this.checked = true; // Update checkbox state
    } else if (currentState === 'proficient') {
      nextState = 'expertise';
      this.checked = true; // Update checkbox state
    } else {
      nextState = 'none';
      this.checked = false; // Update checkbox state
    }
    
    // Set new state
    this.setAttribute('data-state', nextState);
    
    // Debug output to help diagnose issues
    console.log(`Proficiency state changed: ${currentState} -> ${nextState}, checkbox.checked: ${this.checked}`);
    
    // Update tooltip
    updateProficiencyTooltip(this, getTooltipForState(nextState));
    
    // Mark changes
    unsavedChanges = true;
    
    // Return false to prevent default checkbox behavior
    return false;
  }

  // Function to get tooltip text based on state
  function getTooltipForState(state) {
    switch (state) {
      case 'proficient':
        return 'Proficient';
      case 'expertise':
        return 'Expertise';
      default:
        return 'Not Proficient';
    }
  }

  // Function to update tooltip text
  function updateProficiencyTooltip(checkbox, text) {
    const tooltip = checkbox.nextElementSibling;
    if (tooltip && tooltip.classList.contains('skill-tooltip')) {
      tooltip.textContent = text;
    }
  }

  // Function to update tooltips based on current state
  function updateTooltipBasedOnState(checkbox) {
    if (!checkbox) return;
    
    const state = checkbox.getAttribute('data-state') || 'none';
    updateProficiencyTooltip(checkbox, getTooltipForState(state));
  }

  // Function to update all skill values - now a stub since the functionality is disabled
  function updateAllSkillValues() {
    // This function is intentionally disabled per user request
    // Skills should not auto-calculate based on proficiency state
    return;
  }
  
  // Function to update the skill modifier - now a stub since the functionality is disabled
  function updateSkillModifier(checkbox) {
    // This function is intentionally disabled per user request
    // Skills should not auto-calculate based on proficiency
    return;
  }

  // Initialize additional QoL features
  function initQoLFeatures() {
    setupAbilityScoreTabbing();
    setupDoubleClearInputs();
    setupRichTextFormatting();
    setupCollapsibleSections();
    setupSpellSlotTracking();
    setupProficiencyExpertise();
  }

  // Load theme preference from local storage
  function loadTheme() {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      // Get theme from local storage or default to medieval
      const savedTheme = localStorage.getItem('dnd-theme') || 'medieval';
      themeSelect.value = savedTheme;
      
      // Apply the theme
      applyTheme();
    }
  }

  // Add a global document click handler to close dropdowns
  document.addEventListener('click', function(e) {
    const uploadDropdown = document.getElementById('upload-dropdown');
    const loadCharacterBtn = document.getElementById('load-character-btn');
    
    // Close dropdown when clicking outside
    if (uploadDropdown && 
        uploadDropdown.style.display === 'block' && 
        !uploadDropdown.contains(e.target) && 
        (!loadCharacterBtn || !loadCharacterBtn.contains(e.target))) {
      uploadDropdown.style.display = 'none';
    }
  });
}