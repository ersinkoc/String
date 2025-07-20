#!/usr/bin/env node

/**
 * @oxog/string - Publish Script
 * 
 * Interactive script for publishing the package to NPM with proper validation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔄 ${description}...`, 'cyan');
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log(`✅ ${description} completed successfully`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

function checkPrerequisites() {
  log('🔍 Checking prerequisites...', 'yellow');
  
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    log('❌ package.json not found. Make sure you\'re in the project root.', 'red');
    process.exit(1);
  }
  
  // Check if dist directory exists
  if (!fs.existsSync('dist')) {
    log('⚠️  dist directory not found. Will build first.', 'yellow');
    return false;
  }
  
  log('✅ Prerequisites check passed', 'green');
  return true;
}

function showPackageInfo() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  log('\n📦 Package Information:', 'magenta');
  log(`Name: ${packageJson.name}`, 'bright');
  log(`Version: ${packageJson.version}`, 'bright');
  log(`Description: ${packageJson.description}`, 'bright');
  log(`Author: ${packageJson.author}`, 'bright');
  return packageJson;
}

function showFiles() {
  log('\n📁 Files to be published:', 'magenta');
  try {
    const output = execSync('npm pack --dry-run', { encoding: 'utf8' });
    console.log(output);
  } catch (error) {
    log('❌ Could not preview files', 'red');
  }
}

async function askConfirmation(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${question} (y/N): ${colors.reset}`, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

function validateEnvironment() {
  log('\n🔐 Validating environment...', 'yellow');
  
  try {
    // Check if user is logged in to npm
    execSync('npm whoami', { stdio: 'pipe' });
    log('✅ NPM authentication verified', 'green');
  } catch (error) {
    log('❌ Not logged in to NPM. Please run "npm login" first.', 'red');
    process.exit(1);
  }
  
  // Check if package name is available (for first publish)
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    execSync(`npm view ${packageJson.name}`, { stdio: 'pipe' });
    log(`ℹ️  Package ${packageJson.name} already exists on NPM`, 'blue');
  } catch (error) {
    log(`✅ Package name ${packageJson.name} is available`, 'green');
  }
}

function runTests() {
  log('\n🧪 Running comprehensive tests...', 'yellow');
  
  const testCommands = [
    { cmd: 'npm run typecheck', desc: 'TypeScript type checking' },
    { cmd: 'npm run test:ci', desc: 'Running test suite with coverage' }
  ];
  
  for (const { cmd, desc } of testCommands) {
    if (!runCommand(cmd, desc)) {
      log('❌ Tests failed. Please fix issues before publishing.', 'red');
      process.exit(1);
    }
  }
}

function buildPackage() {
  log('\n🔨 Building package...', 'yellow');
  
  if (!runCommand('npm run build', 'Building all targets (CJS, ESM, Types)')) {
    log('❌ Build failed. Please fix build issues before publishing.', 'red');
    process.exit(1);
  }
  
  // Verify build outputs
  const requiredFiles = [
    'dist/cjs/index.js',
    'dist/esm/index.js',
    'dist/types/index.d.ts'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      log(`❌ Required file ${file} not found after build`, 'red');
      process.exit(1);
    }
  }
  
  log('✅ All build outputs verified', 'green');
}

function testExamples() {
  log('\n📚 Testing examples...', 'yellow');
  
  const exampleCommands = [
    { cmd: 'npm run examples:basic', desc: 'Basic usage examples' },
    { cmd: 'npm run examples:plugins', desc: 'Plugin development examples' }
  ];
  
  for (const { cmd, desc } of exampleCommands) {
    if (!runCommand(cmd, desc)) {
      log(`⚠️  Example test failed: ${desc}`, 'yellow');
      // Continue anyway, examples are not critical for publishing
    }
  }
}

async function publish(packageJson) {
  log('\n🚀 Publishing to NPM...', 'yellow');
  
  const publishCmd = 'npm publish --access public';
  
  if (!runCommand(publishCmd, 'Publishing package')) {
    log('❌ Publish failed', 'red');
    process.exit(1);
  }
  
  log('\n🎉 Package published successfully!', 'green');
  log(`📦 ${packageJson.name}@${packageJson.version} is now available on NPM`, 'bright');
  log(`🔗 https://www.npmjs.com/package/${packageJson.name}`, 'blue');
}

async function main() {
  log('🚀 @oxog/string - NPM Publish Script', 'bright');
  log('=====================================\n', 'bright');
  
  // Show package info
  const packageJson = showPackageInfo();
  
  // Check prerequisites
  const hasBuiltFiles = checkPrerequisites();
  
  // Validate environment
  validateEnvironment();
  
  // Ask for confirmation before proceeding
  if (!await askConfirmation('Do you want to proceed with the publish process?')) {
    log('❌ Publish cancelled by user', 'yellow');
    process.exit(0);
  }
  
  // Run tests
  runTests();
  
  // Build if needed
  if (!hasBuiltFiles) {
    buildPackage();
  } else {
    log('✅ Using existing build files', 'green');
  }
  
  // Test examples
  testExamples();
  
  // Show files to be published
  showFiles();
  
  // Final confirmation
  if (!await askConfirmation(`Are you sure you want to publish ${packageJson.name}@${packageJson.version}?`)) {
    log('❌ Publish cancelled by user', 'yellow');
    process.exit(0);
  }
  
  // Publish
  await publish(packageJson);
  
  log('\n🎯 Publish completed successfully!', 'green');
  log('Thank you for using @oxog/string publish script!', 'cyan');
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  log(`❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  log(`❌ Unhandled promise rejection: ${error.message}`, 'red');
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  log(`❌ Script failed: ${error.message}`, 'red');
  process.exit(1);
});