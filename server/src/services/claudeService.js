const axios = require('axios');

// Analyze portfolio website using Claude
exports.analyzePortfolio = async (url) => {
  try {
    console.log(`Analyzing portfolio website: ${url}`);
    
    const prompt = `
      Analyze the following portfolio website in detail: ${url}
      
      I need a comprehensive analysis that includes:
      1. Visual design elements and overall aesthetic
      2. Content organization and structure
      3. Key projects or work showcased
      4. Skills, expertise, and technologies mentioned
      5. About section information
      6. Contact information
      
      Format your analysis in a structured way that can be easily used to create a presentation.
    `;
    
    // Force IPv4 by using 127.0.0.1 instead of localhost
    const mcpBaseUrl = 'http://127.0.0.1:11434';
    console.log(`Connecting to MCP at: ${mcpBaseUrl}/mcp`);
    
    // Try multiple endpoints to improve chances of success
    try {
      // First try: Using /mcp endpoint (standard MCP endpoint)
      const response = await axios.post(`${mcpBaseUrl}/mcp`, {
        server_name: "claude",
        tool_name: "generate_text",
        arguments: {
          prompt: prompt,
          max_tokens: 2000,
          temperature: 0.5
        }
      });
      
      if (response.data.error) {
        throw new Error(`Claude MCP error: ${response.data.error}`);
      }
      
      return response.data.text || response.data.content || response.data.completion;
    } catch (error) {
      console.log('First attempt failed, trying fallback method...');
      // Second try: Using /v1/messages endpoint (might work if Claude is using this directly)
      const fallbackResponse = await axios.post(`${mcpBaseUrl}/v1/messages`, {
        model: "claude-3-opus-20240229",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.5
      });
      
      if (fallbackResponse.data.content && fallbackResponse.data.content[0]) {
        return fallbackResponse.data.content[0].text;
      } else {
        throw new Error('Failed to get response from fallback method');
      }
    }
  } catch (error) {
    console.error('Error analyzing portfolio with Claude:', error);
    
    // Provide more detailed error logging
    if (error.response) {
      console.error('Response error details:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Check if the MCP server is running and the port is correct.');
    }
    
    throw new Error(`Failed to analyze portfolio website with Claude: ${error.message}`);
  }
};

// Generate presentation content
exports.generatePresentationContent = async (analysis) => {
  try {
    const prompt = `
      Based on the following analysis of a portfolio website, create a detailed presentation outline:
      
      ${analysis}
      
      Generate a complete presentation structure with:
      1. A compelling title slide
      2. An introduction section (2-3 slides)
      3. Work/projects section (3-5 slides)
      4. Skills and expertise section (1-2 slides)
      5. Contact information slide
      
      For each slide, include:
      - Slide title (preceded by "# " to mark new slides)
      - Main content in bullet points (starting with - or •)
      - Any specific design suggestions
      
      Format your response with clear slide titles prefixed by "# " to mark the start of each slide.
      For example:
      # Portfolio of John Doe
      - Web Developer & Designer
      - Based in New York
      
      # About Me
      - 5+ years of experience in web development
      - Specializing in React and Node.js
      - Passionate about UI/UX design
    `;
    
    // Force IPv4 by using 127.0.0.1 instead of localhost
    const mcpBaseUrl = 'http://127.0.0.1:11434';
    
    // Try multiple endpoints to improve chances of success
    try {
      // First try: Using /mcp endpoint
      const response = await axios.post(`${mcpBaseUrl}/mcp`, {
        server_name: "claude",
        tool_name: "generate_text",
        arguments: {
          prompt: prompt,
          max_tokens: 3000,
          temperature: 0.7
        }
      });
      
      if (response.data.error) {
        throw new Error(`Claude MCP error: ${response.data.error}`);
      }
      
      return response.data.text || response.data.content || response.data.completion;
    } catch (error) {
      console.log('First attempt failed, trying fallback method...');
      // Second try: Using /v1/messages endpoint
      const fallbackResponse = await axios.post(`${mcpBaseUrl}/v1/messages`, {
        model: "claude-3-opus-20240229",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      });
      
      if (fallbackResponse.data.content && fallbackResponse.data.content[0]) {
        return fallbackResponse.data.content[0].text;
      } else {
        throw new Error('Failed to get response from fallback method');
      }
    }
  } catch (error) {
    console.error('Error generating presentation content with Claude:', error);
    throw new Error(`Failed to generate presentation content with Claude: ${error.message}`);
  }
};