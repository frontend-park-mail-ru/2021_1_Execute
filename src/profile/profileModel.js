import { correctPassword, correctUserName } from '../utils/validationModule.js';
import { profileForm } from '../utils/requestToServer.js';
import { ProfileEvent, ProfileMessage } from './profileEvents.js';

export default class ProfileModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(ProfileEvent.clickChangeData, (profile) => this.changeData(profile));
  }

  changeData(profile) {
    const callError = (message) => this.eventBus.call(ProfileEvent.profileError, message);
    if (!correctUserName(profile.username)) {
      callError(ProfileMessage.usernameErrorValidation);
    } else if (!correctPassword(profile.password)) {
      callError(ProfileMessage.passwordErrorValidation);
    } else if (profile.password !== profile.repeatPassword) {
      callError(ProfileMessage.repeatPasswordErrorValidation);
    } else {
      let timer;
      profileForm(profile)
        .then(
          (val) => this.eventBus.call(ProfileEvent.profileSuccess, val),
        ).catch((err) => callError(err.error))
        .finally(() => clearTimeout(timer));
      timer = setTimeout(() => callError('Превышенно время ожидания сервера'), 5 * 1000);
    }
  }
}
