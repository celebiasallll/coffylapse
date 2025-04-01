/**
 * This script helps reset the installation when there are issues with 
 * Next.js SWC dependencies or lockfile conflicts.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting dependency cleanup and reinstallation for CoffyLapse...');

try {
  // Remove problematic files/folders
  const toRemove = [
    'node_modules',
    '.next',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml'
  ];
  
  toRemove.forEach(item => {
    if (fs.existsSync(item)) {
      console.log(`Removing ${item}...`);
      if (fs.lstatSync(item).isDirectory()) {
        fs.rmSync(item, { recursive: true, force: true });
      } else {
        fs.unlinkSync(item);
      }
    }
  });
  
  // Reinstall dependencies
  console.log('Reinstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Dependency reset completed successfully!');
} catch (error) {
  console.error('Error during reset process:', error.message);
  console.log('Please try resolving the issue manually or contact support.');
  process.exit(1);
}
