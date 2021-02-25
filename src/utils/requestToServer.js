export const ApiRoutes = {
  loginForm: '/loginform',
  login: '/login',
};

export const loginForm = async (profile) => fetch(ApiRoutes.loginForm, {
  method: 'POST',
  body: JSON.stringify(profile),
  headers: {
    'Content-Type': 'application/json',
  },
}).then((req) => req.json());
