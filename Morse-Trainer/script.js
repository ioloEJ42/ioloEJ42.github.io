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
        
        this.words = [
            'HELLO', 'WORLD', 'MORSE', 'CODE', 'TRAINER', 'SIGNAL', 'MESSAGE',
            'COMMUNICATION', 'RADIO', 'TELEGRAPH', 'DOT', 'DASH', 'SOS', 'HELP',
            'EMERGENCY', 'RESCUE', 'SAVE', 'LIFE', 'DANGER', 'WARNING', 'STOP',
            'GO', 'YES', 'NO', 'OKAY', 'FINE', 'GOOD', 'BAD', 'UP', 'DOWN',
            'LEFT', 'RIGHT', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'FIRE', 'WATER',
            'EARTH', 'AIR', 'SUN', 'MOON', 'STAR', 'SKY', 'SEA', 'LAND', 'TREE',
            'FLOWER', 'BIRD', 'FISH', 'DOG', 'CAT', 'HORSE', 'COW', 'SHEEP'
        ];
        
        this.currentWord = '';
        this.currentMorse = '';
        
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
        
        // Focus input on page load
        morseInput.focus();
    }
    
    loadNewWord() {
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        this.currentMorse = this.wordToMorse(this.currentWord);
        
        document.getElementById('current-word').textContent = this.currentWord;
        document.getElementById('morse-input').value = '';
        document.getElementById('morse-input').classList.remove('error');
        
        // Focus the input
        document.getElementById('morse-input').focus();
    }
    
    wordToMorse(word) {
        return word.split('').map(char => this.morseCode[char]).join(' ');
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