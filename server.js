import ValidationModule from './src/utils/validationModule.js';
import { ServerWays } from './src/utils/requestToServer.js';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '.', 'src')));
app.use(body.json());
app.use(cookie());

const users = {
  ZhukDima: {
    email: 'zhukdo@gmail.com',
    photo: '/img/32.png',
    password: '123456',
  },
  Skaliks: {
    email: 'zhukdo@yandex.ru',
    photo: '/img/35.png',
    password: '654321',
  },
  Anonim: {
    email: 'anon@mail.ru',
    password: '123123',
  },
};
const ids = {};

app.post(ServerWays.loginForm, (req, res) => {
  const profile = req.body;
  if (!ValidationModule.correctLoginProfile(profile)) {
    return res.status(400).json({ error: 'Не валидные данные пользователя' });
  }
  const { username, password } = profile;

  if (!users[username] || users[username].password !== password) {
    return res.status(400).json({ error: 'Не верный E-Mail и/или пароль' });
  }

  const id = uuid();
  ids[id] = username;

  res.cookie('login', id, { expires: new Date(Date.now() + 1000 * 60 * 10) });
  return res.status(200).json({ id });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/src/index.html`));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening port ${port}`);
});
