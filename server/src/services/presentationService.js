const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Create presentation using PowerPoint MCP server
exports.createPresentation = async (content) => {
  try {
    // Create a temporary directory for the presentation files
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'avatar-presentation-'));
    const presentationPath = path.join(tempDir, 'presentation.pptx');
    
    console.log('Creating presentation using PowerPoint MCP server');
    
    // Parse the content to extract slides
    const slides = parseSlides(content);
    
    // Force IPv4 by using 127.0.0.1 instead of localhost
    const mcpBaseUrl = 'http://127.0.0.1:11434';
    
    // Step 1: Create new presentation
    console.log('Creating new presentation');
    const createResult = await useMcpTool(mcpBaseUrl, "ppt", "create_presentation", {});
    const presentationId = createResult.presentation_id;
    console.log(`Created presentation with ID: ${presentationId}`);
    
    // Step 2: Add title slide
    console.log('Adding title slide');
    const titleSlideResult = await useMcpTool(mcpBaseUrl, "ppt", "add_slide", {
      layout_index: 0, // Title slide layout
      title: slides[0].title || "Portfolio Presentation",
      presentation_id: presentationId
    });
    
    // Add subtitle if there's content in the first slide
    if (slides[0].content) {
      await useMcpTool(mcpBaseUrl, "ppt", "populate_placeholder", {
        slide_index: titleSlideResult.slide_index,
        placeholder_idx: 1, // Subtitle placeholder
        text: slides[0].content,
        presentation_id: presentationId
      });
    }
    
    // Step 3: Add remaining slides
    for (let i = 1; i < slides.length; i++) {
      const slide = slides[i];
      console.log(`Adding slide ${i}: ${slide.title}`);
      
      // Add slide with title
      const slideResult = await useMcpTool(mcpBaseUrl, "ppt", "add_slide", {
        layout_index: 1, // Content slide layout
        title: slide.title,
        presentation_id: presentationId
      });
      
      // Convert content to bullet points if there's any content
      if (slide.content) {
        const bulletPoints = slide.content
          .split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
          .map(line => line.trim().replace(/^[•-]\s*/, ''))
          .filter(line => line.length > 0);
        
        // If we found bullet points, add them
        if (bulletPoints.length > 0) {
          await useMcpTool(mcpBaseUrl, "ppt", "add_bullet_points", {
            slide_index: slideResult.slide_index,
            placeholder_idx: 1, // Usually the main content placeholder
            bullet_points: bulletPoints,
            presentation_id: presentationId
          });
        } else {
          // If no bullet points were found, add content as a textbox
          await useMcpTool(mcpBaseUrl, "ppt", "add_textbox", {
            slide_index: slideResult.slide_index,
            left: 1.0,
            top: 2.0,
            width: 8.0,
            height: 4.5,
            text: slide.content,
            presentation_id: presentationId
          });
        }
      }
    }
    
    // Step 4: Save the presentation
    console.log(`Saving presentation to: ${presentationPath}`);
    await useMcpTool(mcpBaseUrl, "ppt", "save_presentation", {
      file_path: presentationPath,
      presentation_id: presentationId
    });
    
    // Step 5: Open the presentation
    if (os.platform() === 'win32') {
      const { exec } = require('child_process');
      exec(`start "" "${presentationPath}"`);
    } else {
      const { exec } = require('child_process');
      exec(`xdg-open "${presentationPath}"`);
    }
    
    return {
      type: 'powerpoint',
      path: presentationPath,
      presentation_id: presentationId
    };
  } catch (error) {
    console.error('Error creating presentation:', error);
    throw new Error('Failed to create presentation: ' + error.message);
  }
};

// Get presentation generation status
exports.getStatus = async (id) => {
  try {
    // Force IPv4 by using 127.0.0.1 instead of localhost
    const mcpBaseUrl = 'http://127.0.0.1:11434';
    
    // Get information about the presentation
    const info = await useMcpTool(mcpBaseUrl, "ppt", "get_presentation_info", {
      presentation_id: id
    });
    
    return {
      id,
      status: 'completed',
      progress: 100,
      slides_count: info.slides_count,
      file_path: info.file_path || 'Not saved yet'
    };
  } catch (error) {
    console.error('Error getting presentation status:', error);
    return {
      id,
      status: 'error',
      error: error.message
    };
  }
};

// Helper function to parse slides from Claude-generated content
function parseSlides(content) {
  // Split content by slide markers (assuming # denotes a new slide)
  const slideSections = content.split(/(?=^# )/m);
  
  return slideSections.map(section => {
    const lines = section.trim().split('\n');
    let title = '';
    let content = '';
    
    if (lines.length > 0) {
      // Extract title (remove # prefix if present)
      title = lines[0].replace(/^#\s+/, '').trim();
      
      // Join remaining lines as content
      if (lines.length > 1) {
        content = lines.slice(1).join('\n').trim();
      }
    }
    
    return { title, content };
  }).filter(slide => slide.title); // Filter out any empty slides
}

// Helper function to call MCP tools
async function useMcpTool(baseUrl, serverName, toolName, arguments) {
  try {
    console.log(`Calling MCP tool: ${serverName}.${toolName}`);
    const response = await axios.post(`${baseUrl}/mcp`, {
      server_name: serverName,
      tool_name: toolName,
      arguments: arguments
    });
    
    if (response.data.error) {
      throw new Error(`MCP error: ${response.data.error}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error calling MCP tool ${serverName}.${toolName}:`, error);
    throw new Error(`Failed to call MCP tool: ${error.message}`);
  }
}