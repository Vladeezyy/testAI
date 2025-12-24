// Run Playwright tests with AI validation enabled
process.env.USE_AI_VALIDATION = 'true';

// Get test path from command line args
const testPath = process.argv[2] || '';

// Import and run Playwright CLI
const { spawn } = require('child_process');

const args = ['test'];
if (testPath) {
  args.push(testPath);
}

// Pass through any additional args
if (process.argv.length > 3) {
  args.push(...process.argv.slice(3));
}

const playwright = spawn('npx', ['playwright', ...args], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, USE_AI_VALIDATION: 'true' }
});

playwright.on('close', (code) => {
  process.exit(code);
});
