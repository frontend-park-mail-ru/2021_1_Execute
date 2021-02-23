import LoginController from './login/loginController.js';
import ProfileController from './profile/profileController.js';
import RegistrationController from './registration/registrationController.js';

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
const profileController = new ProfileController(router, root);
const registrationController = new RegistrationController(router, root);

router.subscribe('/login', () => loginController.start(profile));
router.subscribe('/', () => router.go('/login', profile));
router.subscribe('/profile', () => profileController.start(profile));
router.subscribe('/registration', () => registrationController.start(profile));

const tryToConnect = [window.location.pathname, '/login', '/profile'];
tryToConnect.some((path) => router.go(path, profile));
