// server/src/scripts/test-mcp-connection.js
const axios = require('axios');
const mcpConfig = require('../config/mcpConfig');

// Test connection to MCP server
async function testMcpConnection() {
  console.log('Testing MCP connection...');
  console.log(`MCP URL: ${mcpConfig.MCP_URL}`);
  
  try {
    // Check basic connectivity
    try {
      const response = await axios.get(`${mcpConfig.MCP_URL}/health`, { timeout: 5000 });
      console.log('✅ MCP server is reachable');
      console.log('Health response:', response.data);
    } catch (error) {
      console.log('❌ Failed to reach MCP server health endpoint');
      if (error.code === 'ECONNREFUSED') {
        console.log('   Connection refused. Check if the server is running.');
      } else {
        console.log('   Error:', error.message);
      }
    }
    
    // Test Claude MCP
    console.log('\nTesting Claude MCP...');
    try {
      const response = await axios.post(`${mcpConfig.MCP_URL}/mcp`, {
        server_name: mcpConfig.MCP_SERVERS.CLAUDE,
        tool_name: "generate_text",
        arguments: {
          prompt: "Say hello",
          max_tokens: 100,
          temperature: 0.5
        }
      }, { timeout: 10000 });
      
      if (response.data.error) {
        console.log('❌ Claude MCP returned an error:', response.data.error);
      } else {
        console.log('✅ Claude MCP is working!');
        console.log('   Response:', response.data.text || response.data.content || response.data.completion);
      }
    } catch (error) {
      console.log('❌ Failed to call Claude MCP');
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', error.response.data);
      } else {
        console.log('   Error:', error.message);
      }
    }
    
    // Test PowerPoint MCP
    console.log('\nTesting PowerPoint MCP...');
    try {
      const response = await axios.post(`${mcpConfig.MCP_URL}/mcp`, {
        server_name: mcpConfig.MCP_SERVERS.POWERPOINT,
        tool_name: "create_presentation",
        arguments: {}
      }, { timeout: 10000 });
      
      if (response.data.error) {
        console.log('❌ PowerPoint MCP returned an error:', response.data.error);
      } else {
        console.log('✅ PowerPoint MCP is working!');
        console.log('   Presentation ID:', response.data.presentation_id);
      }
    } catch (error) {
      console.log('❌ Failed to call PowerPoint MCP');
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', error.response.data);
      } else {
        console.log('   Error:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Error testing MCP connection:', error);
  }
}

// Execute if this file is run directly
if (require.main === module) {
  testMcpConnection()
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

module.exports = { testMcpConnection };