const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = `.${req.url}`;

  // Si la ruta es solo '/', redireccionar a 'index.html'
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile('./404.html', (err, notFoundContent) =>{
          res.writeHead(404, {'Content-Type': 'text/html'});
          res.end(notFoundContent, 'utf-8');
        });
      }else {
        res.writeHead(500);
        res.end(`Internal Server Error: ${err.code}`);
      }
    }else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
    });
});

const PORT = 8888;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});