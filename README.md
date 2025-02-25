# Terminal Portfolio

A terminal-themed portfolio website with a custom browser dashboard. This project features a minimal, ultra-fast loading experience styled to look like a traditional Linux terminal.

## Features

### Dashboard
- Custom browser homepage/new tab replacement
- Search functionality with multiple engine options
- Categorized links
- Dark theme with grid background

### Terminal Portfolio
- Interactive terminal interface
- Simulated SSH sessions
- Real terminal commands and responses
- Blog and project display as terminal output
- Contact form styled as shell script input

### Technical Details
- Built with vanilla HTML, CSS, and JavaScript
- No frameworks or build tools
- JSON-based content management
- Optimized for near-zero loading times
- JetBrains Mono font for authentic terminal look
- Responsive design for all device sizes

## Structure

- `index.html` - Custom browser dashboard
- `/portfolio/` - Terminal-themed portfolio website
  - `index.html` - Portfolio homepage
  - `projects.html` - Projects listing as terminal output
  - `blogs.html` - Blog posts as terminal output
  - `project.html` - Project detail with README.md simulation
  - `blog.html` - Blog post detail with less command simulation
  - `contact.html` - Contact form as shell script
  - `/data/` - JSON data files for content

## Development

### Prerequisites
- A web server for local development (to avoid CORS issues)
- Basic knowledge of HTML, CSS, and JavaScript

### Setting Up Local Development
```bash
# Using Python's built-in HTTP server
python -m http.server

# Or using Node.js http-server
npx http-server
```

### Editing Content
1. Update JSON files in the `/portfolio/data/` directory to modify your content
2. The portfolio automatically loads content from these JSON files
3. Add new projects and blog posts by creating new JSON files

## Deployment

This site is designed to be deployed to GitHub Pages:

1. Push the repository to GitHub
2. Go to repository Settings > Pages
3. Select the branch you want to deploy from (usually `main`)
4. Your site will be available at `https://[username].github.io/[repository]`

## Customization

- Edit the JSON files to update content
- Modify CSS variables in `portfolio/styles.css` to change the terminal colors
- Update terminal command simulations in components.js

## License

MIT