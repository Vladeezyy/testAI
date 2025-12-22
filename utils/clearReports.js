const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '../test-results/reports');
const htmlReportDir = path.join(__dirname, '../test-results/html-report');
const artifactsDir = path.join(__dirname, '../test-results/artifacts');

console.log('🗑️  Cleaning up test results...\n');

// Function to clear directory
function clearDirectory(dir, dirName) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
    console.log(`✅ Cleared ${dirName}`);
  } else {
    console.log(`ℹ️  ${dirName} doesn't exist yet`);
  }
}

// Clear all test result directories
clearDirectory(reportsDir, 'Custom Reports');
clearDirectory(htmlReportDir, 'HTML Report');
clearDirectory(artifactsDir, 'Test Artifacts');

console.log('\n✨ Cleanup complete!\n');
