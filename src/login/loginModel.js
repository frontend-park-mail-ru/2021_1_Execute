import { correctLoginProfile } from '../utils/validationModule.js';
import { LoginEvents, LoginMessage } from './loginEvents.js';
import { login, isAuthorized } from '../utils/requestToServer.js';

export default class LoginModel {
  /**
   * @param {!EventBus}
   * @return {!LoginView}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(LoginEvents.clickEnter, (profile) => this.clickEnter(profile));
  }

  checkAuthorization() {
    isAuthorized()
      .then((resp) => {
        if (resp.status === 200) {
          this.eventBus.call(LoginEvents.profile);
        } else {
          this.eventBus.call(LoginEvents.render);
        }
      });
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
