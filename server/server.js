const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.resolve(__dirname, '..', 'src')));
app.use(express.static(path.resolve(__dirname, '..', 'img')));
app.use(express.static(path.resolve(__dirname, '..')));
app.use(express.static(path.resolve(__dirname, '..', '..')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening port ${port}`);
});
