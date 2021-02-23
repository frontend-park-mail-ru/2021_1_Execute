import ValidationModule from '../validation/validation.js';

export default class ProfileModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus, profile) {
    this.eventBus = eventBus;
    this.profile = profile;
    this.eventBus.subscribe('clickExit', () => this.exit());
    this.eventBus.subscribe('clickChangeData', (...data) => this.changeData(...data));
  }

  changeData(email, username, password, repeatPassword) {
    const newProfile = {
      email, username, password, repeatPassword,
    };
    ValidationModule.correctChangeProfile(this.profile, newProfile);
    switch (newProfile.validate) {
      case ValidationModule.UNCORRECT_PARSE:
        this.eventBus.call('profile-warning', newProfile);
        break;
      case ValidationModule.UNCORRECT_SERVERANS:
        this.eventBus.call('profile-error');
        break;
      default:
        this.eventBus.call('profile-success');
    }
  }

  exit() {
    this.eventBus.call('login');
  }
}
