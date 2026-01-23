import {
  PACIENTE_AGREGADO,
  PACIENTE_MODIFICADO,
  PACIENTE_ELIMINADO,
  PACIENTE_ERROR,
  PACIENTES_CARGADOS,
  DETALLES_PACIENTE,
  SEGUIMIENTO_PACIENTE,
  PACIENTE_AGREGADO_EPF,
  RECETA_AGREGADA,
  RECETA_ERROR,
  RECETA_DETALLES,
  GET_SHARED,
  USERS_ERROR,
  UPDATE_RECETAS,
  UPDATE_RECETAS_ERROR,
  RECETA_ELIMINADA,
} from "../types";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import { GetDepartamentoId, GetEstablecimientoId, GetLocalidadId, GetPaisId, GetProvinciaId } from "../../utils/listsAndIds";

export const obtenerPacientes = (user) => {
  return async (dispatch) => {
    const config = { 
      header: { "Content-Type": "application/json" },
      params: { user },
    };
    try {
      setAuthToken(localStorage.token);
      console.log("🚀 ~ file: pacienteAction.js ~ line 19 ~ return ~ user", user)
      const res = await axios.get("/api/pacientes", config);
      console.log(res.data);
      dispatch({ type: PACIENTES_CARGADOS, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response });
      // dispatch({type: PACIENTE_ERROR, payload: err.response.data.message})
    }
  };
};

export const obtenerPaciente = (id) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.get(`/api/pacientes/${id}`, config);
      console.log(res.data);
      dispatch({ type: DETALLES_PACIENTE, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response.data.message });
    }
  };
};

export const obtenerSeguimientosPaciente = (id) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.get(`/api/pacientes/${id}/seguimientos/`, config);
      console.log(res.data);
      dispatch({ type: SEGUIMIENTO_PACIENTE, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response.data.message });
    }
  };
};

export const obtenerSeguimientoPaciente = (id, sid) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.get(`/api/pacientes/${id}/seguimientos/${sid}`, config);
      console.log(res.data);
      dispatch({ type: SEGUIMIENTO_PACIENTE, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response.data.message });
    }
  };
};

export const agregarPaciente = (paciente, userId) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/pacientes", { paciente, userId }, config);
      console.log(res.data);
      dispatch({ type: PACIENTE_AGREGADO, payload: res.data });
      
      dispatch(agregarPacienteEPF(paciente));
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response.data.message });
    }
  };
};


export const agregarPacienteEPF = (paciente) => {
  return async (dispatch) => {
    try {
      if(paciente.seccion1.institucion_refes==="Sí")
      {
        const res = await fetch("https://epf.sisa.msal.gov.ar/epf/pacientes", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'APP_ID': '250f7de4',
            'APP_KEY': '65b89d577566bccedfe6ed89627d8557'
          },
          body: JSON.stringify(MakeEPFJSON(paciente)),
        });
        const res_data = await res.json();
        console.log(res_data);
        console.log(JSON.stringify(MakeEPFJSON(paciente)));
        dispatch({ type: PACIENTE_AGREGADO_EPF, payload: res.data });
      }
      else
      {
        console.log("No tiene institución del REFES");
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response.data.message });
    }
  };
};

export const isMenorUnAño = (fechaNac) => {
  var today = new Date();
  var birthDate = new Date(fechaNac);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  var d = today.getDay() - birthDate.getDay();

  if(age===0 || (age===1 && m<0) || (age===1 && m===0 && d<0))
      return true;
  else
      return false;
}

