import ValidationModule from '../validation/validation.js';

export default class ProfileModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus, profile) {
    this.eventBus = eventBus;
    this.profile = profile;
    this.eventBus.subscribe('clickEnter', (...data) => this.enter(...data));
    this.eventBus.subscribe('clickGotoLogin', () => this.gotoLogin());
  }

  enter(email, username, password, repeatPassword) {
    Object.entries({
      email, username, password, repeatPassword,
    }).forEach(([key, value]) => {
      this.profile[key] = value;
    });
    ValidationModule.correctCreateProfile(this.profile);
    switch (this.profile.validate) {
      case ValidationModule.UNCORRECT_PARSE:
        this.eventBus.call('registration-warning');
        break;
      case ValidationModule.UNCORRECT_SERVERANS:
        this.eventBus.call('registration-error');
        break;
      default:
        this.eventBus.call('profile');
    }
  }

  gotoLogin() {
    this.eventBus.call('login');
  }
}
