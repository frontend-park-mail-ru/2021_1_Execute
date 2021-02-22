import LoginModule from './login/login.js';
import ProfileModule from './profile/profile.js';
import RegistrationModule from './registration/registration.js';

const root = document.getElementById('root');
const data = {};
const router = {
  m: new Map(),
  call(path) {
    return this.m.get(path);
  },
  subscribe(path, func) {
    this.m.set(path, func);
  },
};

const loginModule = new LoginModule(router, root);
const profileModule = new ProfileModule(router, root);
const registrationModule = new RegistrationModule(router, root);

router.subscribe('/login', () => loginModule.render(data));
router.subscribe('/', () => router.call('/login')());
router.subscribe('/profile', () => profileModule.render(data));
router.subscribe('/registration', () => registrationModule.render(data));

const tryToConnect = [window.location.pathname, '/login', '/profile'];
tryToConnect.some((path) => router.call(path)());
