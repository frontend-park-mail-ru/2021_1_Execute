import ValidationModule from '../validation/validation.js';

export default class LoginModel {
  /**
   * @param {!EventBus}
   * @return {!LoginView}
   */
  constructor(eventBus, profile) {
    this.eventBus = eventBus;
    this.profile = profile;
    this.eventBus.subscribe('clickEnter', (username, password) => this.enter(username, password));
    this.eventBus.subscribe('clickGotoRegistration', () => this.gotoRegistration());
  }

  enter(username, password) {
    Object.entries({ username, password }).forEach(([key, value]) => {
      this.profile[key] = value;
    });
    ValidationModule.correctLoginProfile(this.profile);
    switch (this.profile.validate) {
      case ValidationModule.UNCORRECT_PARSE:
        this.eventBus.call('login-warning');
        break;
      case ValidationModule.UNCORRECT_SERVERANS:
        this.eventBus.call('login-error');
        break;
      default:
        this.eventBus.call('profile');
    }
  }

  gotoRegistration() {
    this.eventBus.call('registration');
  }
}
