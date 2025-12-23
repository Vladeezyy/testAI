#!/usr/bin/env node

/**
 * Script to update all test files to use the new fixtures with automatic screenshot/video capture
 */

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
let skippedCount = 0;

console.log('🔄 Updating test files to use new fixtures...\n');

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
    
    // Check if already using fixtures
    if (content.includes("from '../common/fixtures'")) {
      console.log(`⏭️  Skipped (already updated): ${dir}/${file}`);
      skippedCount++;
      return;
    }
    
    // Replace the import
    const oldImport = "import { test, expect } from '@playwright/test';";
    const newImport = "import { test, expect } from '../common/fixtures';";
    
    if (content.includes(oldImport)) {
      content = content.replace(oldImport, newImport);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${dir}/${file}`);
      updatedCount++;
    } else {
      console.log(`⚠️  No matching import found: ${dir}/${file}`);
      skippedCount++;
    }
  });
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Updated: ${updatedCount} files`);
console.log(`   ⏭️  Skipped: ${skippedCount} files`);
console.log(`\n✨ Done! All test files now use the enhanced fixtures with automatic screenshot/video capture on failure.`);
