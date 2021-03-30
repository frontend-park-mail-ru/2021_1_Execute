export const MainPageEvent = {
  getData: 'mainPage.model.getData',
  profile: 'profile.controller.start',
  login: 'login.controller.start',
  renderData: 'mainPage.view.renderData',
  clickAddDesk: 'mainPage.model.clickAddDesk',
  renderNewBoard: 'mainPage.model.renderNewBoard',
  clickButtonBoard: 'mainPage.model.clickButtonBoard',
};

export const MainPageMessage = {
  waitAvatarСonfirmation: 'Нажмите кнопку «Изменить данные» что-бы применить изменение',
  waitData: 'Ожидаем ответ от сервера',
  success: 'Данные изменены',
  unknownError: 'Неизвестная ошибка',
  errorValidation: 'Некорректные данные',
  errorSize: 'Размер файла больше 15 MB',
  errorFormatImg: 'Неверный формат изображения',
  forbidden: 'Недостаточно прав',
  userUndefind: 'Пользователь не найден',
  emailNonUniq: 'Пользователь с такой почтой уже есть',
  emailErrorValidation: 'Почта не корректна',
  usernameErrorValidation: 'Логин не корректный',
  passwordErrorValidation: 'Пароль не корректный',
  repeatPasswordErrorValidation: 'Пароли не совпали',
};
