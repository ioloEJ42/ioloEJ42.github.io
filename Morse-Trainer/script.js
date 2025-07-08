// Morse Code Trainer
class MorseTrainer {
    constructor() {
        this.morseCode = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..'
        };
        
        this.morseNumbers = {
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
            '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
        };
        
        // Organize words by difficulty level
        this.wordsByLevel = {
            easy: [
                'HELLO', 'WORLD', 'MORSE', 'CODE', 'DOT', 'DASH', 'SOS', 'HELP',
                'SAVE', 'LIFE', 'STOP', 'GO', 'YES', 'NO', 'OKAY', 'FINE', 'GOOD',
                'BAD', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'FIRE', 'WATER', 'EARTH',
                'AIR', 'SUN', 'MOON', 'STAR', 'SKY', 'SEA', 'LAND', 'TREE', 'BIRD',
                'FISH', 'DOG', 'CAT', 'HORSE', 'COW', 'SHEEP', 'BOOK', 'PEN', 'MAP',
                'KEY', 'DOOR', 'WIND', 'RAIN', 'SNOW', 'HOT', 'COLD', 'WARM', 'COOL'
            ],
            medium: [
                'TRAINER', 'SIGNAL', 'MESSAGE', 'RADIO', 'TELEGRAPH', 'EMERGENCY',
                'RESCUE', 'DANGER', 'WARNING', 'NORTH', 'SOUTH', 'EAST', 'WEST',
                'FLOWER', 'BEAUTY', 'STRONG', 'WEAK', 'QUICK', 'SLOW', 'BIG', 'SMALL',
                'HAPPY', 'SAD', 'ANGRY', 'CALM', 'LOUD', 'QUIET', 'BRIGHT', 'DARK',
                'LIGHT', 'HEAVY', 'FAST', 'SLOW', 'NEW', 'OLD', 'YOUNG', 'RICH',
                'POOR', 'HIGH', 'LOW', 'NEAR', 'FAR', 'OPEN', 'CLOSE', 'START',
                'FINISH', 'BEGIN', 'END', 'FIRST', 'LAST', 'BEST', 'WORST'
            ],
            hard: [
                'COMMUNICATION', 'EMERGENCY', 'SITUATION', 'DEPARTMENT', 'ACCOMMODATIONS',
                'CONSTRUCTION', 'IMMEDIATELY', 'ASSISTANCE', 'REQUIRED', 'BUILDING',
                'HOSPITAL', 'RESTAURANT', 'STATION', 'NEARBY', 'AVAILABLE',
                'DIFFICULT', 'IMPORTANT', 'NECESSARY', 'POSSIBLE', 'DIFFERENT',
                'BEAUTIFUL', 'WONDERFUL', 'EXCELLENT', 'FANTASTIC', 'AMAZING',
                'INCREDIBLE', 'WONDERFUL', 'SPECTACULAR', 'MAGNIFICENT', 'EXTRAORDINARY',
                'REMARKABLE', 'OUTSTANDING', 'SUPERIOR', 'EXCEPTIONAL', 'PHENOMENAL',
                'TREMENDOUS', 'ENORMOUS', 'GIGANTIC', 'COLOSSAL', 'MASSIVE',
                'IMMENSE', 'VAST', 'HUGE', 'TREMENDOUS', 'FANTASTIC', 'INCREDIBLE'
            ]
        };
        
