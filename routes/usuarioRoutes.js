const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registrar', controller.registrar);
router.post('/login', controller.login);

router.put('/usuarios/atualizar', authMiddleware, controller.atualizar);
router.delete('/usuarios/deletar', authMiddleware, controller.deletar);
router.get('/usuarios/dados', authMiddleware, controller.buscarDados);

module.exports = router;
