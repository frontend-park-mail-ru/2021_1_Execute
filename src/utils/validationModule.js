export default class ValidationModule {
  static get UNCORRECT() {
    return -1;
  }

  static get CORRECT() {
    return 1;
  }

  /**
   * Проверка корректности строки как имени пользователя
   * @param profile
   * @return {boolean}
   */
  static correctUserName(profile) {
    if (profile.username && profile.username.match('^[A-Za-z0-9]+.{6,16}$') !== null) {
      profile.correct_username = this.CORRECT;
      return true;
    }
    profile.correct_username = this.UNCORRECT;
    return false;
  }

  /**
   * Проверка корректности строки как e-mail
   * @param profile
   * @return {boolean}
   */
  static correctEmail(profile) {
    if (profile.email && profile.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) !== null) {
      profile.correct_email = this.CORRECT;
      return true;
    }
    profile.correct_email = this.UNCORRECT;
    return false;
  }

  /**
   * Проверка корректности строки как пароля
   * @param profile
   * @return {boolean}
   */
  static correctPassword(profile) {
    if (profile.password && profile.password.match('.{6,16}$') !== null) {
      profile.correct_password = this.CORRECT;
      return true;
    }
    profile.correct_password = this.UNCORRECT;
    return false;
  }

  /**
   * Проверка корректности данных пользователя при логине
   * @param profile
   * @return {boolean}
   */
  static correctLoginProfile(profile) {
    const status = {};
    status.correctUserName = this.correctUserName(profile)
      ? ValidationModule.CORRECT_PARSE : ValidationModule.UNCORRECT;
    status.correctPassword = this.correctPassword(profile)
      ? ValidationModule.CORRECT_PARSE : ValidationModule.UNCORRECT;
    status.correct = Object.values(status).every((elem) => elem === ValidationModule.CORRECT_PARSE);
  }
}
