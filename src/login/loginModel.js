import { correctLoginProfile } from '../utils/validationModule.js';
import { login } from '../utils/requestToServer.js';
import { LoginEvents, LoginMessage } from './loginEvents.js';

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
    const callError = (message) => this.eventBus.call(LoginEvents.loginError, message);
    if (!correctLoginProfile(profile)) {
      callError(LoginMessage.errorValidation);
    } else {
      this.eventBus.call(LoginEvents.loginWait, LoginMessage.waitData);
      login(profile)
        .then((resp) => {
          switch (resp.status) {
            case 200:
              this.eventBus.call(LoginEvents.profile);
              break;
            case 400:
              callError(LoginMessage.unknownError);
              break;
            case 403:
              callError(LoginMessage.errorValidation);
              break;
            default:
              callError(LoginMessage.unknownError);
          }
        });
    }
  }
}
