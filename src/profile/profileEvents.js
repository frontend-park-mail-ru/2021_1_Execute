export const ProfileEvent = {
  getData: 'profile.model.clickGetData',
  clickChangeData: 'profile.model.clickChangeData',
  clickChangeAvatar: 'profile.model.clickChangeAvatar',
  avatarError: 'profile.view.profileError',
  profileError: 'profile.view.profileError',
  profileSuccess: 'profile.view.profileSuccess',
  login: 'login.controller.start',
  renderData: 'profile.view.renderData',
  exit: 'profile.model.exit',
  uploadAvatar: 'profile.model.exit',
  changeAvatarToBuffer: 'profile.view.changeAvatarToBuffer',
};

export const ProfileMessage = {
  success: 'Данные изменены',
  unknownError: 'Неизвестная ошибка',
  errorValidation: 'Некорректные данные',
  errorSize: 'Размер файла больше 2 MB',
  errorFormatImg: 'Неверный формат изображения',
  forbidden: 'Недостаточно прав',
  emailNonUniq: 'Пользователь с такой почтой уже есть',
  emailErrorValidation: 'Почта не корректна',
  usernameErrorValidation: 'Логин не корректный',
  passwordErrorValidation: 'Пароль не корректный',
  repeatPasswordErrorValidation: 'Пароли не совпали',
};
