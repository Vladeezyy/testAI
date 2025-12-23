#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const testDirs = [
  'tests/AdvancedMC',
  'tests/AdvancedTCA',
  'tests/COM-HPC',
  'tests/CompactPCI',
  'tests/MicroTCA'
];

let updatedCount = 0;
let alreadyCorrect = 0;

console.log('🔄 Updating test owners from "QA Team" to "Vladyslav"...\n');

testDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }
  
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.spec.ts'));
  
  files.forEach(file => {
    const filePath = path.join(fullPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it has QA Team
    if (content.includes("await owner('QA Team')")) {
      // Replace QA Team with Vladyslav
      content = content.replace(/await owner\('QA Team'\);/g, "await owner('Vladyslav');");
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${dir}/${file}`);
      updatedCount++;
    } else if (content.includes("await owner('Vladyslav')")) {
      console.log(`⏭️  Already correct: ${dir}/${file}`);
      alreadyCorrect++;
    } else {
      console.log(`⚠️  No owner found: ${dir}/${file}`);
    }
  });
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Updated: ${updatedCount} files`);
console.log(`   ⏭️  Already correct: ${alreadyCorrect} files`);
console.log(`\n✨ Done! All test owners are now "Vladyslav".`);
