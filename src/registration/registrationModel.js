import {
  correctRegistrationProfile, passwordsAreTheSame,
} from '../utils/validationModule.js';
import { registration } from '../utils/requestToServer.js';
import RegistrationEvents from './registrationEvents.js';

export default class RegistrationModel {
  /**
   * @param {!EventBus}
   * @return {!RegistrationModel}
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
    const validationError = correctRegistrationProfile(profile);
    if (validationError) {
      callError(validationError);
      return;
    }
    if (!passwordsAreTheSame(profile)) {
      callError('Пароли не совпадают');
      return;
    }
    registration(profile)
      .then((req) => ({ status: req.status, obj: req }))
      .then((response) => {
        switch (response.status) {
          case 200:
          case 308:
            this.eventBus.call(RegistrationEvents.profile);
            break;
          case 400:
            callError('BadRequest');
            break;
          case 409:
            callError('Пользователь с таким email уже существует');
            break;
          default:
            callError('Неизвестная ошибка');
        }
      });
  }
}
