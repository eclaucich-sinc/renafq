const mongoose = require('mongoose');

const recetaSchema = mongoose.Schema({

  filePath: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: String
  },
  creadoEn: {
    type: String
  },
  tipoMedicacion: {
    type: String
  }

},
{ strict: false })


module.exports = mongoose.model('Receta', recetaSchema);
