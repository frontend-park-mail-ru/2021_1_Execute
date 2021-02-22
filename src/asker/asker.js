class AskerModule {
  /**
   * Проверка корректности строки как имени пользователя
   * @param {!string} username
   * @return {boolean}
   */
  static correctUserName(username) {
    return username.match('^[A-Za-z0-9]+.{6,16}$') !== null;
  }

  /**
   * Проверка корректности строки как e-mail
   * @param {!string} email
   * @return {boolean}
   */
  static correctEmail(email) {
    return email.match('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$') !== null;
  }

  /**
   * Проверка корректности строки как пароля
   * @param {!string} password
   * @return {boolean}
   */
  static correctPassword(password) {
    return password.match('.{6,16}$') !== null;
  }

  /**
   * Проверка корректности данных пользователя (и подкачка)
   * @param profile
   * @return {boolean}
   */
  static correctLoginProfile(profile) {
    this.correctUserName(profile.username);
    this.correctPassword(profile.password);

    // Пусть тут запрос к серверу
    const bigData = [
      {
        username: 'ZhukDima', password: '123456', photo: '/img/32.jpg', email: 'zhukdo@gmail.com',
      },
      {
        username: 'SkalikS', password: '654321', photo: '/img/35.jpg', email: 'zhukdo@yandex.ru',
      },
    ];
    const idealProfile = bigData.find(({ username, password }) => profile.username === username
      && profile.password === password);
    if (idealProfile === undefined) {
      return false;
    }
    profile.photo = idealProfile.photo;
    profile.email = idealProfile.email;
    return true;
  }
}

export { AskerModule as default };