export const MakeEPFJSON = (paciente) => {

  let sexo = "";
  if(paciente.seccion1.sexo==="Masculino")
    sexo = "m";
  else if(paciente.seccion1.sexo==="Femenino")
    sexo = "f";
  else
    sexo = "x";

  let fechaNacArray = paciente.seccion1.fechaNacimiento.split('-');
  let fechaNac = fechaNacArray[2] + "-" + fechaNacArray[1] + "-" + fechaNacArray[0];

  let fechaDiagArray = paciente.seccion2.fechaDiagnostico.split('-');
  let fechaDiag = fechaDiagArray[2] + "-" + fechaDiagArray[1] + "-" + fechaDiagArray[0];

  console.log('Fecha nacimiento: ' + fechaNacArray);
  console.log('Fecha diagnostico: ' + fechaDiagArray);

  let vinculo = null;
  switch(paciente.seccion1.vinculoResponsable)
  {
    case "Padre": vinculo = 1; break;
    case "Madre": vinculo = 2; break;
    case "Tutor o encargado": vinculo = 3; break;
    case "Hermano/a": vinculo = 4; break;
    case "Otro familiar": vinculo = 5; break;
    case "Otro parentesco": vinculo = 6; break;
    case "Hijo/a": vinculo = 7; break;
    case "Abuelo/a": vinculo = 8; break;
    case "Tío/a": vinculo = 10; break;
    case "Primo/a": vinculo = 11; break;
    case "Nieto/a": vinculo = 12; break;
    case "Conyuge": vinculo = 13; break;
    case "Conviviente": vinculo = 14; break;
    case "Padre biológico": vinculo = 15; break;
    case "Madre biológica": vinculo = 16; break;
    default: vinculo = null;
  }

  let epfjson = undefined;
  if(!isMenorUnAño(paciente.seccion1.fechaNacimiento))
  {
      epfjson = {
          "ciudadano": {
            "apellido": paciente.seccion1.apellido,
            "nombre": paciente.seccion1.nombre,
            "tipoDocumento": "1",
            "numeroDocumento": paciente.seccion1.dni,
            "sexo": sexo,
            "fechaNacimiento": fechaNac,
          },
          "diagnostico": {
            "establecimiento": GetEstablecimientoId(paciente.seccion1.institucion_provincia, paciente.seccion1.institucion_departamento, paciente.seccion1.institucion),//11820632184264,
            "diagnostico": 24426,
            "fechaDiagnostico": fechaDiag
          }
        };
  }
  else
  {
      epfjson = {
          "ciudadano": {
            "apellido": paciente.seccion1.apellido,
            "nombre": paciente.seccion1.nombre,
            "tipoDocumento": "1",
            "numeroDocumento": paciente.seccion1.dni,
            "sexo": sexo,
            "fechaNacimiento": fechaNac,
            "personaACargo": {
              "tipoDocumento": "1",
              "numeroDocumento": paciente.seccion1.dniResponsable,
              "vinculo": vinculo
            },
            "domicilio": {
              "idPais": GetPaisId(paciente.seccion1.pais),
              "idProvincia": GetProvinciaId(paciente.seccion1.provincia),
              "idDepartamento": GetDepartamentoId(paciente.seccion1.provincia, paciente.seccion1.departamento),
              "idLocalidad": GetLocalidadId(paciente.seccion1.provincia, paciente.seccion1.departamento, paciente.seccion1.localidad),
              "calle": paciente.seccion1.domicilioCalle,
              "numero": paciente.seccion1.domicilioNumero
            }
          },
          "diagnostico": {
            "establecimiento": GetEstablecimientoId(paciente.seccion1.institucion_provincia, paciente.seccion1.institucion_departamento, paciente.seccion1.institucion),//11820632184264,
            "diagnostico": 24426,
            "fechaDiagnostico": fechaDiag
          }
      };
  }

  return epfjson;
}

export const modificarPaciente = (id, paciente) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.patch(`/api/pacientes/${id}/edit`, { paciente }, config);
      console.log(res.data);
      dispatch({ type: PACIENTE_MODIFICADO, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response.data.message });
    }
  };
};

export const agregarSeguimientoPaciente = (paciente_id, seguimiento, user_id) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post(`/api/pacientes/${paciente_id}/seguimientos`, {seguimiento, user_id}, config);
      // const res = await axios.post("/api/pacientes/:id/seguimientos", paciente_id, seguimiento, config);
      console.log(res.data);
      dispatch({ type: PACIENTE_AGREGADO, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response.data.message });
    }
  };
};

