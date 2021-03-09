import { correctChangeProfile } from '../utils/validationModule.js';
import {
  profilePatchForm, profileGetForm, getCookie, waitAnsFromServer,
} from '../utils/requestToServer.js';
import { ProfileEvent } from './profileEvents.js';

export default class ProfileModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(ProfileEvent.getData, () => this.getData());
    this.eventBus.subscribe(ProfileEvent.clickChangeData, (profile) => this.changeData(profile));
  }

  getData() {
    waitAnsFromServer(profileGetForm(getCookie('id')).then((req) => req.json()),
      (message) => this.eventBus.call(ProfileEvent.profileError, message),
      (val) => this.eventBus.call(ProfileEvent.profileSuccess, val.user));
  }

  changeData(profile) {
    const callError = (message) => this.eventBus.call(ProfileEvent.profileError, message);
    if (correctChangeProfile(profile, callError)) {
      waitAnsFromServer(profilePatchForm(profile).then((req) => req.json()),
        callError,
        (val) => this.eventBus.call(ProfileEvent.profileSuccess, val));
    }
  }
}
