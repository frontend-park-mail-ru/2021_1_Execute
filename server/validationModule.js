/**
 * Проверка корректности строки как имени пользователя
 * @param profile
 * @return {boolean}
 */
const correctUserName = (username) => typeof username === 'string'
  && username.match(/^[a-zA-Z0-9]+.{6,16}$/) !== null;

/**
 * Проверка корректности строки как e-mail
 * @param profile
 * @return {boolean}
 */
const correctEmail = (email) => typeof email === 'string'
  && email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
  !== null;

/**
 * Проверка корректности строки как пароля
 * @param profile
 * @return {boolean}
 */
const correctPassword = (password) => typeof password === 'string'
  && password.match(/.{6,16}$/) !== null;

/**
 * Проверка корректности данных пользователя при логине
 * @param profile
 * @return {boolean}
 */
const correctLoginProfile = (profile) => correctUserName(profile.username)
  && correctPassword(profile.password);

module.exports = {
  correctUserName, correctEmail, correctPassword, correctLoginProfile,
};
