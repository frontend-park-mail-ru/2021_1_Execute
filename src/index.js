import LoginController from './login/loginController.js';
import Router from './utils/router.js';

const root = document.getElementById('root');
const router = new Router();

const loginController = new LoginController(router, root);

router.addRoute('/', () => router.go('/login'));
router.addRoute('/login', () => loginController.start());
router.addRoute('/registation', () => {});
router.addRoute('/profile', () => {});

router.go(window.location.pathname);
