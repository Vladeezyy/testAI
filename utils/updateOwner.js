#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const testFiles = [
  'tests/AdvancedMC/advancedmc-1.1.spec.ts',
  'tests/AdvancedMC/advancedmc-1.2.spec.ts',
  'tests/AdvancedMC/advancedmc-1.3.spec.ts',
  'tests/AdvancedMC/advancedmc-2.1.spec.ts',
  'tests/AdvancedMC/advancedmc-2.2.spec.ts',
  'tests/AdvancedMC/advancedmc-2.3.spec.ts',
  'tests/AdvancedMC/advancedmc-3.1.spec.ts',
  'tests/AdvancedMC/advancedmc-3.2.spec.ts',
  'tests/AdvancedMC/advancedmc-3.3.spec.ts',
  'tests/AdvancedTCA/advancedtca-1.1.spec.ts',
  'tests/AdvancedTCA/advancedtca-1.2.spec.ts',
  'tests/AdvancedTCA/advancedtca-1.3.spec.ts',
  'tests/AdvancedTCA/advancedtca-2.1.spec.ts',
  'tests/AdvancedTCA/advancedtca-2.2.spec.ts',
  'tests/AdvancedTCA/advancedtca-2.3.spec.ts',
  'tests/AdvancedTCA/advancedtca-3.1.spec.ts',
  'tests/AdvancedTCA/advancedtca-3.2.spec.ts',
  'tests/AdvancedTCA/advancedtca-3.3.spec.ts',
  'tests/COM-HPC/com-hpc-1.1.spec.ts',
  'tests/COM-HPC/com-hpc-1.2.spec.ts',
  'tests/COM-HPC/com-hpc-1.3.spec.ts',
  'tests/CompactPCI/compactpci-1.1.spec.ts',
  'tests/CompactPCI/compactpci-1.2.spec.ts',
  'tests/CompactPCI/compactpci-1.3.spec.ts',
  'tests/CompactPCI/compactpci-2.1.spec.ts',
  'tests/CompactPCI/compactpci-2.2.spec.ts',
  'tests/CompactPCI/compactpci-2.3.spec.ts',
  'tests/CompactPCI/compactpci-3.1.spec.ts',
  'tests/CompactPCI/compactpci-3.2.spec.ts',
  'tests/CompactPCI/compactpci-3.3.spec.ts',
  'tests/MicroTCA/microtca-1.1.spec.ts',
  'tests/MicroTCA/microtca-1.2.spec.ts',
  'tests/MicroTCA/microtca-1.3.spec.ts',
  'tests/MicroTCA/microtca-2.1.spec.ts',
  'tests/MicroTCA/microtca-2.2.spec.ts',
  'tests/MicroTCA/microtca-2.3.spec.ts',
  'tests/MicroTCA/microtca-3.1.spec.ts',
  'tests/MicroTCA/microtca-3.2.spec.ts',
  'tests/MicroTCA/microtca-3.3.spec.ts'
];

let updatedCount = 0;
let notFoundCount = 0;

console.log('🔄 Updating test owner from "QA Team" to "Vladyslav"...\n');

testFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    notFoundCount++;
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes("owner('QA Team')")) {
    content = content.replace(/owner\('QA Team'\)/g, "owner('Vladyslav')");
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${file}`);
    updatedCount++;
  } else if (content.includes("owner('Vladyslav')")) {
    console.log(`⏭️  Already updated: ${file}`);
  } else {
    console.log(`⚠️  No owner field found: ${file}`);
    notFoundCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Updated: ${updatedCount} files`);
console.log(`   ⚠️  Not found/already updated: ${notFoundCount} files`);
console.log(`\n✨ Done! All test owners updated to "Vladyslav".`);
