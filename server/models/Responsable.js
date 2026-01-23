const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

const responsableSchema = mongoose.Schema({

  provincia: {
    type: String,
  },
  departamento: {
    type: String,
  },
  institucion: {
    type: String,
  },
  nombre: {
    type: String,
  },
  apellido: {
    type: String,
  },
  mail: {
    type: String,
  },
  gln: {
    type: String,
  },

},
{ strict: false })


module.exports = mongoose.model('Responsable', responsableSchema);
