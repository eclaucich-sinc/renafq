const asyncHandlers = require('../middleware/async');
const Paciente = require('../models/Paciente');
const User = require('../models/User');


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
// @Route : api/pacientes
// @Desc  : Obtener todos los pacientes
exports.obtenerPacientes = asyncHandlers(async (req, res, next) => {
  // cuando usamos lean() los objetos tipo "Mongoose" se convierten a json común. Ver https://mongoosejs.com/docs/api.html#query_Query-lean

  const user = JSON.parse(req.query.user);
  // console.log("🚀 ~ file: paciente.js ~ line 11 ~ exports.obtenerPacientes=asyncHandlers ~ user", user)
  let pacientes;
  let compartidos;

  if (user.rol === 'admin' || user.rol === 'EPF') {
    pacientes = await Paciente.find({}, { 'seccion1.nombre': 1, 'seccion1.apellido': 1, 'seccion1.dni': 1, 'seccion1.fallecimiento': 1}).lean();
    compartidos = await Paciente.find({compartido_con: {"$exists": true}, compartido_con: String(user._id)}, { 'seccion1.nombre': 1, 'seccion1.apellido': 1, 'seccion1.dni': 1 }).lean();
  } else {
    pacientes = await Paciente.find({ creadoPor: String(user._id) }, { 'seccion1.nombre': 1, 'seccion1.apellido': 1, 'seccion1.dni': 1 }).lean();
    compartidos = await Paciente.find({compartido_con: {"$exists": true}, compartido_con: String(user._id)}, { 'seccion1.nombre': 1, 'seccion1.apellido': 1, 'seccion1.dni': 1 }).lean();
    // pacientes = await Paciente.find({}, { 'seccion1.nombre': 1, 'seccion1.apellido': 1, 'seccion1.dni': 1, 'creadoPor': user._id }).lean();
  }
  
  // console.log("🚀 ~ file: paciente.js ~ line 17 ~ exports.obtenerPacientes=asyncHandlers ~ pacientes", pacientes)

  // OK!
  // let pacientes = await Paciente.find({}, { 'seccion1.nombre': 1, 'seccion1.apellido': 1, 'seccion1.dni': 1 }).lean();

  // console.log(pacientes);


  if (user.rol !== "admin" && (!pacientes || !compartidos))
    return res.status(400).json( {success: false, message: "No se pudieron obtener los pacientes"} );

  // pacientes = pacientes.map( pac =>  {
  //   const { nombre, apellido, dni } = pac.seccion1
  //   return {
  //     _id: pac._id,
  //     nombre,
  //     apellido,
  //     dni
  //   }
  // });

  let todos_pacientes = [];

  pacientes.forEach((p => {
    p.compartido = false;
    todos_pacientes.push(p);
  }));

  if(compartidos!=null && compartidos.length>0)
  {
    compartidos.forEach((p => {
      p.compartido = true;
      todos_pacientes.push(p);
    }));
  }

  return res.status(200).json( {success: true, data: todos_pacientes} );
});

// @Method: GET
// @Route : api/pacientes/:id
// @Desc  : Obtiene un paciente basado en un id
exports.obtenerPaciente = asyncHandlers(async (req, res, next) => {
  const _id = req.params.id;
  let paciente = await Paciente.findOne({_id});

  if (!paciente)
    return res.status(400).json( {success: false, message: "No existe el paciente en la base de datos"} );

  return res.status(200).json( {success: true, data: paciente} );
});

// @Method: GET
// @Route : api/pacientes/:dni
// @Desc  : Obtiene un paciente basado en un dni
exports.obtenerPacienteDNI = asyncHandlers(async (req, res, next) => {
  const dni = req.params.dni;
  let paciente = await Paciente.findOne({ "seccion1.dni": Number(dni) });

  if (!paciente)
    return res.status(400).json( {success: false, message: "No existe el paciente en la base de datos"} );

  return res.status(200).json( {success: true, data: paciente} );
});

