import LoginController from './login/loginController.js';

const root = document.getElementById('root');
const router = {
  m: new Map(),
  go(path, ...data) {
    window.history.pushState({ urlPath: window.location.pathname }, null, path);
    return this.m.get(path)(...data);
  },
  subscribe(path, func) {
    this.m.set(path, func);
  },
};
const profile = {};

const loginController = new LoginController(router, root);

router.subscribe('/', () => router.go('/login', profile));
router.subscribe('/login', () => loginController.start(profile));

const tryToConnect = [window.location.pathname, '/login', '/profile'];
tryToConnect.some((path) => router.go(path, profile));
