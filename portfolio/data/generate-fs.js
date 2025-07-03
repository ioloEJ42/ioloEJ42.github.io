const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const EXCLUDED_DIRS = ['.git', 'node_modules'];
const EXCLUDED_FILES = ['generate-fs.js', 'filesystem.json'];

function isTextFile(filePath) {
    const textExtensions = ['.txt', '.md', '.js', '.css', '.html', '.json', '.svg'];
    return textExtensions.includes(path.extname(filePath).toLowerCase());
}

function escapeHtml(text) { 
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function readFileContent(filePath) {
    if (!isTextFile(filePath)) {
        return '[Binary File]';
    }
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Always escape HTML content when reading files
        return escapeHtml(content);
    } catch (error) {
        console.warn(`Could not read file ${filePath}:`, error);
        return '[Error reading file]';
    }
}

function buildFileSystem(currentPath, relativePath = '') {
    const items = fs.readdirSync(currentPath);
    const structure = {};

    for (const item of items) {
        if (EXCLUDED_DIRS.includes(item) || EXCLUDED_FILES.includes(item)) continue;

        const fullPath = path.join(currentPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            structure[item] = buildFileSystem(fullPath, path.join(relativePath, item));
        } else {
            // For files, store their content
            structure[item] = readFileContent(fullPath);
        }
    }

    return structure;
}

function generateFileSystem() {
    // Start directly with the portfolio directory as root
    const fileSystem = buildFileSystem(ROOT_DIR);

    // Add some system files at the root level
    fileSystem['.motd'] = 'Welcome to the Portfolio Terminal Interface\n\nType \'help\' to see available commands\n';
    fileSystem['.issue'] = 'Portfolio Terminal v1.0.0\n';

    return fileSystem;
}

// Generate and save the filesystem
const fileSystem = generateFileSystem();
fs.writeFileSync(
    path.join(__dirname, 'filesystem.json'),
    JSON.stringify(fileSystem, null, 2)
);

console.log('filesystem.json has been generated successfully!'); 