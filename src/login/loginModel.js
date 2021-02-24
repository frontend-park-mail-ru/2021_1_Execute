import ValidationModule from '../utils/validationModule.js';
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
    this.eventBus.subscribe(LoginEvents.clickGoToRegistration,
      () => this.clickGoToRegistration());
  }

  clickEnter(profile) {
    const status = ValidationModule.correctLoginProfile(profile);
    if (!status.correct) {
      this.eventBus.call(LoginEvents.handleLoginWarning, status);
    }
    switch (this.profile.validate) {
      case ValidationModule.UNCORRECT_PARSE:
        this.eventBus.call(LoginEvents.handleLoginWarning);
        break;
      case ValidationModule.UNCORRECT_SERVERANS:
        this.eventBus.call(LoginEvents.handleLoginError);
        break;
      default:
        this.eventBus.call(LoginEvents.profile);
    }
  }

  clickGoToRegistration() {
    this.eventBus.call(LoginEvents.registration);
  }
}
