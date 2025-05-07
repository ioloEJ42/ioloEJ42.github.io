// DND Character Sheet - Script to handle loading/saving JSON character data
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components and listeners
  initApp();
});

function initApp() {
  // DOM Elements - Initial Screen
  const characterSelectScreen = document.getElementById('character-select-screen');
  const loadCharacterBtn = document.getElementById('load-character-btn');
  const newCharacterBtn = document.getElementById('new-character-btn');
  const characterFileInput = document.getElementById('character-file-input');

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

  // Add event listeners for the initial screen
  if (loadCharacterBtn) {
    loadCharacterBtn.addEventListener('click', () => characterFileInput.click());
  }
  
  if (newCharacterBtn) {
    newCharacterBtn.addEventListener('click', createNewCharacter);
  }
  
  if (characterFileInput) {
    characterFileInput.addEventListener('change', handleFileUpload);
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
    uploadImageInput.addEventListener('change', handleImageUpload);
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

  // Show new character sheet
  function createNewCharacter() {
    // Reset all form fields to create a new character
    const allInputs = document.querySelectorAll('input:not([type="file"]), textarea');
    allInputs.forEach(input => {
      input.value = '';
      if (input.type === 'checkbox') {
        input.checked = false;
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
    }
    
    // Show character sheet
    currentCharacter = null;
    unsavedChanges = false;
    showCharacterSheet();
  }

  // Handle JSON file upload
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const characterData = JSON.parse(e.target.result);
        loadCharacterData(characterData);
        showCharacterSheet();
      } catch (error) {
        alert('Error loading character file: ' + error.message);
        console.error('Error parsing JSON:', error);
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input so the same file can be loaded again if needed
    event.target.value = '';
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
    
    // Load saving throws
    if (data.savingThrows) {
      const savingThrows = document.querySelectorAll('.save');
      const savingThrowData = [
        { key: 'strength', check: data.savingThrows.strength?.proficient || false, value: data.savingThrows.strength?.value },
        { key: 'dexterity', check: data.savingThrows.dexterity?.proficient || false, value: data.savingThrows.dexterity?.value },
        { key: 'constitution', check: data.savingThrows.constitution?.proficient || false, value: data.savingThrows.constitution?.value },
        { key: 'intelligence', check: data.savingThrows.intelligence?.proficient || false, value: data.savingThrows.intelligence?.value },
        { key: 'wisdom', check: data.savingThrows.wisdom?.proficient || false, value: data.savingThrows.wisdom?.value },
        { key: 'charisma', check: data.savingThrows.charisma?.proficient || false, value: data.savingThrows.charisma?.value }
      ];
      
      savingThrows.forEach((save, index) => {
        if (index < savingThrowData.length) {
          const checkbox = save.querySelector('.proficiency-check');
          const input = save.querySelector('.save-value');
          
          if (checkbox) checkbox.checked = savingThrowData[index].check;
          if (input) input.value = savingThrowData[index].value || '';
        }
      });
    }
    
    // Load skills
    if (data.skills) {
      const skills = document.querySelectorAll('.skill');
      const skillData = [
        { key: 'acrobatics', check: data.skills.acrobatics?.proficient || false, value: data.skills.acrobatics?.value },
        { key: 'animalHandling', check: data.skills.animalHandling?.proficient || false, value: data.skills.animalHandling?.value },
        { key: 'arcana', check: data.skills.arcana?.proficient || false, value: data.skills.arcana?.value },
        { key: 'athletics', check: data.skills.athletics?.proficient || false, value: data.skills.athletics?.value },
        { key: 'deception', check: data.skills.deception?.proficient || false, value: data.skills.deception?.value },
        { key: 'history', check: data.skills.history?.proficient || false, value: data.skills.history?.value },
        { key: 'insight', check: data.skills.insight?.proficient || false, value: data.skills.insight?.value },
        { key: 'intimidation', check: data.skills.intimidation?.proficient || false, value: data.skills.intimidation?.value },
        { key: 'investigation', check: data.skills.investigation?.proficient || false, value: data.skills.investigation?.value },
        { key: 'medicine', check: data.skills.medicine?.proficient || false, value: data.skills.medicine?.value },
        { key: 'nature', check: data.skills.nature?.proficient || false, value: data.skills.nature?.value },
        { key: 'perception', check: data.skills.perception?.proficient || false, value: data.skills.perception?.value },
        { key: 'performance', check: data.skills.performance?.proficient || false, value: data.skills.performance?.value },
        { key: 'persuasion', check: data.skills.persuasion?.proficient || false, value: data.skills.persuasion?.value },
        { key: 'religion', check: data.skills.religion?.proficient || false, value: data.skills.religion?.value },
        { key: 'sleightOfHand', check: data.skills.sleightOfHand?.proficient || false, value: data.skills.sleightOfHand?.value },
        { key: 'stealth', check: data.skills.stealth?.proficient || false, value: data.skills.stealth?.value },
        { key: 'survival', check: data.skills.survival?.proficient || false, value: data.skills.survival?.value }
      ];
      
      skills.forEach((skill, index) => {
        if (index < skillData.length) {
          const checkbox = skill.querySelector('.proficiency-check');
          const input = skill.querySelector('.skill-value');
          
          if (checkbox) checkbox.checked = skillData[index].check;
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
    setTextareaValue('features', data.features);
    setTextareaValue('inventory', data.inventory);
    
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
    setTextareaValue('cantrips', data.spells?.cantrips);
    for (let i = 1; i <= 9; i++) {
      setTextareaValue(`level-${i}-spells`, data.spells?.[`level${i}`]);
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
    
    setTextareaValue('appearance-notes', data.appearance);
    setTextareaValue('background-content', data.personalBackground);
    setTextareaValue('personality-traits', data.personalityTraits);
    setTextareaValue('ideals', data.ideals);
    setTextareaValue('bonds', data.bonds);
    setTextareaValue('flaws', data.flaws);
    
    // Set theme if available
    if (data.theme && themeSelect) {
      themeSelect.value = data.theme;
      applyTheme();
    }
  }

  // Helper functions for loading data into form fields
  function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      element.value = value;
    }
  }

  function setTextareaValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      element.value = value;
    }
  }

  function setSelectValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
      element.value = value;
    }
  }

  // Save character data to JSON file
  function saveCharacterData() {
    const characterData = collectCharacterData();
    const characterName = characterData.name || 'character';
    const filename = `${characterName.replace(/\s+/g, '_').toLowerCase()}.json`;
    
    const jsonString = JSON.stringify(characterData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create download link
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    
    // Clean up
    URL.revokeObjectURL(a.href);
    
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
      
      features: getTextareaValue('features'),
      inventory: getTextareaValue('inventory'),
      
      spellcasting: {
        class: getInputValue('spellcasting-class'),
        ability: document.getElementById('spellcasting-ability')?.value,
        saveDC: getInputValue('spell-save-dc'),
        attackBonus: getInputValue('spell-attack-bonus'),
        slots: getSpellSlotsData()
      },
      
      spells: {
        cantrips: getTextareaValue('cantrips'),
        level1: getTextareaValue('level-1-spells'),
        level2: getTextareaValue('level-2-spells'),
        level3: getTextareaValue('level-3-spells'),
        level4: getTextareaValue('level-4-spells'),
        level5: getTextareaValue('level-5-spells'),
        level6: getTextareaValue('level-6-spells'),
        level7: getTextareaValue('level-7-spells'),
        level8: getTextareaValue('level-8-spells'),
        level9: getTextareaValue('level-9-spells')
      },
      
      portrait: characterPortrait && characterPortrait.style.display !== 'none' ? characterPortrait.src : null,
      appearance: getTextareaValue('appearance-notes'),
      personalBackground: getTextareaValue('background-content'),
      personalityTraits: getTextareaValue('personality-traits'),
      ideals: getTextareaValue('ideals'),
      bonds: getTextareaValue('bonds'),
      flaws: getTextareaValue('flaws')
    };
    
    return data;
  }

  // Helper functions for collecting data
  function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
  }

  function getTextareaValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
  }

  function getSavingThrowsData() {
    const savingThrows = document.querySelectorAll('.save');
    const data = {};
    
    const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    savingThrows.forEach((save, index) => {
      if (index < abilityNames.length) {
        const checkbox = save.querySelector('.proficiency-check');
        const input = save.querySelector('.save-value');
        
        data[abilityNames[index]] = {
          proficient: checkbox ? checkbox.checked : false,
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
        
        data[skillNames[index]] = {
          proficient: checkbox ? checkbox.checked : false,
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
    }
  }

  function switchTab(tabId) {
    // Hide all tab contents
    tabContents.forEach(content => {
      content.classList.remove('active');
    });
    
    // Show the selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }
    
    // Update active tab button
    tabButtons.forEach(button => {
      if (button.dataset.tab === tabId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  function applyTheme() {
    if (!themeSelect) return;
    
    const theme = themeSelect.value;
    
    // Remove all theme classes
    document.body.classList.remove(
      'dark-theme', 'parchment-theme', 'wizard-theme', 'barbarian-theme',
      'bard-theme', 'cleric-theme', 'druid-theme', 'fighter-theme',
      'monk-theme', 'paladin-theme', 'ranger-theme', 'rogue-theme',
      'sorcerer-theme', 'warlock-theme', 'artificer-theme', 'bloodhunter-theme',
      'cyberpunk-theme', 'ethereal-theme', 'infernal-theme', 'nature-theme',
      'vampire-theme', 'desert-theme', 'winter-theme', 'halloween-theme',
      'celestial-theme', 'retro-theme', 'pirate-theme'
    );
    
    // Add the selected theme class
    if (theme !== 'light') {
      document.body.classList.add(`${theme}-theme`);
    }
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file || !characterPortrait || !imagePlaceholder) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      characterPortrait.src = e.target.result;
      characterPortrait.style.display = 'block';
      imagePlaceholder.style.display = 'none';
      unsavedChanges = true;
    };
    
    reader.readAsDataURL(file);
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
      if (percentage <= 25) {
        hpBar.style.backgroundColor = '#f44336'; // Red for low HP
      } else if (percentage <= 50) {
        hpBar.style.backgroundColor = '#ff9800'; // Orange for medium HP
      } else {
        hpBar.style.backgroundColor = ''; // Default color for high HP
      }
    }
  }

  function addWeaponRow(weaponData = null) {
    const weaponTable = document.getElementById('weapons-table');
    if (!weaponTable) return;
    
    const tbody = weaponTable.querySelector('tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
      <td><input type="text" class="weapon-name" value="${weaponData?.name || ''}"></td>
      <td><input type="text" class="weapon-bonus" value="${weaponData?.attackBonus || ''}"></td>
      <td><input type="text" class="weapon-damage" value="${weaponData?.damage || ''}"></td>
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
}
