const fs = require('fs');
const path = require('path');

// Write a startup log immediately so we know the process launched
const logFile = path.join(__dirname, 'startup.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(line);
  fs.appendFileSync(logFile, line);
}

log('=== loader.cjs starting ===');
log(`Node version: ${process.version}`);
log(`CWD: ${process.cwd()}`);
log(`__dirname: ${__dirname}`);
log(`PORT env: ${process.env.PORT}`);
log(`DB_HOST env: ${process.env.DB_HOST ? 'SET' : 'NOT SET'}`);
log(`DB_USER env: ${process.env.DB_USER ? 'SET' : 'NOT SET'}`);

async function loadApp() {
  try {
    log('Attempting to import server.js...');
    await import('./server.js');
    log('server.js imported successfully.');
  } catch (err) {
    const errorMsg = `STARTUP ERROR: ${err.stack || err}`;
    log(errorMsg);
    fs.appendFileSync(path.join(__dirname, 'startup-error.log'), `[${new Date().toISOString()}] ${errorMsg}\n`);
    console.error('Loader Startup Error:', err);
    process.exit(1);
  }
}

loadApp();
