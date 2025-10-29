const express = require('express');
const router = express.Router();
const { obtenerMedicos } = require('../controllers/medicoController');

router.get('/', obtenerMedicos);

module.exports = router;
