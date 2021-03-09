import { correctLoginProfile } from '../utils/validationModule.js';
import { loginForm, setCookie } from '../utils/requestToServer.js';
import LoginEvents from './loginEvents.js';

export default class LoginModel {
  /**
   * @param {!EventBus}
   * @return {!LoginView}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(LoginEvents.clickEnter, (profile) => this.clickEnter(profile));
  }

  clickEnter(profile) {
    const callError = (message = 'Не верный логин или пароль') => this.eventBus.call(LoginEvents.loginError, message);
    if (!correctLoginProfile(profile)) {
      callError();
    } else {
      let timer;
      loginForm(profile)
        .then(
          ({ id }) => {
            setCookie('id', id);
            this.eventBus.call(LoginEvents.profile);
          },
        ).catch((err) => callError(err.error))
        .finally(() => clearTimeout(timer));
      timer = setTimeout(() => callError('Превышенно время ожидания сервера'), 5 * 1000);
    }
  }
}
