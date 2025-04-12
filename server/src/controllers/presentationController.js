const claudeService = require('../services/claudeService');
const presentationService = require('../services/presentationService');

// Generate a presentation from a portfolio URL
exports.generatePresentation = async (req, res, next) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Portfolio URL is required',
      });
    }
    
    // Step 1: Analyze the portfolio website with Claude
    console.log(`Analyzing portfolio website: ${url}`);
    const analysis = await claudeService.analyzePortfolio(url);
    
    // Step 2: Generate presentation content with Claude
    console.log('Generating presentation content');
    const presentationContent = await claudeService.generatePresentationContent(analysis);
    
    // Step 3: Create the presentation file using PowerPoint MCP
    console.log('Creating presentation with PowerPoint MCP');
    const presentationResult = await presentationService.createPresentation(presentationContent);
    
    return res.status(200).json({
      success: true,
      message: 'Presentation created successfully',
      data: presentationResult,
    });
  } catch (error) {
    console.error('Error generating presentation:', error);
    next(error);
  }
};

// Get the status of a presentation generation job
exports.getPresentationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const status = await presentationService.getStatus(id);
    
    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};