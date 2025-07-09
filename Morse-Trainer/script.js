// Morse Code Trainer
class MorseTrainer {
    constructor() {
        // Use data from external data.js file
        this.morseCode = MORSE_DATA.morseCode;
        this.morseNumbers = MORSE_DATA.morseNumbers;
        this.wordsByLevel = MORSE_DATA.wordsByLevel;
        this.sentencesByLevel = MORSE_DATA.sentencesByLevel;
        
        this.currentWord = '';
        this.currentMorse = '';
        this.lettersSidebarOpen = false;
        this.numbersSidebarOpen = false;
        this.settingsOpen = false;
        this.difficultyMode = 'singular'; // 'singular' or 'sentence'
        this.difficultyLevel = 'easy'; // 'easy', 'medium', 'hard'
        this.pendingDifficultyMode = 'singular';
        this.pendingDifficultyLevel = 'easy';
        this.translationDirection = 'en-to-morse'; // 'en-to-morse' or 'morse-to-en'
        this.pendingTranslationDirection = 'en-to-morse';
        
        // Streak tracking
        this.currentStreak = 0;
        this.bestStreak = 0;
        
        // Points system (invisible, used for effects)
        this.currentPoints = 0;
        this.bestPoints = 0;
        
        // Difficulty multipliers
        this.difficultyMultipliers = {
            easy: 0.2,
            medium: 0.5,
            hard: 1.0
        };
        
        // Mode multipliers
        this.modeMultipliers = {
            singular: 0.5,
            sentence: 1.0
        };
        
        // Initialize developer mode
        this.developerMode = false;
        this.developerText = '';
        
        // Developer testing features
        this.answerRevealerEnabled = false;
        
        // Hide developer section by default
        const developerSection = document.querySelector('.developer-section');
        if (developerSection) {
            developerSection.style.display = 'none';
        }
        
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
    
    showDeveloperNotification(message) {
        // Create a subtle notification
        const notification = document.createElement('div');
        notification.textContent = message;
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
        const savedCurrentPoints = localStorage.getItem('morseTrainerCurrentPoints');
        const savedBestPoints = localStorage.getItem('morseTrainerBestPoints');
        
        if (savedCurrentStreak !== null) {
            this.currentStreak = parseInt(savedCurrentStreak);
        }
        
        if (savedBestStreak !== null) {
            this.bestStreak = parseInt(savedBestStreak);
        }
        
        if (savedCurrentPoints !== null) {
            this.currentPoints = parseFloat(savedCurrentPoints);
        } else {
            this.currentPoints = this.calculatePoints(this.currentStreak);
        }
        
        if (savedBestPoints !== null) {
            this.bestPoints = parseFloat(savedBestPoints);
        } else {
            this.bestPoints = this.calculatePoints(this.bestStreak);
        }
    }
    
    saveStreaks() {
        // Save streaks to localStorage
        localStorage.setItem('morseTrainerCurrentStreak', this.currentStreak.toString());
        localStorage.setItem('morseTrainerBestStreak', this.bestStreak.toString());
        localStorage.setItem('morseTrainerCurrentPoints', this.currentPoints.toString());
        localStorage.setItem('morseTrainerBestPoints', this.bestPoints.toString());
    }
    
    calculatePoints(streak) {
        const difficultyMultiplier = this.difficultyMultipliers[this.difficultyLevel];
        const modeMultiplier = this.modeMultipliers[this.difficultyMode];
        return streak * difficultyMultiplier * modeMultiplier;
    }
    
    updatePoints() {
        this.currentPoints = this.calculatePoints(this.currentStreak);
        this.bestPoints = Math.max(this.bestPoints, this.currentPoints);
    }
    
    updateStreakDisplay() {
        const currentStreakElement = document.getElementById('current-streak');
        const bestStreakElement = document.getElementById('best-streak');
        const currentPointsElement = document.getElementById('current-points-display');
        const bestPointsElement = document.getElementById('best-points-display');
        const currentPointsIndicator = document.getElementById('current-points-indicator');
        const bestPointsIndicator = document.getElementById('best-points-indicator');
        
        if (currentStreakElement) {
            currentStreakElement.textContent = this.currentStreak;
            this.applyStreakStyling(currentStreakElement, this.currentStreak);
        }
        
        if (bestStreakElement) {
            bestStreakElement.textContent = this.bestStreak;
            this.applyStreakStyling(bestStreakElement, this.bestStreak);
        }
        
        // Update points display in developer mode
        if (currentPointsElement) {
            currentPointsElement.textContent = this.currentPoints.toFixed(1);
        }
        
        if (bestPointsElement) {
            bestPointsElement.textContent = this.bestPoints.toFixed(1);
        }
        
        // Update points indicators in main display
        if (currentPointsIndicator) {
            currentPointsIndicator.textContent = this.currentPoints.toFixed(1);
        }
        
        if (bestPointsIndicator) {
            bestPointsIndicator.textContent = this.bestPoints.toFixed(1);
        }
    }
    
    applyStreakStyling(element, streakValue) {
        // Remove all existing streak and lap classes
        element.className = element.className.replace(/streak-\d+/g, '').replace(/lap-\d+/g, '').trim();
        
        // Calculate points for effects
        const points = this.calculatePoints(streakValue);
        
        if (points === 0) {
            element.classList.add('streak-0');
            this.removeDynamicEffects(element);
            return;
        }
        
        // Calculate which cycle (lap) we're in and the position within that cycle
        const cycleLength = 30; // Complete color cycle
        const cycle = Math.floor((points - 1) / cycleLength);
        const positionInCycle = ((points - 1) % cycleLength);
        
        // Apply the appropriate streak color class
        element.classList.add(`streak-${positionInCycle}`);
        
        // Apply lap indicator if we've completed at least one cycle
        if (cycle > 0) {
            const lapNumber = Math.min(cycle, 5); // Cap at 5 laps for visual clarity
            element.classList.add(`lap-${lapNumber}`);
        }
        
        // Apply dynamic effects based on points value
        this.applyDynamicEffects(element, points);
    }
    
    applyDynamicEffects(element, pointsValue) {
        // Remove any existing dynamic effects
        this.removeDynamicEffects(element);
        
        // Base effects that scale with points
        const effects = this.calculateEffects(pointsValue);
        
        // Apply the calculated effects
        Object.keys(effects).forEach(property => {
            element.style[property] = effects[property];
        });
        
        // Add special effects for milestone points
        this.addMilestoneEffects(element, pointsValue);
    }
    
    calculateEffects(pointsValue) {
        const effects = {};
        
        // Scale effects based on points value
        const scale = Math.min(pointsValue / 50, 3); // Cap at 3x scale
        const glowIntensity = Math.min(pointsValue / 20, 5); // Cap at 5px glow
        const rotationSpeed = Math.min(pointsValue / 10, 2); // Cap at 2s rotation
        
        // Text shadow (glow effect)
        if (pointsValue > 0) {
            const color = this.getStreakColor(pointsValue);
            effects.textShadow = `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}`;
        }
        
        // Scale effect for high points
        if (pointsValue > 20) {
            effects.transform = `scale(${1 + (scale - 1) * 0.1})`;
        }
        
        // Rotation effect for very high points
        if (pointsValue > 50) {
            effects.animation = `streakRotate ${rotationSpeed}s linear infinite`;
        }
        
        // Pulse effect for extremely high points
        if (pointsValue > 100) {
            effects.animation = `streakRotate ${rotationSpeed}s linear infinite, streakPulse ${2 / scale}s ease-in-out infinite`;
        }
        
        // Rainbow trail effect for legendary points
        if (pointsValue > 200) {
            effects.animation += ', rainbowTrail 1s linear infinite';
        }
        
        // Matrix-style glitch effect for god-tier points
        if (pointsValue > 500) {
            effects.animation += ', matrixGlitch 0.5s ease-in-out infinite';
        }
        
        // Reality-bending effects for mythical points
        if (pointsValue > 750) {
            effects.animation += ', realityBend 3s ease-in-out infinite';
        }
        
        // Universe-shattering effects for points 1000
        if (pointsValue >= 1000) {
            effects.animation = 'universeShatter 1s ease-in-out infinite';
        }
        
        return effects;
    }
    
    getStreakColor(pointsValue) {
        // Calculate color based on position in cycle
        const cycleLength = 30;
        const positionInCycle = ((pointsValue - 1) % cycleLength);
        
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
    
    addMilestoneEffects(element, pointsValue) {
        // Special effects for milestone points
        if (pointsValue >= 50) {
            element.style.border = '2px solid currentColor';
            element.style.borderRadius = '8px';
            element.style.padding = '4px 8px';
        }
        
        if (pointsValue >= 100) {
            element.style.boxShadow = '0 0 20px currentColor, inset 0 0 10px currentColor';
        }
        
        if (pointsValue >= 150) {
            element.style.background = 'linear-gradient(45deg, currentColor, transparent)';
            element.style.backgroundSize = '200% 200%';
            element.style.animation += ', gradientShift 3s ease-in-out infinite';
        }
        
        if (pointsValue >= 200) {
            element.style.textShadow += ', 0 0 30px white, 0 0 40px white';
            element.style.fontWeight = '900';
        }
        
        // Epic milestone effects
        if (pointsValue >= 300) {
            this.addParticleEffect(element, pointsValue);
        }
        
        if (pointsValue >= 400) {
            element.style.filter = 'hue-rotate(180deg) brightness(1.5)';
            element.style.animation += ', epicPulse 0.3s ease-in-out infinite';
        }
        
        if (pointsValue >= 500) {
            this.addScreenShake(pointsValue);
            element.style.textShadow += ', 0 0 50px gold, 0 0 100px gold';
        }
        
        if (pointsValue >= 600) {
            element.style.background = 'radial-gradient(circle, currentColor, transparent, currentColor)';
            element.style.backgroundSize = '300% 300%';
            element.style.animation += ', epicRadial 2s ease-in-out infinite';
        }
        
        if (pointsValue >= 700) {
            this.addLightningEffect(element);
        }
        
        if (pointsValue >= 800) {
            element.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
            element.style.animation += ', shapeShift 1s ease-in-out infinite';
        }
        
        if (pointsValue >= 900) {
            this.addTimeWarpEffect(element);
        }
        
        if (pointsValue >= 1000) {
            this.addUniverseEffect(element);
        }
    }
    
    addParticleEffect(element, pointsValue) {
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
        const particleCount = Math.min(pointsValue / 10, 50);
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
    
    addScreenShake(pointsValue) {
        const intensity = Math.min(pointsValue / 100, 10);
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
        
        // Update points
        this.updatePoints();
        
        this.saveStreaks();
        this.updateStreakDisplay();
        this.highlightStreak();
    }
    
    resetStreak() {
        this.currentStreak = 0;
        this.updatePoints();
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
        
        // Input filtering based on translation direction
        morseInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (this.translationDirection === 'en-to-morse') {
                // English -> Morse: Only allow . and -
                const filtered = value.replace(/[^.-]/g, '');
                if (value !== filtered) {
                    e.target.value = filtered;
                }
            } else {
                // Morse -> English: Allow letters, numbers, spaces
                const filtered = value.replace(/[^A-Za-z0-9\s]/g, '').toUpperCase();
                if (value !== filtered) {
                    e.target.value = filtered;
                }
            }
        });
        
        // Remove the H and S key prevention - users should be able to type these letters
        // morseInput.addEventListener('keydown', (e) => {
        //     if (e.key.toLowerCase() === 'h' || e.key.toLowerCase() === 's') {
        //         e.preventDefault();
        //         return;
        //     }
        // });
        
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
        
        // Translation direction radio buttons
        const directionRadios = document.querySelectorAll('input[name="direction"]');
        directionRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.pendingTranslationDirection = e.target.value;
            });
        });
        
        // Test streak functionality (developer mode)
        const testStreakBtn = document.getElementById('test-streak-btn');
        const testStreakInput = document.getElementById('test-streak-input');
        const streakIncrement1 = document.getElementById('streak-increment-1');
        const streakIncrement10 = document.getElementById('streak-increment-10');
        const streakIncrement100 = document.getElementById('streak-increment-100');
        const randomStreakBtn = document.getElementById('random-streak-btn');
        const answerRevealerBtn = document.getElementById('answer-revealer-btn');
        
        testStreakBtn.addEventListener('click', () => {
            const testValue = parseInt(testStreakInput.value);
            if (!isNaN(testValue) && testValue >= 0 && testValue <= 1000) {
                this.currentStreak = testValue;
                this.updatePoints();
                this.updateStreakDisplay();
                this.saveStreaks();
            }
        });
        
        // Streak increment buttons
        streakIncrement1.addEventListener('click', () => {
            this.currentStreak = Math.min(this.currentStreak + 1, 1000);
            testStreakInput.value = this.currentStreak;
            this.updatePoints();
            this.updateStreakDisplay();
            this.saveStreaks();
        });
        
        streakIncrement10.addEventListener('click', () => {
            this.currentStreak = Math.min(this.currentStreak + 10, 1000);
            testStreakInput.value = this.currentStreak;
            this.updatePoints();
            this.updateStreakDisplay();
            this.saveStreaks();
        });
        
        streakIncrement100.addEventListener('click', () => {
            this.currentStreak = Math.min(this.currentStreak + 100, 1000);
            testStreakInput.value = this.currentStreak;
            this.updateStreakDisplay();
            this.saveStreaks();
        });
        
        // Random streak generator
        randomStreakBtn.addEventListener('click', () => {
            const randomStreak = Math.floor(Math.random() * 1001); // 0-1000
            this.currentStreak = randomStreak;
            testStreakInput.value = this.currentStreak;
            this.updatePoints();
            this.updateStreakDisplay();
            this.saveStreaks();
        });
        
        // Answer Revealer toggle
        answerRevealerBtn.addEventListener('click', () => {
            this.answerRevealerEnabled = !this.answerRevealerEnabled;
            answerRevealerBtn.classList.toggle('active', this.answerRevealerEnabled);
            answerRevealerBtn.textContent = this.answerRevealerEnabled ? 'Hide Answer' : 'Answer Revealer';
            
            if (this.answerRevealerEnabled) {
                this.showAnswerRevealer();
            } else {
                this.hideAnswerRevealer();
            }
        });
        
        // Allow Enter key to test streak
        testStreakInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                testStreakBtn.click();
            }
        });
        
        // Keyboard shortcuts and developer mode detection
        document.addEventListener('keydown', (e) => {
            // Developer mode key sequence detection (global) - only active in English->Morse mode
            if (this.translationDirection === 'en-to-morse') {
                this.developerText += e.key.toLowerCase();
                if (this.developerText.includes('konami')) {
                    this.developerMode = !this.developerMode;
                    this.developerText = '';
                    // Show/hide developer section
                    const developerSection = document.querySelector('.developer-section');
                    if (developerSection) {
                        developerSection.style.display = this.developerMode ? 'block' : 'none';
                    }
                    // Show notification for both activation and deactivation
                    if (this.developerMode) {
                        this.showDeveloperNotification('Developer Mode Activated');
                    } else {
                        this.showDeveloperNotification('Developer Mode Deactivated');
                    }
                    // Clean up developer features when deactivating
                    if (!this.developerMode) {
                        this.hideAnswerRevealer();
                        this.answerRevealerEnabled = false;
                        // Reset button states
                        const answerRevealerBtn = document.getElementById('answer-revealer-btn');
                        if (answerRevealerBtn) {
                            answerRevealerBtn.classList.remove('active');
                            answerRevealerBtn.textContent = 'Answer Revealer';
                        }
                        // Reset test streak input
                        const testStreakInput = document.getElementById('test-streak-input');
                        if (testStreakInput) {
                            testStreakInput.value = '';
                        }
                    }
                    // Visual feedback
                    document.body.style.border = this.developerMode ? '3px solid #00ff00' : 'none';
                }
                // Keep only last 10 characters to prevent memory buildup
                if (this.developerText.length > 10) {
                    this.developerText = this.developerText.slice(-10);
                }
            } else {
                // Reset developer text when not in English->Morse mode
                this.developerText = '';
            }
            // Remove S and H keybindings for toggling settings and hints
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
        this.pendingTranslationDirection = this.translationDirection;
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
        
        // Set the current translation direction in the radio buttons
        const currentDirectionRadio = document.querySelector(`input[name="direction"][value="${this.translationDirection}"]`);
        if (currentDirectionRadio) {
            currentDirectionRadio.checked = true;
        }
        
        // Always show/hide developer section and border based on developerMode
        const developerSection = document.querySelector('.developer-section');
        if (this.developerMode) {
            if (developerSection) developerSection.style.display = 'block';
            document.body.style.border = '3px solid #00ff00';
        } else {
            if (developerSection) developerSection.style.display = 'none';
            document.body.style.border = 'none';
        }
    }
    
    closeSettings() {
        this.settingsOpen = false;
        this.pendingDifficultyMode = this.difficultyMode;
        this.pendingDifficultyLevel = this.difficultyLevel;
        this.pendingTranslationDirection = this.translationDirection;
        const settingsPopup = document.getElementById('settings-popup');
        settingsPopup.classList.remove('open');
    }
    
    saveSettings() {
        // Apply the pending settings
        this.difficultyMode = this.pendingDifficultyMode;
        this.difficultyLevel = this.pendingDifficultyLevel;
        this.translationDirection = this.pendingTranslationDirection;
        // Update points based on new difficulty
        this.updatePoints();
        // Close the settings popup
        this.closeSettings();
        // Load a new word with the new settings (this will update the label)
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
        // Update label based on mode
        const label = document.getElementById('current-label');
        if (label) {
            label.textContent = this.difficultyMode === 'singular' ? 'Current Word:' : 'Current Sentence:';
        }
        if (this.difficultyMode === 'singular') {
            wordList = this.wordsByLevel[this.difficultyLevel];
        } else {
            wordList = this.sentencesByLevel[this.difficultyLevel];
        }
        
        this.currentWord = wordList[Math.floor(Math.random() * wordList.length)];
        this.currentMorse = this.wordToMorse(this.currentWord);
        
        // Display based on translation direction
        const currentWordElement = document.getElementById('current-word');
        const morseInput = document.getElementById('morse-input');
        const inputHint = document.getElementById('input-hint');
        const inputLabel = document.getElementById('input-label');
        
        if (this.translationDirection === 'en-to-morse') {
            // English -> Morse: Show English, expect Morse input
            currentWordElement.textContent = this.currentWord;
            morseInput.placeholder = 'Type . or - then press space';
            inputHint.textContent = 'Use . for dot, - for dash, space to submit';
            inputLabel.textContent = 'Enter Morse Code:';
        } else {
            // Morse -> English: Show Morse, expect English input
            currentWordElement.textContent = this.currentMorse;
            morseInput.placeholder = 'Type English letters then press space';
            inputHint.textContent = 'Type the English word/sentence, space to submit';
            inputLabel.textContent = 'Enter English:';
        }
        
        morseInput.value = '';
        morseInput.classList.remove('error');
        
        // Update answer revealer if enabled
        if (this.answerRevealerEnabled) {
            this.showAnswerRevealer();
        }
        
        // Focus the input
        morseInput.focus();
    }
    
    wordToMorse(word) {
        if (!word) return '';
        
        return word.split('').map(char => {
            if (char === ' ') return ' ';
            // Only return valid Morse code, ignore unknown characters
            return this.morseCode[char] || '';
        }).join(' ').replace(/\s+/g, '').trim();
    }
    
    checkAnswer() {
        const input = document.getElementById('morse-input');
        const userAnswer = input.value.trim();
        
        // Handle empty input
        if (!userAnswer) {
            input.classList.add('error');
            setTimeout(() => {
                input.classList.remove('error');
            }, 1000);
            return;
        }
        
        let isCorrect = false;
        
        if (this.translationDirection === 'en-to-morse') {
            // English -> Morse: Compare user's Morse with expected Morse
            const normalizedUserAnswer = userAnswer.replace(/\s/g, '');
            const normalizedExpectedAnswer = this.currentMorse.replace(/\s/g, '');
            isCorrect = normalizedUserAnswer === normalizedExpectedAnswer;
        } else {
            // Morse -> English: Convert user's English to Morse and compare
            const userMorse = this.wordToMorse(userAnswer);
            const normalizedUserMorse = userMorse.replace(/\s/g, '');
            const normalizedExpectedMorse = this.currentMorse.replace(/\s/g, '');
            isCorrect = normalizedUserMorse === normalizedExpectedMorse;
        }
        
        if (isCorrect) {
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
    
    showAnswerRevealer() {
        // Create or update answer revealer element
        let revealerElement = document.getElementById('answer-revealer');
        if (!revealerElement) {
            revealerElement = document.createElement('div');
            revealerElement.id = 'answer-revealer';
            revealerElement.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 0, 0, 0.9);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 14px;
                z-index: 10000;
                border: 2px solid #ff0000;
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
            `;
            document.body.appendChild(revealerElement);
        }
        
        let answerText, morseText;
        if (this.translationDirection === 'en-to-morse') {
            // English -> Morse: Show English word/sentence as answer
            answerText = this.currentWord;
            morseText = this.currentMorse;
        } else {
            // Morse -> English: Show English word/sentence as answer
            answerText = this.currentWord;
            morseText = this.currentMorse;
        }
        
        revealerElement.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Current Answer:</div>
            <div style="font-size: 16px; margin-bottom: 5px;">${answerText}</div>
            <div style="font-size: 12px; opacity: 0.8;">Morse: ${morseText}</div>
        `;
    }
    
    hideAnswerRevealer() {
        const revealerElement = document.getElementById('answer-revealer');
        if (revealerElement) {
            revealerElement.remove();
        }
    }
}

// Initialize the trainer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MorseTrainer();
}); 