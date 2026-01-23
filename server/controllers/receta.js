const asyncHandlers = require('../middleware/async');
const Receta = require('../models/Receta');
const path = require('path');
const fs = require('fs');

function GetTodayDate() {
  const d = new Date();
  
  let day = d.getDate()
  if (day < 10) day = "0"+day;

  let month = d.getMonth()+1
  if (month < 10) month = "0"+month;

  let hour = d.getHours()
  if (hour < 10) hour = "0"+hour;

  let minute = d.getMinutes()
  if (minute < 10) minute = "0"+minute;

  return day+"/"+month+"/"+d.getFullYear()+"-"+hour+":"+minute;
}

// @Method: GET
// @Route : api/recetas
// @Desc  : Obtener todas las recetas
exports.obtenerRecetas = asyncHandlers(async (req, res, next) => {

    recetas = await Receta.find({}).lean();
    
  
    return res.status(200).json( {success: true, data: recetas} );
});


// @Method: GET
// @Route : api/recetas/:id
// @Desc  : Obtiene una receta basado en un id
exports.obtenerReceta = asyncHandlers(async (req, res, next) => {
    const _id = req.params.id;

    let receta = await Receta.findOne({_id});
  
    if (!receta)
      return res.status(400).json( {success: false, message: "No existe la receta en la base de datos"} );
  
    // Verificar si el archivo existe
    if (!fs.existsSync(receta.filePath)) {
      return res.status(404).json({ success: false, message: "El archivo de la receta no existe" });
    }

    // Enviar el archivo
    res.sendFile(path.resolve(receta.filePath));
});


// @Method: POST
// @Route : api/recetas
// @Desc  : Agrega una receta a la base de datos
exports.agregarReceta = asyncHandlers(async (req, res, next) => {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No se ha proporcionado ningún archivo" });
    }

    const { pacienteid, fechaSeguimiento, tipoMedicacion } = req.body;
    const image_name = `${pacienteid}_${fechaSeguimiento}`;
    const creadoEn = GetTodayDate();

    const recetaData = {
      filePath: req.file.path,
      contentType: req.file.mimetype,
      name: image_name,
      date: fechaSeguimiento,
      creadoEn: creadoEn,
      tipoMedicacion: tipoMedicacion
    };

    const receta = await Receta.create(recetaData);
  
    return res.status(200).json( {success: true, data: receta} );
  });


  exports.eliminarReceta = asyncHandlers(async (req, res, next) => {
    const _id = req.params.id;

    const receta = await Receta.findOneAndDelete({_id});

    // Eliminar el archivo físico si existe
    if (receta && receta.filePath && fs.existsSync(receta.filePath)) {
      fs.unlinkSync(receta.filePath);
    }

    return res.status(200).json( {success: true, data: receta} );
  });