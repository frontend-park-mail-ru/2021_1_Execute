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
    this.eventBus.subscribe(LoginEvents.clickEnter, (profile) => this.clickEnter(profile));
  }

  clickEnter(profile) {
    const callError = (message = 'Неверная почта или пароль') => this.eventBus.call(LoginEvents.loginError, message);
    if (!correctLoginProfile(profile)) {
      callError();
    } else {
      loginForm(profile)
        .then((resp) => {
          switch (resp.status) {
            case 200:
              this.eventBus.call(LoginEvents.profile);
              break;
            case 400:
              callError('Неверный запрос');
              break;
            case 403:
              callError();
              break;
            default:
              callError('Неизвестная ошибка');
          }
        });
    }
  }
}
