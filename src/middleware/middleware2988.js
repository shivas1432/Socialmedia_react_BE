// Middleware 2988 - Socialmedia_react_BE
const middleware2988 = (req, res, next) => {
  try {
    // Add middleware logic
    req.middlewareId = 2988;
    req.processedAt = new Date();
    
    // Log request
    console.log('Middleware 2988 processed request:', req.url);
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Middleware error: ' + error.message
    });
  }
};

module.exports = middleware2988;
