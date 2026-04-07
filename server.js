const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // If they ask for root, give them index.html
  let filePath = req.url === '/' ? 'index.html' : req.url;
  let fullPath = path.join(__dirname, filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('P1 Container is serving your project at http://localhost:3000');
});const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',  // This allows the browser to load it without complaining
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
});
  res.end('<h1>P1: Cognito Auth Testing Environment</h1><p>Server is running on port 3000</p>');
});

server.listen(3000, '0.0.0.0', () => {
  console.log('P1 Mock Server is live at http://localhost:3000');
});


