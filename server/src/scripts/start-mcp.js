// server/src/scripts/start-mcp.js
const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const mcpConfig = require('../config/mcpConfig');

// Check if MCP server is running
async function checkMcpServer() {
  try {
    // Send a simple request to check if the server is responding
    await axios.get(`${mcpConfig.MCP_URL}/health`, { timeout: 3000 });
    return true;
  } catch (error) {
    return false;
  }
}

// Start the MCP server if not already running
async function startMcpServer() {
  const isRunning = await checkMcpServer();
  
  if (isRunning) {
    console.log('MCP server is already running.');
    return true;
  }
  
  console.log('Starting MCP server...');
  
  // This script assumes Python is installed and the MCP server code is in the correct path
  // Adjust the paths and commands as needed for your environment
  const mcpProcess = spawn('python', ['../../ppt-mcp-server.py'], {
    cwd: __dirname,
    stdio: 'inherit',
    detached: true
  });
  
  mcpProcess.unref(); // Allow the process to run independently of the parent
  
  console.log('MCP server process started with PID:', mcpProcess.pid);
  
  // Write PID to file for later management
  fs.writeFileSync(path.join(__dirname, 'mcp-pid.txt'), mcpProcess.pid.toString());
  
  // Wait a moment for the server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Check if it's running now
  const started = await checkMcpServer();
  if (started) {
    console.log('MCP server started successfully!');
    return true;
  } else {
    console.error('Failed to start MCP server. Check the MCP server logs for details.');
    return false;
  }
}

// Execute if this file is run directly
if (require.main === module) {
  startMcpServer()
    .then(success => {
      if (!success) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Error starting MCP server:', error);
      process.exit(1);
    });
}

module.exports = { checkMcpServer, startMcpServer };