import { Router } from 'express';
const router = Router();
const { register, login, getMe, connectWallet } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/connect-wallet', protect, connectWallet);

module.exports = router;
export default router;