const asyncHandlers = require('../middleware/async');
const User = require('../models/User');
const Paciente = require('../models/Paciente');


// @Method: POST
// @Route : api/auth/register
// @Desc  : Handling the user registration
exports.register = asyncHandlers(async (req, res, next) => {

  const { name, apellido, dni, institucion, cargo, email, password, role } = req.body;
  // const {name, email, password, role}  = req.body;

  if(!email || !password){
    return res.status(400).json({success: false, message: "Por favor, ingrese todos los campos."});
  }

  let user = await User.findOne({email});

  if(user){
    return res.status(400).json({success: false, message: 'El usuario ya existe'});
  }

  user = await User.create({
    name, apellido, dni, institucion, cargo, email, password, role
  });

  const token = user.getSignedJwtToken();

  res.status(200).json({success: true, token: token});
})


// @Method: POST
// @Route : api/auth/login
// @Desc  : Logging in the user
exports.login = asyncHandlers(async (req, res, next) => {

  const {email, password}  = req.body;

  if(!email || !password){
    return res.status(400).json({success: false, message: "Please enter all the fields."});
  }

  const user = await User.findOne({email}).select('+password');

  if(!user){
    return res.status(404).json({success: false, message: "Invalid Creds.."});
  }

  const isMatch = await user.verifyPassword(password);

  if(!isMatch){
    return res.status(404).json({success: false, message: "Invalid Creds.."});
  }

 const token = user.getSignedJwtToken();

 return res.status(200).json({success: true, token: token, user: { _id: user._id, rol: user.rol, name: user.name, email: user.email }});

})

// @Method: GET
// @Route : api/auth/me
// @Desc  : Get the user on load if token available in browser
exports.getMe = asyncHandlers(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  return res.status(200).json({success: true, data: user});
})


exports.usuariosCompartir = asyncHandlers(async (req, res, next) => {
  const { name } = req.body;

  const users = await User.find({"rol": {"$ne": "admin"}}, { 'name': 1, 'username': 1 }).lean().sort({"name": "asc"});

  if (!users)
    return res.status(400).json( {success: false, message: "No se pudieron obtener los usuarios del sistema"} );

  users.sort

  return res.status(200).json( {success: true, data: users} );
})


exports.addUsuariosCompartir = asyncHandlers(async (req, res, next) => {
  const {pacienteId, shared} = req.body;

  const paciente = await Paciente.findOne({"_id": pacienteId}).lean();
  
  if(!paciente)
    return res.status(400).json( {success: false, message: "No se pudo encontrar el paciente"} );

  var new_shared = [];
  if(paciente.compartido_con != undefined) {
    new_shared = paciente.compartido_con;
  }

  shared.forEach(s => {
    new_shared.push(s);
  });

  const paciente_post = await Paciente.updateOne({"_id": pacienteId}, {"compartido_con": new_shared}).lean();

  if(!paciente_post)
    return res.status(400).json( {success: false, message: "No se pudo cargar el vector de compartidos"} );

  return res.status(200).json({success: true, data: paciente_post});
})


exports.removeUsuariosCompartir = asyncHandlers(async (req, res, next) => {
  const {pacienteId, stop_sharing} = req.body;

  const paciente = await Paciente.findOne({"_id": pacienteId}).lean();
  
  if(!paciente)
    return res.status(400).json( {success: false, message: "No se pudo encontrar el paciente"} );

  var new_shared = [];
  paciente.compartido_con.forEach(s => {
    if(stop_sharing.indexOf(s)==-1){
      new_shared.push(s);
    }
  })

  const paciente_post = await Paciente.updateOne({"_id": pacienteId}, {"compartido_con": new_shared}).lean();

  if(!paciente_post)
    return res.status(400).json( {success: false, message: "No se pudo cargar el vector de compartidos"} );

  return res.status(200).json({success: true, data: paciente_post});
})