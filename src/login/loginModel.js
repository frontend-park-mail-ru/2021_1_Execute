import { correctLoginProfile } from '../utils/validationModule.js';
import { loginForm } from '../utils/requestToServer.js';
import LoginEvents from './loginEvents.js';

export default class LoginModel {
  /**
   * @param {!EventBus}
   * @return {!LoginView}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(LoginEvents.clickEnter,
      (profile) => this.clickEnter(profile));
  }

  clickEnter(profile) {
    const callError = (message = 'Не верный логин или пароль') => this.eventBus.call(LoginEvents.loginError, message);
    if (!correctLoginProfile(profile)) {
      callError();
    } else {
      let timer;
      const messageFromServer = loginForm(profile).then(
        () => {
          clearTimeout(timer);
          this.eventBus.call(LoginEvents.profile, messageFromServer);
        },
      ).catch((err) => callError(err.error));
      timer = setTimeout(() => callError('Превышенно время ожидания сервера'), 5 * 1000);
    }
  }
}
