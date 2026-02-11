const asyncHandlers = require('../middleware/async');
const Receta = require('../models/Receta');
const Paciente = require('../models/Paciente');
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

    console.log('Buscando receta con ID:', _id);

    let receta = await Receta.findOne({_id});
  
    if (!receta) {
      console.log('Receta no encontrada en la base de datos');
      return res.status(400).json( {success: false, message: "No existe la receta en la base de datos"} );
    }
  
    console.log('Receta encontrada, filePath:', receta.filePath);

    // Obtener la ruta absoluta del archivo
    const absolutePath = path.isAbsolute(receta.filePath) 
      ? receta.filePath 
      : path.resolve(receta.filePath);
    
    console.log('Ruta absoluta:', absolutePath);

    // Verificar si el archivo existe
    if (!fs.existsSync(absolutePath)) {
      console.log('El archivo NO existe en:', absolutePath);
      return res.status(404).json({ success: false, message: "El archivo de la receta no existe" });
    }

    console.log('Archivo existe, enviando...');

    // Establecer el tipo de contenido apropiado
    res.contentType(receta.contentType);
    
    // Enviar el archivo
    res.sendFile(absolutePath);
});


// @Method: POST
// @Route : api/recetas
// @Desc  : Agrega una receta a la base de datos
exports.agregarReceta = asyncHandlers(async (req, res, next) => {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No se ha proporcionado ningún archivo" });
    }

    const { pacienteid, fechaSeguimiento, tipoMedicacion } = req.body;
    const creadoEn = GetTodayDate();
    
    // Buscar el paciente para obtener su DNI
    const pacienteDoc = await Paciente.findById(pacienteid);
    
    if (!pacienteDoc) {
      // Eliminar el archivo temporal si el paciente no existe
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Paciente no encontrado" });
    }
    
    // Convertir el documento de Mongoose a objeto plano para acceder a campos dinámicos
    const paciente = pacienteDoc.toObject();
    
    // Obtener el DNI del paciente
    console.log('Paciente.seccion1:', paciente.seccion1);
    console.log('DNI raw:', paciente.seccion1?.dni);
    console.log('Tipo de DNI:', typeof paciente.seccion1?.dni);
    
    const dniRaw = paciente.seccion1 && paciente.seccion1.dni !== undefined && paciente.seccion1.dni !== null 
    ? paciente.seccion1.dni 
    : null;
    
    const dni = dniRaw !== null ? String(dniRaw) : 'SIN_DNI';
    const image_name = `${dni}_${pacienteid}_${fechaSeguimiento}`;
    console.log('DNI final:', dni);
    
    // Primero crear el documento para obtener el ID
    const recetaData = {
      filePath: req.file.path, // Path temporal
      contentType: req.file.mimetype,
      name: image_name,
      date: fechaSeguimiento,
      creadoEn: creadoEn,
      tipoMedicacion: tipoMedicacion
    };

    const receta = await Receta.create(recetaData);
    
    // Renombrar el archivo con el formato DNI_ID
    const todayDate = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    //crear el dir si no existe
    const dir = path.join(__dirname, '..', 'uploads', 'recetas', todayDate);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const fileExtension = path.extname(req.file.originalname);
    const newFileName = `${receta._id}${fileExtension}` //`${dni}_${receta._id}${fileExtension}`;
    const newFilePath = path.join(dir, newFileName);
    
    // Renombrar el archivo físico
    fs.renameSync(req.file.path, newFilePath);
    
    // Actualizar el filePath en la base de datos
    receta.filePath = newFilePath;
    await receta.save();
  
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