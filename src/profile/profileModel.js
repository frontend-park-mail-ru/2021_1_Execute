import { correctChangeProfile } from '../utils/validationModule.js';
import {
  profilePatch, profileGet, exit, profileAvatarUpload,
} from '../utils/requestToServer.js';
import { ProfileEvent, ProfileMessage } from './profileEvents.js';

export default class ProfileModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(ProfileEvent.exit, this.exit.bind(this));
    this.eventBus.subscribe(ProfileEvent.getData, this.getData.bind(this));
    this.eventBus.subscribe(ProfileEvent.clickChangeData, (profile) => this.changeData(profile));
    this.eventBus.subscribe(ProfileEvent.clickChangeAvatar,
      (avatar, pushToServer) => this.changeAvatar(avatar, pushToServer));
  }

  exit() {
    const callWait = (message) => this.eventBus.call(ProfileEvent.profileFormWait, message);
    const callError = (message) => this.eventBus.call(ProfileEvent.profileFormError, message);
    const callSuccess = () => this.eventBus.call(ProfileEvent.login);

    callWait(ProfileMessage.waitData);
    exit()
      .then((resp) => {
        switch (resp.status) {
          case 200:
            callSuccess();
            break;
          case 401:
            callError(ProfileMessage.forbidden);
            break;
          default:
            callError(`${ProfileMessage.unknownError}: ${resp.status}`);
        }
      });
  }

  getData() {
    const callError = (message) => this.eventBus.call(ProfileEvent.profileFormError, message);

    profileGet()
      .then((resp) => {
        switch (resp.status) {
          case 200:
            resp.json().then((data) => {
              this.eventBus.call(ProfileEvent.renderData, data);
            });
            break;
          case 401:
            this.eventBus.call(ProfileEvent.login);
            break;
          case 404:
            callError(ProfileMessage.userUndefind);
            break;
          default:
            callError(`${ProfileMessage.unknownError}: ${resp.status}`);
        }
      });
  }

  changeData(profile) {
    const callWait = (message) => this.eventBus.call(ProfileEvent.profileFormWait, message);
    const callError = (message) => this.eventBus.call(ProfileEvent.profileFormError, message);
    const callSuccess = (message) => this.eventBus.call(ProfileEvent.profileFormSuccess, message);

    if (!correctChangeProfile(profile, callError)) {
      return;
    }
    callWait(ProfileMessage.waitData);
    profilePatch(profile)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            callSuccess(ProfileMessage.success);
            break;
          case 403:
            callError(ProfileMessage.forbidden);
            break;
          case 400:
            callError(ProfileMessage.errorValidation);
            break;
          case 409:
            callError(ProfileMessage.emailNonUniq);
            break;
          default:
            callError(`${ProfileMessage.unknownError}: ${resp.status}`);
        }
      });
  }

  /**
   * @param {File} avatar
   * @param {boolean} pushToServer
   */
  changeAvatar(avatar, pushToServer = false) {
    const callWait = (message) => this.eventBus.call(ProfileEvent.profileAvatarWait, message);
    const callError = (message) => this.eventBus.call(ProfileEvent.profileAvatarError, message);
    const callSuccess = (message) => this.eventBus.call(ProfileEvent.profileAvatarSuccess, message);

    if (!avatar.type.startsWith('image/')) {
      this.eventBus.call(ProfileEvent.originalAvatarFromBuffer);
      callError(ProfileMessage.errorValidation);
      return;
    }
    if (avatar.size > 15 * 1024 * 1024) {
      this.eventBus.call(ProfileEvent.originalAvatarFromBuffer);
      callError(ProfileMessage.errorSize);
      return;
    }
    this.eventBus.call(ProfileEvent.changeAvatarToBuffer, avatar);
    if (pushToServer) {
      callWait(ProfileMessage.waitData);
      profileAvatarUpload(avatar)
        .then((resp) => {
          switch (resp.status) {
            case 200:
              this.eventBus.call(ProfileEvent.clearAvatarBuffer);
              callSuccess(ProfileMessage.success);
              break;
            case 415:
              this.eventBus.call(ProfileEvent.originalAvatarFromBuffer);
              callError(ProfileMessage.errorFormatImg);
              break;
            default:
              this.eventBus.call(ProfileEvent.originalAvatarFromBuffer);
              callError(ProfileMessage.unknownError);
              break;
          }
        });
    } else {
      callWait(ProfileMessage.waitAvatarСonfirmation);
    }
  }
}