export const modificarSeguimientoPaciente = (paciente_id, seguimiento_id, seguimiento) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.patch(`/api/pacientes/${paciente_id}/seguimientos/${seguimiento_id}/edit`, seguimiento, config);
      console.log(res.data);
      dispatch({ type: SEGUIMIENTO_PACIENTE, payload: res.data });
      // dispatch({ type: PACIENTE_AGREGADO, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response.data.message });
    }
  };
};

export const eliminarPaciente = (paciente_id) => {
  return async (dispatch) => {
    // const config = { header: { "Content-Type": "application/json" } };
    try {
      console.log("🚀 ~ file: pacienteAction.js ~ line 104 ~ return ~ paciente_id", paciente_id)
      const res = await axios.delete(`/api/pacientes/${paciente_id}`);
      // const res = await axios.delete('/api/pacientes', { data: { id: paciente_id } });
      console.log("here!", res.data.data);
      dispatch({ type: PACIENTE_ELIMINADO, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: PACIENTE_ERROR, payload: err.response.data.message });
    }
  };
};


export const agregarReceta = (file, pacienteid, fechaSeguimiento, tipoMedicacion) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append('receta', file);
      formData.append('pacienteid', pacienteid);
      formData.append('fechaSeguimiento', fechaSeguimiento);
      formData.append('tipoMedicacion', tipoMedicacion);

      const res = await axios.post(`/api/recetas`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);
      dispatch({ type: RECETA_AGREGADA, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: RECETA_ERROR, payload: err.response.data.message });
    }
  };
};


export const eliminarReceta = (recetaid) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.delete(`/api/recetas/${recetaid}`, config);
      console.log(res.data);
      dispatch({ type: RECETA_ELIMINADA, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: RECETA_ERROR, payload: err });
    }
  };
};


export const obtenerReceta = (recetaid) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.get(`/api/recetas/${recetaid}`, config);
      console.log(res);
      dispatch({ type: RECETA_DETALLES, payload: res.data });
    } catch (err) {
      console.log(err);
      console.log("Error al obtener receta: ", err.response);
      dispatch({ type: RECETA_ERROR, payload: err.response.data.message });
    }
  }
}

export const obtenerUsuariosCompartidos = (pacienteId) => {
  return async (dispatch) => {
    try {
      const config = { header: { "Content-Type": "application/json" } };
      const res = await axios.get(`/api/pacientes/${pacienteId}/usuariosCompartidos`, config);

      console.log(res.data);
      dispatch({ type: GET_SHARED, payload: res.data });
    }
    catch (err) {
      console.log(err);
      dispatch({ type: USERS_ERROR, payload: err.response.data.message })
    }
  };
};


export const actualizarRecetasSeguimiento = (pacienteId, seguimientoId, recetas) => {
  return async (dispatch) => {
    try {
      const config = { header: { "Content-Type": "application/json" } };
      const res = await axios.patch(`/api/pacientes/${pacienteId}/seguimientos/${seguimientoId}/recetas`, {recetas}, config);

      console.log(res.data);
      dispatch({type: UPDATE_RECETAS, payload: res.data});
    }
    catch(err) {
      console.log(err);
      dispatch({type: UPDATE_RECETAS_ERROR, payload: err.response.data.message});
    }
  }
}



// export const buscarPaciente = (texto) => {
//   return (dispatch) => {

//   };
//   // return async (dispatch) => {
//   //     const config = {header: {'Content-Type': 'application/json'}}
//   //     try {
//   //         const res = await axios.post('/api/pacientes', paciente, config)
//   //         console.log(res.data);
//   //         dispatch({type: PACIENTE_AGREGADO, payload: res.data})
//   //     } catch (err) {
//   //         console.log(err);
//   //         dispatch({type: PACIENTE_ERROR, payload: err.response.data.message})
//   //     }
//   // }
// };

// export const modificar = (email, password) => {
//     return async dispatch => {
//         try {
//             const config = {header: {'Content-Type': 'application/json'}}
//             const res = await axios.post(`/api/auth/login`, {email, password}, config);
//             dispatch({type: LOGIN_SUCCESS, payload: res.data});
//             } catch (err) {
//             console.log(err);
//             dispatch({type: LOGIN_FAIL, payload: err.response.data.message});
//             }
//         }
//     }
