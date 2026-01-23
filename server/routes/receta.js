const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
    agregarReceta,
    obtenerRecetas,
    obtenerReceta,
    eliminarReceta
} = require('../controllers/receta');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configuración de multer para guardar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/recetas/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Aceptar solo PDFs e imágenes
  if (file.mimetype === 'application/pdf' || 
      file.mimetype === 'image/jpeg' || 
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten PDF, JPG, JPEG y PNG.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Límite de 10MB
  }
});

router.post('/', upload.single('receta'), agregarReceta);

router.get('/', protect, obtenerRecetas);
router.get('/:id', obtenerReceta);

router.delete('/:id', eliminarReceta);

module.exports = router;
