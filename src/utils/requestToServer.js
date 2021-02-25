export class ServerWays {
  static get loginForm() {
    return '/loginform';
  }

  static get login() {
    return '/login';
  }
}

export default class RequestToServer {
  static async LoginForm(profile) {
    let status;
    try {
      const response = await fetch(ServerWays.loginForm, {
        method: 'POST',
        body: JSON.stringify(profile),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      status = await response.json();
      // eslint-disable-next-line no-console
      console.log('loginform-success', status);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('loginform-error', error);
    }
    return status;
  }
}
