import { correctRegistrationProfile, passwordsAreTheSame } from '../utils/validationModule.js';
import { registrationForm } from '../utils/requestToServer.js';
import RegistrationEvents from './registrationEvents.js';

export default class RegistrationModel {
  /**
   * @param {!EventBus}
   * @return {!RegistrationView}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(RegistrationEvents.clickEnter,
      (profile) => this.clickEnter(profile));
  }

  clickEnter(profile) {
    const callError = (message) => {
      this.eventBus.call(RegistrationEvents.registrationError, message);
    };
    if (!correctRegistrationProfile(profile)) {
      callError('Не корректный формат данных');
      return;
    }
    if (!passwordsAreTheSame(profile)) {
      callError('Пароли не совпадают');
      return;
    }
    let timer;
    const messageFromServer = registrationForm(profile)
      .then((response) => {
        switch (response.status) {
          case 200: // - OK (успешный запрос)
          case 308: // - PermanentRedirect (уже залогинен, редирект на главную)
            this.eventBus.call(RegistrationEvents.profile, messageFromServer);
            break;
          case 400: // - BadRequest (неверный запрос)
            callError('BadRequest');
            break;
          case 409: // - Conflict (пользователь с таким ником уже существует)
            callError('Пользователь с таким ником уже существует');
            break;
          default:
            callError('Неизвестная ошибка');
        }
      })
      .finally(() => clearTimeout(timer));
    timer = setTimeout(() => callError('Превышенно время ожидания сервера'), 5 * 1000);
  }
}
