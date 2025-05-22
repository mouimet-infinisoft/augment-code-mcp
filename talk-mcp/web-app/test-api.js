const axios = require('axios');

// Function to send a test message to the API
async function sendTestMessage(text) {
  try {
    const response = await axios.post('http://localhost:3000/api/speak', { text });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    return null;
  }
}

// Example messages to test with
const testMessages = [
  "Hello, this is a test message from the MCP tool.",
  "This text will be converted to speech using the Web Speech API.",
  "You can adjust the voice and speech rate in the web interface.",
  "The Talk MCP tool allows language models to speak to users.",
  "This is a simple demonstration of text-to-speech capabilities."
];

// Send messages with a delay between them
async function runTest() {
  console.log('Starting test...');
  
  for (let i = 0; i < testMessages.length; i++) {
    console.log(`Sending message ${i + 1}/${testMessages.length}: "${testMessages[i]}"`);
    await sendTestMessage(testMessages[i]);
    
    // Wait 5 seconds between messages
    if (i < testMessages.length - 1) {
      console.log('Waiting 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('Test completed!');
}

// Run the test
runTest();
