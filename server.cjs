// server.cjs - Universal entry point for Render and production deployments
const fs = require('fs');
const path = require('path');

const distServer = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(distServer)) {
  require(distServer);
} else {
  console.log('Production build not found. Building application...');
  try {
    const { execSync } = require('child_process');
    execSync('npx vite build && npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs', { stdio: 'inherit' });
    if (fs.existsSync(distServer)) {
      require(distServer);
    } else {
      console.error('Failed to generate dist/server.cjs');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error during auto-build:', err);
    process.exit(1);
  }
}
