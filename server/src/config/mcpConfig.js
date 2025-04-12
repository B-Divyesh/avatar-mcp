// Configuration for MCP servers
module.exports = {
    // MCP API URL (typically running on port 11434)
    MCP_URL: process.env.MCP_URL || 'http://localhost:11434',
    
    // Server names in the MCP
    MCP_SERVERS: {
      CLAUDE: 'claude',
      POWERPOINT: 'ppt'
    }
  };