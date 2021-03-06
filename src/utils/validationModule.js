import { ProfileMessage } from '../profile/profileEvents.js';

/**
 * Проверка корректности строки как имени пользователя
 * @param {string} username
 * @return {boolean}
 */
export const correctUserName = (username) => typeof username === 'string'
  && username.match(/^[a-zA-Z0-9]+.{6,16}$/) !== null;

/**
 * Проверка корректности строки как e-mail
 * @param {string} email
 * @return {boolean}
 */
export const correctEmail = (email) => typeof email === 'string'
  && email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
  !== null;

/**
 * Проверка корректности строки как пароля
 * @param {string} password
 * @return {boolean}
 */
export const correctPassword = (password) => typeof password === 'string'
  && password.match(/.{6,16}$/) !== null;

/**
 * Проверка корректности данных пользователя при логине
 * @param {Object} profile
 * @param {string} profile.username
 * @param {string} profile.password
 * @return {boolean}
 */
export const correctLoginProfile = (profile) => typeof profile === 'object'
  && profile !== null
  && correctEmail(profile.email)
  && correctPassword(profile.password);

/**
* Проверка корректности данных пользователя при изменении профиля
* @param {Object} profile
* @param {string} profile.email
* @param {string} profile.username
* @param {string} profile.password
* @param {string} profile.repeatPassword
* @return {boolean}
*/
export const correctChangeProfile = (profile, callError) => {
  if (!correctUserName(profile.username)) {
    callError(ProfileMessage.usernameErrorValidation);
    return false;
  }
  if (!correctEmail(profile.email)) {
    callError(ProfileMessage.emailErrorValidation);
    return false;
  }
  if (profile.password !== '') {
    if (!correctPassword(profile.password)) {
      callError(ProfileMessage.passwordErrorValidation);
      return false;
    }
    if (profile.password !== profile.repeatPassword) {
      callError(ProfileMessage.repeatPasswordErrorValidation);
      return false;
    }
  }
  return true;
};

/**
 * Проверка корректности данных пользователя при регистрации
 * @param {Object} profile
 * @param {string} profile.email
 * @param {string} profile.username
 * @param {string} profile.password
 * @param {string} profile.repeatPassword
 * @return {boolean}
 */
export const correctRegistrationProfile = (profile) => typeof profile === 'object'
  && profile !== null
  && correctEmail(profile.email)
  && correctUserName(profile.username)
  && correctPassword(profile.repeatPassword)
  && correctPassword(profile.password);

export const passwordsAreTheSame = (profile) => typeof profile === 'object'
  && profile !== null
  && correctPassword(profile.repeatPassword) === correctPassword(profile.password);
