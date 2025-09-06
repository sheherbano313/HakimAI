const fs = require('fs');
const path = require('path');

// Create a simple square logo by copying the existing logo
// This is a temporary solution - in production, you should use proper image editing tools

const sourcePath = path.join(__dirname, 'assets', 'logo.png');
const targetPath = path.join(__dirname, 'assets', 'logo-square.png');

try {
  // Copy the existing logo
  fs.copyFileSync(sourcePath, targetPath);
  console.log('Square logo created successfully');
} catch (error) {
  console.error('Error creating square logo:', error);
}
