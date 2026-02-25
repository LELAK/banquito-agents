const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from dist/webview directory
app.use(express.static(path.join(__dirname, 'dist/webview')));

// Serve the main index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/webview/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🏦 Banquito server running on http://0.0.0.0:${port}`);
  console.log(`📂 Serving files from: ${path.join(__dirname, 'dist/webview')}`);
});