const ApiRoutes = {
  loginForm: '/loginform',
  login: '/login',
};

const loginForm = async (profile) => fetch(ApiRoutes.loginForm, {
  method: 'POST',
  body: JSON.stringify(profile),
  headers: {
    'Content-Type': 'application/json',
  },
}).then((response) => response.json());

module.exports = { ApiRoutes, loginForm };
