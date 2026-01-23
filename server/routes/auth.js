const express = require('express');
const { register, login, getMe, usuariosCompartir, addUsuariosCompartir, removeUsuariosCompartir } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Ver https://restfulapi.net/resource-naming/ para convenciones de nombres

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/usuariosCompartir', usuariosCompartir);
router.patch('/addUsuariosCompartir', addUsuariosCompartir);
router.patch('/removeUsuariosCompartir', removeUsuariosCompartir);

//Sample route with authorization example for roles.
//router.get('/me', protect, authorize('admin', 'user'),anySecureOperation);

module.exports = router;