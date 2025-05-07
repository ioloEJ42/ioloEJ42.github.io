const { execSync } = require('child_process');
const path = require('path');

// Run the filesystem generation
console.log('Generating filesystem.json...');
require('./generate-fs.js');

// Add and commit the changes if any
try {
    // Check if there are changes to filesystem.json
    const status = execSync('git status --porcelain portfolio/data/filesystem.json').toString();
    
    if (status) {
        console.log('Changes detected in filesystem.json');
        console.log('Adding and committing changes...');
        
        execSync('git add portfolio/data/filesystem.json');
        execSync('git commit -m "Update filesystem.json"');
        
        console.log('Changes committed successfully!');
        console.log('Remember to push the changes to GitHub.');
    } else {
        console.log('No changes detected in filesystem.json');
    }
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
} 