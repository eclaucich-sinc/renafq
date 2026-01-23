import {
  PACIENTE_AGREGADO,
  PACIENTE_MODIFICADO,
  PACIENTE_ELIMINADO,
  PACIENTE_ERROR,
  PACIENTES_CARGADOS,
  DETALLES_PACIENTE,
  SEGUIMIENTO_PACIENTE,
  PACIENTE_BUSQUEDA,
  PACIENTES_INIT,
  LISTAR_PACIENTES,
  MODIFICAR_PACIENTE,
  AGREGAR_PACIENTE,
  AGREGAR_SEGUIMIENTO,
  MODIFICAR_SEGUIMIENTO,
  PACIENTE_AGREGADO_EPF,
  RECETA_DETALLES,
  RECETA_AGREGADA,
  GET_SHARED,
  UPDATE_RECETAS,
  UPDATE_RECETAS_ERROR,
  RECETA_ELIMINADA
} from "../types";

const initialState = {
  agregar: false,
  agregado: false,
  modificar: false,
  modificado: false,
  eliminar: false,
  eliminado: false,
  pacientes: [],
  pacientesFiltrados: [],
  paciente: {},
  seguimientoPaciente: {},
  agregarSeguimiento: false,
  modificarSeguimiento: false,
  loading: true,
  error: null,
  receta: {},
  recetas: {},
  sharedUsers: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LISTAR_PACIENTES:
      return {
        ...state,
        loading: true,
        sharedUsers: []
      };
    case AGREGAR_PACIENTE:
      return {
        ...state,
        agregar: true,
        modificar: false,
        paciente: {},
        seguimientoPaciente: {},
      };
    case PACIENTE_AGREGADO_EPF:
      console.log("Paciente agregado en EPF!");
      return {
        ...state,
      };
    case PACIENTE_AGREGADO:
      console.log("Paciente agregado!");
      return {
        ...state,
        agregado: true,
        pacientes: state.pacientes.filter(
          (paciente) => {
            return paciente._id !== action.payload.data._id
          }
        ),
      };
    // caso cuando se presionó para modificar un paciente
    case MODIFICAR_PACIENTE:
      return {
        ...state,
        agregar: false,
        modificar: true,
      };
    // cuando se terminó de modificar un paciente
    case PACIENTE_MODIFICADO:
      return {
        ...state,
        modificado: true,
      };
    case PACIENTE_ELIMINADO:
      return {
        ...state,
        eliminado: true,
        pacientes: state.pacientes.filter(
          (paciente) => {
            return paciente._id !== action.payload.data._id
          }
        ),
      };
    case PACIENTES_CARGADOS:
      return {
        ...state,
        loading: false,
        pacientes: action.payload.data,
        pacientesFiltrados: action.payload.data,
        paciente: {},
        seguimientoPaciente: {},
      };
    case DETALLES_PACIENTE:
      return {
        ...state,
        loading: false,
        pacientes: [],
        pacientesFiltrados: [],
        paciente: action.payload.data,
        seguimientoPaciente: {},
      };
    case SEGUIMIENTO_PACIENTE:
      return {
        ...state,
        loading: false,
        pacientes: [],
        pacientesFiltrados: [],
        seguimientoPaciente: action.payload.data
      };
    case AGREGAR_SEGUIMIENTO:
      return {
        ...state,
        agregarSeguimiento: true,
        modificarSeguimiento: false,
        // loading: false,
        // pacientes: [],
        // pacientesFiltrados: [],
        // seguimientoPaciente: []
      };
    case MODIFICAR_SEGUIMIENTO:
      return {
        ...state,
        agregarSeguimiento: false,
        modificarSeguimiento: true,
        // loading: false,
        // pacientes: [],
        // pacientesFiltrados: [],
        // seguimientoPaciente: []
      };
    case PACIENTE_BUSQUEDA:
      return {
        ...state,
        loading: false,
        pacientesFiltrados:
          action.payload === ""
            ? state.pacientes
            : state.pacientes.filter(
                (paciente) =>
                  paciente.seccion1.nombre.toLowerCase().includes(action.payload) ||
                  paciente.seccion1.apellido.toLowerCase().includes(action.payload) ||
                  paciente.seccion1.dni.toString().includes(action.payload)
              ),
        paciente: {},
        seguimientoPaciente: {},
      };
    case PACIENTE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case PACIENTES_INIT:
      state = initialState;
      return {
        ...state,
      };
    case RECETA_DETALLES:
      return {
        ...state,
        recetas: {...state.recetas, [action.payload.data._id.toString()]: action.payload.data}
      };
    case RECETA_AGREGADA:
      return {
        ...state,
        receta: action.payload.data,
        recetas: {...state.recetas, [action.payload.data._id.toString()]: action.payload.data},
      };
    case RECETA_ELIMINADA:
      return {
        ...state,
        receta: null,
        recetas: state.recetas.filter(
          (rec) => {
            return rec._id !== action.payload.data._id.toString()
          }
        )
      };
    case GET_SHARED:
      return {
        ...state,
        sharedUsers: action.payload.data,
      };
    case UPDATE_RECETAS:
      return {
        ...state,
      };
    case UPDATE_RECETAS_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
