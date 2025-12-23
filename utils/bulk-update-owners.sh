#!/bin/bash

# List of files to update
files=(
  "/Users/vladyslavbilous/Desktop/testAI/tests/CompactPCI/compactpci-2.1.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/CompactPCI/compactpci-2.2.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/CompactPCI/compactpci-2.3.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/CompactPCI/compactpci-3.1.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/CompactPCI/compactpci-3.2.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/CompactPCI/compactpci-3.3.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/MicroTCA/microtca-1.2.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/MicroTCA/microtca-1.3.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/MicroTCA/microtca-2.1.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/MicroTCA/microtca-2.2.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/MicroTCA/microtca-2.3.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/MicroTCA/microtca-3.1.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/MicroTCA/microtca-3.2.spec.ts"
  "/Users/vladyslavbilous/Desktop/testAI/tests/MicroTCA/microtca-3.3.spec.ts"
)

# Update each file
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    sed -i.bak "s/await owner('QA Team');/await owner('Vladyslav');/g" "$file"
    echo "✅ Updated: $(basename $file)"
  else
    echo "⚠️  Not found: $(basename $file)"
  fi
done

echo ""
echo "✨ Done! All test owners updated to 'Vladyslav'."
