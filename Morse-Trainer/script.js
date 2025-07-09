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
        
        // Streak tracking
        this.currentStreak = 0;
        this.bestStreak = 0;
        
        // Developer mode
        this.developerMode = false;
        this.developerText = '';
        
        this.init();
    }
    
    init() {
        this.loadStreaks();
        this.bindEvents();
        this.loadNewWord();
        this.updateStreakDisplay();
        this.setupDeveloperMode();
    }
    
    setupDeveloperMode() {
        // Developer mode is not persistent - starts fresh each session
        this.developerMode = false;
    }
    
    checkDeveloperText(key) {
        // Add the key to the text
        this.developerText += key;
        
        // Keep only the last 10 characters
        if (this.developerText.length > 10) {
            this.developerText = this.developerText.slice(-10);
        }
        
        // Debug: log the current text
        console.log('Key pressed:', key);
        console.log('Current text:', this.developerText);
        
        // Check if the text contains "konami"
        if (this.developerText.includes('konami')) {
            console.log('Developer mode detected!');
            
            if (!this.developerMode) {
                console.log('Activating developer mode!');
                this.activateDeveloperMode();
            }
            
            // Clear the text after activation
            this.developerText = '';
        }
    }
    
    activateDeveloperMode() {
        this.developerMode = true;
        this.showDeveloperMode();
        
        // Show a subtle notification
        this.showDeveloperNotification();
    }
    
    showDeveloperMode() {
        const testSection = document.querySelector('.setting-group:last-child');
        if (testSection) {
            testSection.style.display = 'block';
        }
    }
    
    hideDeveloperMode() {
        const testSection = document.querySelector('.setting-group:last-child');
        if (testSection) {
            testSection.style.display = 'none';
        }
    }
    
    showDeveloperNotification() {
        // Create a subtle notification
        const notification = document.createElement('div');
        notification.textContent = 'Developer Mode Activated';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 0, 0.9);
            color: black;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            animation: slideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    loadStreaks() {
        // Load streaks from localStorage
        const savedCurrentStreak = localStorage.getItem('morseTrainerCurrentStreak');
        const savedBestStreak = localStorage.getItem('morseTrainerBestStreak');
        
        if (savedCurrentStreak !== null) {
            this.currentStreak = parseInt(savedCurrentStreak);
        }
        
        if (savedBestStreak !== null) {
            this.bestStreak = parseInt(savedBestStreak);
        }
    }
    
    saveStreaks() {
        // Save streaks to localStorage
        localStorage.setItem('morseTrainerCurrentStreak', this.currentStreak.toString());
        localStorage.setItem('morseTrainerBestStreak', this.bestStreak.toString());
    }
    
    updateStreakDisplay() {
        const currentStreakElement = document.getElementById('current-streak');
        const bestStreakElement = document.getElementById('best-streak');
        
        if (currentStreakElement) {
            currentStreakElement.textContent = this.currentStreak;
            this.applyStreakStyling(currentStreakElement, this.currentStreak);
        }
        
        if (bestStreakElement) {
            bestStreakElement.textContent = this.bestStreak;
            this.applyStreakStyling(bestStreakElement, this.bestStreak);
        }
    }
    
    applyStreakStyling(element, streakValue) {
        // Remove all existing streak and lap classes
        element.className = element.className.replace(/streak-\d+/g, '').replace(/lap-\d+/g, '').trim();
        
        if (streakValue === 0) {
            element.classList.add('streak-0');
            this.removeDynamicEffects(element);
            return;
        }
        
        // Calculate which cycle (lap) we're in and the position within that cycle
        const cycleLength = 30; // Complete color cycle
        const cycle = Math.floor((streakValue - 1) / cycleLength);
        const positionInCycle = ((streakValue - 1) % cycleLength);
        
        // Apply the appropriate streak color class
        element.classList.add(`streak-${positionInCycle}`);
        
        // Apply lap indicator if we've completed at least one cycle
        if (cycle > 0) {
            const lapNumber = Math.min(cycle, 5); // Cap at 5 laps for visual clarity
            element.classList.add(`lap-${lapNumber}`);
        }
        
        // Apply dynamic effects based on streak value
        this.applyDynamicEffects(element, streakValue);
    }
    
    applyDynamicEffects(element, streakValue) {
        // Remove any existing dynamic effects
        this.removeDynamicEffects(element);
        
        // Base effects that scale with streak
        const effects = this.calculateEffects(streakValue);
        
        // Apply the calculated effects
        Object.keys(effects).forEach(property => {
            element.style[property] = effects[property];
        });
        
        // Add special effects for milestone streaks
        this.addMilestoneEffects(element, streakValue);
    }
    
    calculateEffects(streakValue) {
        const effects = {};
        
        // Scale effects based on streak value
        const scale = Math.min(streakValue / 50, 3); // Cap at 3x scale
        const glowIntensity = Math.min(streakValue / 20, 5); // Cap at 5px glow
        const rotationSpeed = Math.min(streakValue / 10, 2); // Cap at 2s rotation
        
        // Text shadow (glow effect)
        if (streakValue > 0) {
            const color = this.getStreakColor(streakValue);
            effects.textShadow = `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}`;
        }
        
        // Scale effect for high streaks
        if (streakValue > 20) {
            effects.transform = `scale(${1 + (scale - 1) * 0.1})`;
        }
        
        // Rotation effect for very high streaks
        if (streakValue > 50) {
            effects.animation = `streakRotate ${rotationSpeed}s linear infinite`;
        }
        
        // Pulse effect for extremely high streaks
        if (streakValue > 100) {
            effects.animation = `streakRotate ${rotationSpeed}s linear infinite, streakPulse ${2 / scale}s ease-in-out infinite`;
        }
        
        // Rainbow trail effect for legendary streaks
        if (streakValue > 200) {
            effects.animation += ', rainbowTrail 1s linear infinite';
        }
        
        // Matrix-style glitch effect for god-tier streaks
        if (streakValue > 500) {
            effects.animation += ', matrixGlitch 0.5s ease-in-out infinite';
        }
        
        // Reality-bending effects for mythical streaks
        if (streakValue > 750) {
            effects.animation += ', realityBend 3s ease-in-out infinite';
        }
        
        // Universe-shattering effects for streak 1000
        if (streakValue >= 1000) {
            effects.animation = 'universeShatter 1s ease-in-out infinite';
        }
        
        return effects;
    }
    
    getStreakColor(streakValue) {
        // Calculate color based on position in cycle
        const cycleLength = 30;
        const positionInCycle = ((streakValue - 1) % cycleLength);
        
        // Color wheel - 30 colors from red through the spectrum back to red
        const colors = [
            '#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00', '#ffff00',
            '#ccff00', '#99ff00', '#66ff00', '#33ff00', '#00ff00', '#00ff33',
            '#00ff66', '#00ff99', '#00ffcc', '#00ffff', '#00ccff', '#0099ff',
            '#0066ff', '#0033ff', '#0000ff', '#3300ff', '#6600ff', '#9900ff',
            '#cc00ff', '#ff00ff', '#ff00cc', '#ff0099', '#ff0066', '#ff0033'
        ];
        
        return colors[positionInCycle] || '#ff0000';
    }
    
    addMilestoneEffects(element, streakValue) {
        // Special effects for milestone streaks
        if (streakValue >= 50) {
            element.style.border = '2px solid currentColor';
            element.style.borderRadius = '8px';
            element.style.padding = '4px 8px';
        }
        
        if (streakValue >= 100) {
            element.style.boxShadow = '0 0 20px currentColor, inset 0 0 10px currentColor';
        }
        
        if (streakValue >= 150) {
            element.style.background = 'linear-gradient(45deg, currentColor, transparent)';
            element.style.backgroundSize = '200% 200%';
            element.style.animation += ', gradientShift 3s ease-in-out infinite';
        }
        
        if (streakValue >= 200) {
            element.style.textShadow += ', 0 0 30px white, 0 0 40px white';
            element.style.fontWeight = '900';
        }
        
        // Epic milestone effects
        if (streakValue >= 300) {
            this.addParticleEffect(element, streakValue);
        }
        
        if (streakValue >= 400) {
            element.style.filter = 'hue-rotate(180deg) brightness(1.5)';
            element.style.animation += ', epicPulse 0.3s ease-in-out infinite';
        }
        
        if (streakValue >= 500) {
            this.addScreenShake(streakValue);
            element.style.textShadow += ', 0 0 50px gold, 0 0 100px gold';
        }
        
        if (streakValue >= 600) {
            element.style.background = 'radial-gradient(circle, currentColor, transparent, currentColor)';
            element.style.backgroundSize = '300% 300%';
            element.style.animation += ', epicRadial 2s ease-in-out infinite';
        }
        
        if (streakValue >= 700) {
            this.addLightningEffect(element);
        }
        
        if (streakValue >= 800) {
            element.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
            element.style.animation += ', shapeShift 1s ease-in-out infinite';
        }
        
        if (streakValue >= 900) {
            this.addTimeWarpEffect(element);
        }
        
        if (streakValue >= 1000) {
            this.addUniverseEffect(element);
        }
    }
    
    addParticleEffect(element, streakValue) {
        // Create particle container if it doesn't exist
        let particleContainer = document.getElementById('particle-container');
        if (!particleContainer) {
            particleContainer = document.createElement('div');
            particleContainer.id = 'particle-container';
            particleContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(particleContainer);
        }
        
        // Create particles
        const particleCount = Math.min(streakValue / 10, 50);
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(particleContainer, element);
        }
    }
    
    createParticle(container, element) {
        const particle = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const color = this.getStreakColor(this.currentStreak);
        
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            pointer-events: none;
            animation: particleFloat 2s ease-out forwards;
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
    
    addScreenShake(streakValue) {
        const intensity = Math.min(streakValue / 100, 10);
        const shakeDuration = 500;
        
        document.body.style.animation = `screenShake ${shakeDuration}ms ease-in-out`;
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, shakeDuration);
    }
    
    addLightningEffect(element) {
        element.style.animation += ', lightning 0.1s ease-in-out infinite';
        element.style.textShadow += ', 0 0 20px yellow, 0 0 40px yellow';
    }
    
    addTimeWarpEffect(element) {
        element.style.animation += ', timeWarp 2s ease-in-out infinite';
        element.style.filter += ' contrast(2) saturate(3)';
    }
    
    addUniverseEffect(element) {
        element.style.animation = 'universeShatter 1s ease-in-out infinite';
        element.style.textShadow = '0 0 100px white, 0 0 200px white, 0 0 300px white';
        element.style.fontSize = '2em';
        element.style.fontWeight = '900';
        
        // Create universe shatter effect
        this.createUniverseShatter();
    }
    
    createUniverseShatter() {
        const universe = document.createElement('div');
        universe.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, transparent 30%, rgba(255,255,255,0.1) 70%);
            pointer-events: none;
            z-index: 10000;
            animation: universeExpand 3s ease-out forwards;
        `;
        
        document.body.appendChild(universe);
        
        setTimeout(() => {
            if (universe.parentNode) {
                universe.parentNode.removeChild(universe);
            }
        }, 3000);
    }
    
    removeDynamicEffects(element) {
        // Remove all dynamic styles
        const propertiesToRemove = [
            'textShadow', 'transform', 'animation', 'border', 'borderRadius',
            'padding', 'boxShadow', 'background', 'backgroundSize', 'fontWeight',
            'filter', 'clipPath', 'fontSize'
        ];
        
        propertiesToRemove.forEach(property => {
            element.style[property] = '';
        });
        
        // Remove particle container if it exists
        const particleContainer = document.getElementById('particle-container');
        if (particleContainer) {
            particleContainer.remove();
        }
    }
    
    highlightStreak() {
        const currentStreakElement = document.getElementById('current-streak');
        const bestStreakElement = document.getElementById('best-streak');
        
        if (currentStreakElement) {
            currentStreakElement.classList.add('highlight');
            setTimeout(() => {
                currentStreakElement.classList.remove('highlight');
            }, 600);
        }
        
        if (bestStreakElement) {
            bestStreakElement.classList.add('highlight');
            setTimeout(() => {
                bestStreakElement.classList.remove('highlight');
            }, 600);
        }
    }
    
    incrementStreak() {
        this.currentStreak++;
        
        // Check if this is a new best streak
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
        
        this.saveStreaks();
        this.updateStreakDisplay();
        this.highlightStreak();
    }
    
    resetStreak() {
        this.currentStreak = 0;
        this.saveStreaks();
        this.updateStreakDisplay();
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
        
        // Only allow . and - characters, and prevent H and S from being typed
        morseInput.addEventListener('input', (e) => {
            const value = e.target.value;
            // Remove H, S, and any characters that aren't . or -
            const filtered = value.replace(/[^.-]/g, '');
            if (value !== filtered) {
                e.target.value = filtered;
            }
        });
        
        // Prevent H and S keys from being typed into the input
        morseInput.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'h' || e.key.toLowerCase() === 's') {
                e.preventDefault();
                return;
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
        
        // Test streak functionality (temporary)
        const testStreakBtn = document.getElementById('test-streak-btn');
        const testStreakInput = document.getElementById('test-streak-input');
        
        testStreakBtn.addEventListener('click', () => {
            const testValue = parseInt(testStreakInput.value);
            if (!isNaN(testValue) && testValue >= 0) {
                this.currentStreak = testValue;
                this.updateStreakDisplay();
                this.saveStreaks();
            }
        });
        
        // Allow Enter key to test streak
        testStreakInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                testStreakBtn.click();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Developer mode key sequence detection
            this.checkDeveloperText(e.key);
            
            // H key to toggle both sidebars (works even when input is focused)
            if (e.key.toLowerCase() === 'h') {
                e.preventDefault();
                this.toggleBothSidebars();
                return;
            }
            
            // S key to toggle settings (works even when input is focused)
            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                this.toggleSettings();
                return;
            }
            
            // Enter key to save settings when settings is open
            if (e.key === 'Enter' && this.settingsOpen) {
                e.preventDefault();
                this.saveSettings();
                return;
            }
            
            // Escape key to close sidebars and settings
            if (e.key === 'Escape') {
                if (this.settingsOpen) {
                    this.closeSettings();
                } else if (this.lettersSidebarOpen || this.numbersSidebarOpen) {
                    this.closeBothSidebars();
                }
                return;
            }
        });
        
        // Focus input on page load
        morseInput.focus();
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
        
        // Show/hide developer section based on mode
        if (this.developerMode) {
            this.showDeveloperMode();
        } else {
            this.hideDeveloperMode();
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
            this.incrementStreak();
            this.loadNewWord();
            
            // Visual feedback for correct answer
            input.style.borderColor = 'var(--success-green)';
            setTimeout(() => {
                input.style.borderColor = 'var(--text-color)';
            }, 500);
            
        } else {
            // Incorrect answer
            this.resetStreak();
            
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