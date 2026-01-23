const express = require('express');

const { protect } = require('../middleware/auth');
const { obtenerResponsable } = require('../controllers/responsables');

const router = express.Router();

router.get('/:prov/:dep/:inst', obtenerResponsable);

module.exports = router;
