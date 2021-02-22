import LoginModule from './login/login.js';
import ProfileModule from './profile/profile.js';

const root = document.getElementById('root');
const data = { username: 'ZhukDima', email: 'zhukdo@gmail.com', photo: '/img/32.jpg' };
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

router.subscribe('/login', () => loginModule.render(data));
router.subscribe('/', () => router.call('/login')());
router.subscribe('/profile', () => profileModule.render(data));

router.call(window.location.pathname)();
