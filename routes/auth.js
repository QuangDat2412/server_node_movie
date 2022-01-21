const router = require('express').Router();
const authCtrl = require('../controllers/auth');

router.post('/register', authCtrl.register);
router.post('/checkotp', authCtrl.checkOtp);
router.put('/forgotpassword', authCtrl.forgotPassword);
router.post('/sendmail/:slug', authCtrl.sendMail);
router.post('/login', authCtrl.login);

module.exports = router;
