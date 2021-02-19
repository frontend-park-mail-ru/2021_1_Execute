const http = require('http');
const fs = require('fs');

const host = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  req.url = `.${req.url}`;
  console.log('url', req.url);
  fs.readFile(req.url, (err, data) => {
    if (err) {
      console.log('error', err);
    } else {
      res.write(data);
    }
    res.end();
  });
});
server.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
