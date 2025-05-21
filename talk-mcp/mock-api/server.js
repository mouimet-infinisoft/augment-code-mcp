const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Endpoint to receive text for speech
app.post('/api/speak', (req, res) => {
  const { text } = req.body;
  
  console.log('=== RECEIVED TEXT FROM MCP ===');
  console.log(text);
  console.log('=============================');
  
  // Send a success response
  res.json({ 
    success: true, 
    message: 'Text received successfully',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Mock API server listening at http://localhost:${port}`);
  console.log(`POST to http://localhost:${port}/api/speak to test`);
});