// @Method: GET
// @Route : api/pacientes/:id/seguimientos/:anio
// @Desc  : Obtiene el seguimiento de un paciente basado en un id y un anio
// El formato tiene que ser:
// - campo "seguimientos" en el root del documento, de tipo array
// - campo "2XXX" dentro de seguimientos, de tipo Object
// - contenido del seguimiento, con sus secciones
exports.obtenerSeguimientoPaciente = asyncHandlers(async (req, res, next) => {
  const _id = req.params.id;
  const sid = req.params.sid;

  let seguimiento = await Paciente
    .findOne({_id, "seguimientos.id": sid }, { _id, 'seguimientos': 1 })
    .lean()
    .then( pac => pac.seguimientos.find( seg => seg.id === sid ) );

  // let seguimiento = await Paciente.findOne({_id, "seguimientos.id": sid }, { _id, 'seguimientos': 1 }, (err, paciente) => {
  //   if (err)
  //     return res.status(400).json( {success: false, message: "No existe el paciente en la base de datos"} );
    
  //   const { _id, seguimientos } = JSON.stringify(paciente);
  //   console.log("🚀 ~ file: paciente.js ~ line 72 ~ seguimiento ~ _id", _id)
  //   // const seguimientos2 = paciente;
  //   console.log("🚀 ~ file: paciente.js ~ line 68 ~ seguimiento ~ paciente", paciente)
  //   console.log("🚀 ~ file: paciente.js ~ line 68 ~ seguimiento ~ paciente-seg", seguimientos)
    
  //   return paciente.seguimientos.find( seg => seg.id === sid );
  // });

  // let seguimiento = await Paciente.findOne({_id, "seguimientos.id": sid }, { _id, "seguimientos": 1 });
  // console.log("🚀 ~ file: paciente.js ~ line 70 ~ exports.obtenerSeguimientoPaciente=asyncHandlers ~ seguimiento", seguimiento)

  if (!seguimiento)
    return res.status(400).json( {success: false, message: "No existe el paciente o el seguimiento en la base de datos"} );

  return res.status(200).json( {success: true, data: seguimiento} );
})

// @Method: GET
// @Route : api/pacientes/:id/seguimientos
// @Desc  : Obtiene todos los seguimientos de un paciente basado en un id
// El formato tiene que ser:
// - campo "seguimientos" en el root del documento, de tipo array
// - campo "2XXX" dentro de seguimientos, de tipo Object
// - contenido del seguimiento, con sus secciones
exports.obtenerSeguimientosPaciente = asyncHandlers(async (req, res, next) => {
  const _id = req.params.id;
  let seguimientos = await Paciente.findOne({_id}, { _id, "seguimientos": 1 });

  if (!seguimientos)
    return res.status(400).json( {success: false, message: "No existe el paciente en la base de datos"} );

  return res.status(200).json( {success: true, data: seguimientos} );
});

// @Method: POST
// @Route : api/pacientes
// @Desc  : Agrega un paciente a la base de datos
exports.agregarPaciente = asyncHandlers(async (req, res, next) => {

  const { paciente:pac, userId } = req.body;

  if (!pac.seccion1.nombre || !pac.seccion1.apellido || !pac.seccion1.dni){
    return res.status(400).json( {success: false, message: "Por favor, ingrese todos los campos requeridos."} );
  }

  let dni_paciente = pac.seccion1.dni;
  let paciente = await Paciente.findOne({ "seccion1.dni": dni_paciente });

  if (paciente) {
    return res.status(400).json( {success: false, message: 'El paciente ya existe en la base de datos'} );
  }

  // agregamos el usuario que lo creó
  pac.creadoPor = userId;
  paciente = await Paciente.create(pac);

  return res.status(200).json( {success: true, data: paciente} );
});

// @Method: PATCH
// @Route : api/pacientes/:id/edit
// @Desc  : Modifica un paciente en la base de datos
exports.modificarPaciente = asyncHandlers(async (req, res, next) => {

  const _id = req.params.id;
  const { paciente:pac } = req.body;
  // console.log("🚀 ~ file: paciente.js ~ line 101 ~ exports.agregarPaciente=asyncHandlers ~ userId", userId)
  // console.log("🚀 ~ file: paciente.js ~ line 101 ~ exports.agregarPaciente=asyncHandlers ~ pac", pac)
  // console.log("🚀 ~ file: paciente.js ~ line 101 ~ exports.agregarPaciente=asyncHandlers ~ req.body", req.body)

  if (!pac.seccion1.nombre || !pac.seccion1.apellido || !pac.seccion1.dni){
    return res.status(400).json( {success: false, message: "Por favor, ingrese todos los campos requeridos."} );
  }

  let dni = pac.seccion1.dni;
  let paciente = await Paciente.findOneAndUpdate({_id}, pac);

  if (!paciente) {
    return res.status(400).json( {success: false, message: 'El paciente no existe en la base de datos'} );
  }

  // agregamos el usuario que lo creó
  // pac.creadoPor = userId;
  // paciente = await Paciente.create(pac);

  return res.status(200).json( {success: true, data: paciente} );
});