        // Organize sentences by difficulty level
        this.sentencesByLevel = {
            easy: [
                'HELLO WORLD',
                'GOOD MORNING',
                'GOOD NIGHT',
                'THANK YOU',
                'PLEASE HELP',
                'SAVE THE DAY',
                'CALL FOR HELP',
                'STOP NOW',
                'GO AHEAD',
                'YES PLEASE',
                'NO THANKS',
                'OKAY FINE',
                'UP THERE',
                'DOWN HERE',
                'LEFT SIDE',
                'RIGHT NOW',
                'FIRE ALARM',
                'WATER NEEDED',
                'SUN IS HOT',
                'MOON IS BRIGHT',
                'STAR LIGHT',
                'SKY IS BLUE',
                'SEA IS DEEP',
                'LAND IS GREEN',
                'TREE IS TALL',
                'BIRD CAN FLY',
                'FISH CAN SWIM',
                'DOG IS LOYAL',
                'CAT IS CLEAN',
                'HORSE IS FAST'
            ],
            medium: [
                'MORSE CODE TRAINER',
                'SOS EMERGENCY CALL',
                'HELP NEEDED NOW',
                'SAVE THE DAY',
                'YOU ARE WELCOME',
                'PLEASE HELP ME',
                'I NEED ASSISTANCE',
                'EMERGENCY SITUATION',
                'FIRE IN BUILDING',
                'MEDICAL EMERGENCY',
                'POLICE NEEDED NOW',
                'AMBULANCE REQUIRED',
                'FIRE DEPARTMENT CALL',
                'RESCUE TEAM NEEDED',
                'DANGER AHEAD STOP',
                'STOP IMMEDIATELY',
                'PROCEED WITH CAUTION',
                'ROAD CLOSED AHEAD',
                'CONSTRUCTION ZONE',
                'SCHOOL ZONE SLOW',
                'HOSPITAL AHEAD',
                'GAS STATION NEARBY',
                'RESTAURANT OPEN NOW',
                'HOTEL ACCOMMODATIONS',
                'PARKING AVAILABLE',
                'NO PARKING ZONE',
                'KEEP OUT AREA',
                'PRIVATE PROPERTY',
                'ENTRANCE ONLY',
                'EXIT THIS WAY'
            ],
            hard: [
                'EMERGENCY MEDICAL ASSISTANCE REQUIRED IMMEDIATELY',
                'FIRE DEPARTMENT RESPONSE NEEDED URGENTLY',
                'POLICE OFFICER BACKUP REQUESTED IMMEDIATELY',
                'AMBULANCE DISPATCH REQUIRED FOR MEDICAL EMERGENCY',
                'RESCUE TEAM DEPLOYMENT NECESSARY FOR CRITICAL SITUATION',
                'CONSTRUCTION ZONE AHEAD PROCEED WITH EXTREME CAUTION',
                'HOSPITAL EMERGENCY ROOM ACCESS AVAILABLE IMMEDIATELY',
                'RESTAURANT ACCOMMODATIONS AVAILABLE FOR LARGE GROUPS',
                'HOTEL RESERVATION CONFIRMATION REQUIRED IMMEDIATELY',
                'PARKING FACILITIES ACCESS RESTRICTED TO AUTHORIZED PERSONNEL',
                'PRIVATE PROPERTY ENTRANCE FORBIDDEN WITHOUT PERMISSION',
                'SCHOOL ZONE SPEED LIMIT ENFORCED DURING OPERATING HOURS',
                'GAS STATION FACILITIES AVAILABLE FOR PUBLIC USE',
                'EMERGENCY EXIT ROUTE CLEARANCE REQUIRED IMMEDIATELY',
                'SECURITY ALARM SYSTEM ACTIVATION IN PROGRESS',
                'WEATHER WARNING SYSTEM ALERT FOR SEVERE CONDITIONS',
                'TRAFFIC CONTROL SYSTEM MALFUNCTION DETECTED',
                'ELECTRICAL POWER SYSTEM RESTORATION IN PROGRESS',
                'WATER SUPPLY SYSTEM MAINTENANCE SCHEDULED',
                'COMMUNICATION NETWORK ACCESS RESTRICTED TEMPORARILY'
            ]
        };
        
