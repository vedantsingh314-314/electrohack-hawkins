// Import the express package
const express = require('express');

// Create an instance of express
const app = express();

// Define a port for our server to run on
const PORT = 5000;

// Create a test route
// This is what someone sees if they go to "http://localhost:5000/"
app.get('/', (req, res) => {
  res.send('Woohoo! The CampusPool API is live! 🚀');
});

// Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Server is vibing on http://localhost:${PORT}`);
});
