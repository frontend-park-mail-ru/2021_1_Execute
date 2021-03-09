const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const { randomInt } = require('crypto');
const { correctLoginProfile } = require('./validationModule.js');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.resolve(__dirname, '..', 'src')));
app.use(express.static(path.resolve(__dirname, '..', 'img')));
app.use(express.static(path.resolve(__dirname, '..')));
app.use(body.json());
app.use(cookie());

const users = {
  ZhukDima: {
    email: 'zhukdo@gmail.com',
    photo: '/32.jpg',
    password: '123456',
  },
  Skaliks: {
    email: 'zhukdo@yandex.ru',
    photo: '/35.jpg',
    password: '654321',
  },
  Anonim: {
    email: 'anon@mail.ru',
    photo: '/not-available.png',
    password: '123123',
  },
};
const ids = {};

const ApiRoutes = {
  loginForm: '/api/login',
  login: '/login',
  profileForm: '/api/profile',
  profile: '/profile',
};

app.post(ApiRoutes.loginForm, (req, res) => {
  const { username, password } = req.body;
  if (!correctLoginProfile({ username, password })) {
    return res.status(200).json({ error: 'Не валидные данные пользователя' });
  }

  if (!users[username] || users[username].password !== password) {
    return res.status(200).json({ error: 'Не верный E-Mail и/или пароль' });
  }

  const id = randomInt(281474976710655);
  ids[id] = username;

  // res.cookie('id', id, { expires: new Date(Date.now() + 1000 * 60 * 10) });
  return res.status(200).json({ id });
});

app.post(ApiRoutes.profileForm, (req, res) => res.status(200).json({ message: 'Данные изменены' }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html'));
});

app.get(ApiRoutes.login, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html'));
});

app.get(ApiRoutes.profile, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening port ${port}`);
});
