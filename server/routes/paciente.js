const express = require('express');
const { 
    agregarPaciente,
    modificarPaciente,
    obtenerPaciente,
    obtenerPacientes,
    obtenerSeguimientosPaciente,
    obtenerSeguimientoPaciente,
    agregarSeguimientoPaciente,
    modificarSeguimientoPaciente,
    eliminarPaciente,
    obtenerPacienteDNI,
    usuariosCompartidos,
    updateRecetasSeguimiento,
} = require('../controllers/paciente');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, obtenerPacientes);
// router.get('/:id', protect, obtenerPaciente);
router.get('/:id', obtenerPaciente);
router.get('/dni/:dni', obtenerPacienteDNI);
router.get('/:id/seguimientos', obtenerSeguimientosPaciente); // AGREGAR protect
router.get('/:id/seguimientos/:sid', obtenerSeguimientoPaciente); // AGREGAR protect
// router.get('/:id', protect, obtenerPaciente); // Version que necesita token
router.get('/:id/usuariosCompartidos', usuariosCompartidos);

router.post('/', agregarPaciente);
router.patch('/:id/edit', modificarPaciente);
router.post('/:id/seguimientos', agregarSeguimientoPaciente);
router.patch('/:id/seguimientos/:sid/edit', modificarSeguimientoPaciente);

router.patch('/:id/seguimientos/:sid/recetas', updateRecetasSeguimiento)

router.delete('/:id', eliminarPaciente);
// router.post('/paciente', protect, authorize('admin', 'user'), agregarPaciente);

//Sample route with authorization example for roles.
//router.get('/me', protect, authorize('admin', 'user'),anySecureOperation);

module.exports = router;
