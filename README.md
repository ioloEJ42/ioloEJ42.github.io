# Personal Development Hub

A comprehensive collection of web-based tools, games, and projects. This repository serves as a central hub for various interactive applications and utilities, all built with vanilla web technologies for maximum performance and portability.

## Projects

### Dashboard
- **Location**: `index.html` (root)
- **Purpose**: Custom browser homepage/new tab replacement
- **Features**: Search functionality with multiple engines, categorized quick links, terminal-themed interface
- **Usage**: Configure with New Tab Override extension in Firefox

### Portfolio
- **Location**: `/Portfolio/`
- **Purpose**: Terminal-themed personal portfolio website
- **Features**: Interactive terminal interface, project showcase, blog system, contact form
- **Technology**: JSON-based content management, simulated SSH sessions

### D&D Character Sheet
- **Location**: `/DND/`
- **Purpose**: Interactive digital character sheet for Dungeons & Dragons
- **Features**: Character creation, stat tracking, spell management, rich text notes, multiple themes
- **Technology**: Local storage, file import/export, responsive design

### Morse Code Trainer
- **Location**: `/Morse-Trainer/`
- **Purpose**: Interactive Morse code learning application
- **Features**: Bidirectional translation (English ↔ Morse), difficulty levels, streak tracking, visual effects
- **Technology**: Progressive difficulty, developer mode, localStorage persistence

### Hexathon
- **Location**: `/Hexathon/`
- **Purpose**: Hex color guessing game
- **Features**: Daily challenges, random mode, educational content about hex colors
- **Technology**: Wordle-style feedback system, color theory education

## Technical Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Build Tools**: None - direct deployment ready
- **Fonts**: JetBrains Mono, Inter, MedievalSharp
- **Storage**: localStorage, JSON files
- **Deployment**: GitHub Pages compatible

## Development

### Prerequisites
- Web server for local development (to avoid CORS issues)
- Basic knowledge of HTML, CSS, and JavaScript

### Local Setup
```bash
# Using Python's built-in HTTP server
python -m http.server

# Or using Node.js http-server
npx http-server
```

### Project Structure
```
/
├── index.html              # Main dashboard
├── Searchpage/             # Dashboard assets
├── Portfolio/              # Terminal portfolio
├── DND/                    # D&D character sheet
├── Morse-Trainer/          # Morse code trainer
├── Hexathon/               # Hex color game
└── README.md
```

## Deployment

All projects are designed for GitHub Pages deployment:

1. Push repository to GitHub
2. Enable Pages in repository settings
3. Select deployment branch (usually `main`)
4. Access at `https://github.com/ioloEJ42/ioloEJ42.github.io`

## Customization

- **Dashboard**: Modify links and search engines in `index.html`
- **Portfolio**: Update JSON files in `/Portfolio/data/`
- **D&D Sheet**: Add custom themes in `/DND/styles.css`
- **Morse Trainer**: Extend word lists in `/Morse-Trainer/data.js`
- **Hexathon**: Customize color palettes in `/Hexathon/script.js`

## License

MIT