// @Method: POST
// @Route : api/pacientes/:id/seguimientos
// @Desc  : Agrega un seguimiento a un paciente en la base de datos
exports.agregarSeguimientoPaciente = asyncHandlers(async (req, res, next) => {

  const _id = req.params.id;
  const {seguimiento:seg, user_id} = req.body;

  if (!seg.seccion1.fechaSeguimiento) {
    return res.status(400).json( {success: false, message: "No existe una fecha de seguimiento relacionada. Compruebe que el campo fechaSeguimiento existe."} );
  }

  // insertamos el año como id en el nuevo seguimiento
  let seguimiento = {
    id: seg.seccion1.fechaSeguimiento,
    creadoPor: user_id,
    creadoEn: GetTodayDate(),
    recetas: [],
    ...seg
  }

  let paciente_seguimiento = await Paciente.findOne({ _id, "seguimientos.id": seg.seccion1.fechaSeguimiento }, { _id, "seguimientos": 1 });

  // chequeamos que el seguimiento no esté ya registrado para este paciente
  if (paciente_seguimiento)
    return res.status(400).json( {success: false, message: 'El seguimiento actual ya se encuentra registrado para este paciente.'} );

  // buscamos el paciente y actualizamos el array "seguimientos" con el nuevo
  let query = { _id: _id };
  let update = {
    $addToSet: {
      seguimientos: seguimiento
    }
  };

  let options = { upsert: true };
  let paciente = await Paciente.findOneAndUpdate(query, update, options)
    .catch(error => console.error(error));

  return res.status(200).json( {success: true, data: {seg: paciente, id: _id }} );
});

// @Method: PATCH
// @Route : api/pacientes/:id/seguimientos/:sid/edit
// @Desc  : Modifica un seguimiento de un paciente en la base de datos
exports.modificarSeguimientoPaciente = asyncHandlers(async (req, res, next) => {

  const _id = req.params.id;
  const sid = req.params.sid;
  const seg = req.body;

  if (!seg.seccion1.fechaSeguimiento) {
    return res.status(400).json( {success: false, message: "No existe una fecha de seguimiento relacionada. Compruebe que el campo fechaSeguimiento existe."} );
  }

  // // obtenemos el año desde la fecha de seguimiento
  // const anio = new Date(seg.seccion1.fechaSeguimiento).getFullYear().toString();


  // insertamos el año como id en el nuevo seguimiento
  // let seguimiento = {
  //   // id: sid,
  //   ...seg
  // }

  // let paciente_seguimiento = await Paciente.findOne({ _id, "seguimientos.id": sid }, { _id, "seguimientos": 1 });

  // // chequeamos que el seguimiento no esté ya registrado para este paciente
  // if (paciente_seguimiento)
  //   return res.status(400).json( {success: false, message: 'El seguimiento actual ya se encuentra registrado para este paciente.'} );

  // buscamos el paciente y actualizamos el array "seguimientos" con el nuevo
  let query = { _id: _id, "seguimientos.id": sid };
  let update = {
    $set: {
      "seguimientos.$": seg
    }
  };
  let options = { new: true };
  let paciente = await Paciente.findOneAndUpdate(query, update, options)
  // let paciente = await Paciente.findOneAndUpdate(query, update, options)
    .catch(error => console.error(error));

  // let paciente = await Paciente.findOneAndUpdate(query, seg)
  // // let paciente = await Paciente.findOneAndUpdate(query, update, options)
  //   .catch(error => console.error(error));

  return res.status(200).json( {success: true, data: {seg: paciente, id: _id }} );
});

// @Method: DELETE
// @Route : api/pacientes
// @Desc  : Elimina un paciente de la base de datos
exports.eliminarPaciente = asyncHandlers(async (req, res, next) => {
  const _id = req.params.id;

  const paciente = await Paciente.findOneAndDelete({_id});

  return res.status(200).json( {success: true, data: paciente} );
});


exports.usuariosCompartidos = asyncHandlers(async (req, res, next) => {

  const _id = req.params.id;

  const paciente = await Paciente.findOne({"_id": _id}).lean();

  if(!paciente)
    return res.status(400).json( {success: false, message: "No se pudo encontrar el paciente"} );

  var shared = []
  if(paciente.compartido_con != undefined){
    shared = paciente.compartido_con;
  }

  if(shared.length > 0) {
    const users = await User.find({"_id": {$in: shared}});

    if(!users)
      return res.status(400).json( {success: false, message: "Problema con los usuarios"} );
    
    users.sort;
    return res.status(200).json( {success: true, data: users} );
  }
  else {
    return res.status(200).json( {success: true, data: shared} );
  }
});


exports.updateRecetasSeguimiento = asyncHandlers(async (req, res, next) => {
  const _id = req.params.id; //id paciente
  const sid = req.params.sid; // id seguimiento
  const recetas = req.body; 

  let query = { _id: _id, "seguimientos.id": sid };
  let update = {
    $set: {
      "seguimientos.$.recetas": recetas.recetas
    }
  };
  let options = { new: true };
  let paciente = await Paciente.findOneAndUpdate(query, update, options)
  // let paciente = await Paciente.findOneAndUpdate(query, update, options)
    .catch(error => console.error(error));

  return res.status(200).json( {success: true, data: {recetas: paciente, id: _id }} );
});