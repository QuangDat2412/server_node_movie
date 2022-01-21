const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../verifyToken');
const userCtrl = require('../controllers/user');
const router = require('express').Router();

router.put('/:id', verifyTokenAndAuthorization, userCtrl.updateUser);
router.put('/add/:id', verifyTokenAndAuthorization, userCtrl.add);
router.put('/remove/:id', verifyTokenAndAuthorization, userCtrl.remove);
router.delete('/:id', verifyTokenAndAdmin, userCtrl.deleteUser);
router.get('/find/:id', verifyTokenAndAdmin, userCtrl.getUserById);
router.get('/', verifyTokenAndAdmin, userCtrl.getAllUser);
router.post('/adduser', verifyTokenAndAdmin, userCtrl.newUser);
router.get('/stats', verifyTokenAndAdmin, userCtrl.stats);

module.exports = router;
