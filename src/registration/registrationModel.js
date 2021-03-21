import { correctRegistrationProfile, passwordsAreTheSame } from '../utils/validationModule.js';
import { registration } from '../utils/requestToServer.js';
import { RegistrationEvents, RegistrationMessage } from './registrationEvents.js';

export default class RegistrationModel {
  /**
   * @param {!EventBus}
   * @return {!RegistrationModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(RegistrationEvents.clickEnter,
      (profile) => this.clickEnter(profile));
  }

  clickEnter(profile) {
    const callError = (message) => {
      this.eventBus.call(RegistrationEvents.registrationError, message);
    };
    const validationError = correctRegistrationProfile(profile);
    if (validationError) {
      callError(validationError);
      return;
    }
    if (!passwordsAreTheSame(profile)) {
      callError(RegistrationMessage.repeatPasswordErrorValidation);
      return;
    }
    this.eventBus.call(RegistrationEvents.registrationWait, RegistrationMessage.waitData);
    registration(profile)
      .then((resp) => {
        switch (resp.status) {
          case 200:
          case 308:
            this.eventBus.call(RegistrationEvents.profile);
            break;
          case 400:
            callError(RegistrationMessage.errorValidation);
            break;
          case 409:
            callError(RegistrationMessage.emailNonUniq);
            break;
          default:
            callError(`${RegistrationMessage.unknownError}: ${resp.status}`);
        }
      });
  }
}
