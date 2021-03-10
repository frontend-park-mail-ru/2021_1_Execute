import { correctChangeProfile } from '../utils/validationModule.js';
import {
  profilePatchForm, profileGetForm, exitRequest, profileAvatarUpload,
} from '../utils/requestToServer.js';
import { ProfileEvent, ProfileMessage } from './profileEvents.js';

export default class ProfileModel {
  /**
   * @param {!EventBus}
   * @return {!ProfileModel}
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.subscribe(ProfileEvent.exit, () => this.exit());
    this.eventBus.subscribe(ProfileEvent.getData, () => this.getData());
    this.eventBus.subscribe(ProfileEvent.clickChangeData, (profile) => this.changeData(profile));
  }

  exit() {
    const callError = (message) => this.eventBus.call(ProfileEvent.profileError, message);
    exitRequest()
      .then((resp) => {
        switch (resp.status) {
          case 200:
            this.eventBus.call(ProfileEvent.login);
            break;
          case 401:
            callError(ProfileMessage.forbidden);
            break;
          default:
            callError(ProfileMessage.unknownError);
        }
      });
  }

  getData() {
    profileGetForm()
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
            this.eventBus.call(ProfileEvent.profileError, { message: 'Пользователь не найден' });
            break;
          default:
            this.eventBus.call(ProfileEvent.profileError, { message: 'Неизвестная ошибка' });
        }
      });
  }

  changeData(profile) {
    const callError = (message) => this.eventBus.call(ProfileEvent.profileError, message);
    if (correctChangeProfile(profile, callError)) {
      profilePatchForm(profile)
        .then((resp) => {
          switch (resp.status) {
            case 200:
              this.eventBus.call(ProfileEvent.profileSuccess, { message: ProfileMessage.success });
              break;
            case 403:
              callError(ProfileMessage.forbidden);
              break;
            case 400:
              callError(ProfileMessage.errorValidation);
              break;
            default:
              callError(ProfileMessage.unknownError);
          }
        });
      profileAvatarUpload(profile.avatar);
    }
  }
}
