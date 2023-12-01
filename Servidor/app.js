const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

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

  if (req.method === 'POST' && req.url === '/procesar_opinion') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const comentario = parse(body).comentario + '\n';

      // Aquí puedes escribir el comentario en tu archivo comentarios.txt
      fs.appendFile('comentarios.txt', comentario, (err) => {
        if (err) {
          console.error('Error al guardar el comentario:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Comentario guardado exitosamente');
        }
      });
    });
  } else {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.readFile('./404.html', (err, notFoundContent) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(notFoundContent, 'utf-8');
          });
        } else {
          res.writeHead(500);
          res.end(`Internal Server Error: ${err.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

const PORT = 8888;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
