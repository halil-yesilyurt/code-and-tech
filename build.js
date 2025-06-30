const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment variables to disable telemetry and tracing
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NODE_ENV = 'production';

// Ensure .next directory exists and is writable
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  try {
    // Try to remove any existing trace files
    const traceFile = path.join(nextDir, 'trace');
    if (fs.existsSync(traceFile)) {
      fs.unlinkSync(traceFile);
    }
  } catch (error) {
    console.log('Could not remove trace file, continuing...');
  }
}

try {
  console.log('Starting build process...');
  execSync('npx next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      NODE_ENV: 'production'
    }
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 