const asyncHandlers = require('../middleware/async');
const Responsable = require('../models/Responsable');

exports.obtenerResponsable = asyncHandlers(async (req, res, next) => {
    const institucion_provincia = req.params.prov;
    const institucion_departamento = req.params.dep;
    const institucion = req.params.inst;
    
    let responsable = await Responsable.findOne({ "provincia": institucion_provincia, "departamento": institucion_departamento, "institucion": institucion });

    console.log(responsable);
    if (!responsable)
        return res.status(400).json( {success: false, message: "No existen los responsables de la institución"} );

    return res.status(200).json( {success: true, data: responsable} );
});