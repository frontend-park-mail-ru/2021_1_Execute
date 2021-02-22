const http = require('http');
const fs = require('fs');

const host = '127.0.0.1';
const port = 3000;
const date = { now: Date.now() };

const mimeTypes = {
  html: 'text/html',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  ico: 'image/ico',
  svg: 'image/svg+xml',
  json: 'application/json',
  js: 'text/javascript',
  css: 'text/css',
};

const defineSites = ['/', '/login', '/profile', '/registration'];

function consoleLogWithData(...message) {
  if (Date.now() - date.now > 0.2 * 1000) {
    // eslint-disable-next-line no-console
    console.log();
  }
  date.now = Date.now();
  // eslint-disable-next-line no-console
  console.log((new Date()).toLocaleTimeString('ru'), ...message);
}

const server = http.createServer((req, res) => {
  consoleLogWithData('url', req.url);
  if (defineSites.includes(req.url)) {
    req.url = './src/index.html';
  } else if (req.url.split('/')[1] !== 'img') {
    req.url = `./src${req.url}`;
  } else {
    req.url = `.${req.url}`;
  }

  fs.readFile(req.url, (err, data) => {
    if (err) {
      consoleLogWithData('read-error', req.url, err);
    } else {
      const type = mimeTypes[req.url.split('.').pop()];
      if (type !== undefined) {
        res.setHeader('Content-Type', type);
      } else {
        consoleLogWithData('type-error', req.url);
      }
      res.write(data);
    }
    res.end();
  });
});
server.listen(port, host, () => {
  consoleLogWithData(`Server running on http://${host}:${port}`);
});
