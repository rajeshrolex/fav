const fs = require('fs');
const path = require('path');

async function loadApp() {
  try {
    await import('./server.js');
  } catch (err) {
    const errorMsg = `[${new Date().toISOString()}] Startup Error: ${err.stack || err}\n`;
    fs.appendFileSync(path.join(__dirname, 'startup-error.log'), errorMsg);
    console.error('Loader Startup Error:', err);
    process.exit(1);
  }
}

loadApp();