        this.currentWord = '';
        this.currentMorse = '';
        this.lettersSidebarOpen = false;
        this.numbersSidebarOpen = false;
        this.settingsOpen = false;
        this.difficultyMode = 'singular'; // 'singular' or 'sentence'
        this.difficultyLevel = 'easy'; // 'easy', 'medium', 'hard'
        this.pendingDifficultyMode = 'singular';
        this.pendingDifficultyLevel = 'easy';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadNewWord();
    }
    
    bindEvents() {
        const morseInput = document.getElementById('morse-input');
        const newWordBtn = document.getElementById('new-word-btn');
        const themeToggle = document.getElementById('theme-toggle');
        const hintBtn = document.getElementById('hint-btn');
        const settingsBtn = document.getElementById('settings-btn');
        const saveSettingsBtn = document.getElementById('save-settings');
        const closeLettersBtn = document.getElementById('close-letters');
        const closeNumbersBtn = document.getElementById('close-numbers');
        const closeSettingsBtn = document.getElementById('close-settings');
        
        // Handle input with space key submission
        morseInput.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.checkAnswer();
            }
        });
        
        // Only allow . and - characters
        morseInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const filtered = value.replace(/[^.-]/g, '');
            if (value !== filtered) {
                e.target.value = filtered;
            }
        });
        
        newWordBtn.addEventListener('click', () => {
            this.loadNewWord();
        });
        
        // Theme toggle
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Hint button - opens both sidebars
        hintBtn.addEventListener('click', () => {
            this.toggleBothSidebars();
        });
        
        // Settings button
        settingsBtn.addEventListener('click', () => {
            this.toggleSettings();
        });
        
        // Save settings button
        saveSettingsBtn.addEventListener('click', () => {
            this.saveSettings();
        });
        
        // Close buttons
        closeLettersBtn.addEventListener('click', () => {
            this.closeLettersSidebar();
        });
        
        closeNumbersBtn.addEventListener('click', () => {
            this.closeNumbersSidebar();
        });
        
        closeSettingsBtn.addEventListener('click', () => {
            this.closeSettings();
        });
        
        // Difficulty mode radio buttons
        const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
        difficultyRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.pendingDifficultyMode = e.target.value;
            });
        });
        
        // Difficulty level radio buttons
        const levelRadios = document.querySelectorAll('input[name="level"]');
        levelRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.pendingDifficultyLevel = e.target.value;
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // H key to toggle both sidebars
            if (e.key.toLowerCase() === 'h' && !this.isInputFocused()) {
                e.preventDefault();
                this.toggleBothSidebars();
            }
            
            // S key to toggle settings
            if (e.key.toLowerCase() === 's' && !this.isInputFocused()) {
                e.preventDefault();
                this.toggleSettings();
            }
            
            // Enter key to save settings when settings is open
            if (e.key === 'Enter' && this.settingsOpen) {
                e.preventDefault();
                this.saveSettings();
            }
            
            // Escape key to close sidebars and settings
            if (e.key === 'Escape') {
                if (this.settingsOpen) {
                    this.closeSettings();
                } else if (this.lettersSidebarOpen || this.numbersSidebarOpen) {
                    this.closeBothSidebars();
                }
            }
        });
        
        // Focus input on page load
        morseInput.focus();
    }
    
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (activeElement.id === 'morse-input' || activeElement.tagName === 'INPUT');
    }
    
    openLettersSidebar() {
        this.lettersSidebarOpen = true;
        const lettersSidebar = document.getElementById('letters-sidebar');
        lettersSidebar.classList.add('open');
        this.populateLettersContent();
    }
    
    closeLettersSidebar() {
        this.lettersSidebarOpen = false;
        const lettersSidebar = document.getElementById('letters-sidebar');
        lettersSidebar.classList.remove('open');
    }
    
    openNumbersSidebar() {
        this.numbersSidebarOpen = true;
        const numbersSidebar = document.getElementById('numbers-sidebar');
        numbersSidebar.classList.add('open');
        this.populateNumbersContent();
    }
    
    closeNumbersSidebar() {
        this.numbersSidebarOpen = false;
        const numbersSidebar = document.getElementById('numbers-sidebar');
        numbersSidebar.classList.remove('open');
    }
    
    toggleBothSidebars() {
        if (this.lettersSidebarOpen && this.numbersSidebarOpen) {
            this.closeBothSidebars();
        } else {
            this.openBothSidebars();
        }
    }
    
    openBothSidebars() {
        this.openLettersSidebar();
        this.openNumbersSidebar();
    }
    
    closeBothSidebars() {
        this.closeLettersSidebar();
        this.closeNumbersSidebar();
    }
    
    toggleSettings() {
        if (this.settingsOpen) {
            this.closeSettings();
        } else {
            this.openSettings();
        }
    }
    
    openSettings() {
        this.settingsOpen = true;
        this.pendingDifficultyMode = this.difficultyMode;
        this.pendingDifficultyLevel = this.difficultyLevel;
        const settingsPopup = document.getElementById('settings-popup');
        settingsPopup.classList.add('open');
        
        // Set the current difficulty mode in the radio buttons
        const currentDifficultyRadio = document.querySelector(`input[name="difficulty"][value="${this.difficultyMode}"]`);
        if (currentDifficultyRadio) {
            currentDifficultyRadio.checked = true;
        }
        
        // Set the current difficulty level in the radio buttons
        const currentLevelRadio = document.querySelector(`input[name="level"][value="${this.difficultyLevel}"]`);
        if (currentLevelRadio) {
            currentLevelRadio.checked = true;
        }
    }
    
    closeSettings() {
        this.settingsOpen = false;
        this.pendingDifficultyMode = this.difficultyMode;
        this.pendingDifficultyLevel = this.difficultyLevel;
        const settingsPopup = document.getElementById('settings-popup');
        settingsPopup.classList.remove('open');
    }
    
    saveSettings() {
        // Apply the pending settings
        this.difficultyMode = this.pendingDifficultyMode;
        this.difficultyLevel = this.pendingDifficultyLevel;
        
        // Close the settings popup
        this.closeSettings();
        
        // Load a new word with the new settings
        this.loadNewWord();
        
        // Focus back to the input
        document.getElementById('morse-input').focus();
    }
    
    populateLettersContent() {
        const lettersContent = document.getElementById('letters-content');
        let content = '<div class="letters-grid">';
        
        // Sort letters alphabetically
        const sortedLetters = Object.keys(this.morseCode).sort();
        
        sortedLetters.forEach(letter => {
            content += `
                <div class="morse-item">
                    <span class="morse-char">${letter}</span>
                    <span class="morse-code">${this.morseCode[letter]}</span>
                </div>
            `;
        });
        
        content += '</div>';
        lettersContent.innerHTML = content;
    }
    
    populateNumbersContent() {
        const numbersContent = document.getElementById('numbers-content');
        let content = '<div class="numbers-list">';
        
        // Sort numbers
        const sortedNumbers = Object.keys(this.morseNumbers).sort((a, b) => parseInt(a) - parseInt(b));
        
        sortedNumbers.forEach(number => {
            content += `
                <div class="morse-item">
                    <span class="morse-char">${number}</span>
                    <span class="morse-code">${this.morseNumbers[number]}</span>
                </div>
            `;
        });
        
        content += '</div>';
        numbersContent.innerHTML = content;
    }
    
    loadNewWord() {
        let wordList;
        
        if (this.difficultyMode === 'singular') {
            wordList = this.wordsByLevel[this.difficultyLevel];
        } else {
            wordList = this.sentencesByLevel[this.difficultyLevel];
        }
        
        this.currentWord = wordList[Math.floor(Math.random() * wordList.length)];
        this.currentMorse = this.wordToMorse(this.currentWord);
        
        document.getElementById('current-word').textContent = this.currentWord;
        document.getElementById('morse-input').value = '';
        document.getElementById('morse-input').classList.remove('error');
        
        // Focus the input
        document.getElementById('morse-input').focus();
    }
    
    wordToMorse(word) {
        return word.split('').map(char => {
            if (char === ' ') return ' ';
            return this.morseCode[char] || char;
        }).join(' ');
    }
    
    checkAnswer() {
        const input = document.getElementById('morse-input');
        const userAnswer = input.value.trim();
        
        // Remove spaces from both answers for comparison
        const normalizedUserAnswer = userAnswer.replace(/\s/g, '');
        const normalizedExpectedAnswer = this.currentMorse.replace(/\s/g, '');
        
        if (normalizedUserAnswer === normalizedExpectedAnswer) {
            // Correct answer
            this.loadNewWord();
            
            // Visual feedback for correct answer
            input.style.borderColor = 'var(--success-green)';
            setTimeout(() => {
                input.style.borderColor = 'var(--text-color)';
            }, 500);
            
        } else {
            // Incorrect answer
            
            // Visual feedback for incorrect answer
            input.classList.add('error');
            setTimeout(() => {
                input.classList.remove('error');
                input.value = '';
            }, 1000);
        }
    }
    
    toggleTheme() {
        const html = document.documentElement;
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = html.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            html.removeAttribute('data-theme');
            themeToggle.textContent = 'Light';
        } else {
            html.setAttribute('data-theme', 'light');
            themeToggle.textContent = 'Dark';
        }
    }
}

// Initialize the trainer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MorseTrainer();
}); 