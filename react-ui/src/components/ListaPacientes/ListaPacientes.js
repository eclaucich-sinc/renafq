import React, { useState, useEffect } from "react";
import ItemListaPacientes from "../ItemListaPacientes/ItemListaPacientes";
import Search from "../Buscar/Buscar";
import { obtenerPacientes } from "../../redux/_actions/pacienteAction";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../../redux/_actions/alertAction";
import { PACIENTE_ERROR, PACIENTES_CARGADOS, MODIFICAR_PACIENTE } from "../../redux/types";
import { USER_LOADED, AUTH_ERROR } from '../../redux/types';
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import Loader from "react-loader-spinner";
import { eliminarPaciente } from '../../redux/_actions/pacienteAction';
import ItemListaPacientesCompartidos from "../ItemListaPacientesCompartidos/ItemListaPacientesCompartidos";
import ItemListaPacientesSinEdicion from "../ItemListaPacientesSinEdicion/ItemListaPacientesSinEdicion";
import { ReactComponent as FolderCreado } from '../../assets/Icons8_flat_folder.svg';
import { ReactComponent as FolderCompartido } from '../../assets/folder-shared.svg';

function ListaPacientes({ history }) {
  const state = useSelector((state) => state.paciente);
  const stateAuth = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const [numeroPacientes, setNumeroPacientes] = useState(state.pacientes.length);
  const [pacienteAgregado, setPacienteAgregado] = useState(state.agregado);
  const [pacientesObtenidos, setPacientesObtenidos] = useState(false);

  useEffect(() => {
    if (localStorage.token) {
      // loadUser();
      if (state.pacientesFiltrados.length === 0) {
        if (stateAuth.user && !pacientesObtenidos) {
          setPacientesObtenidos(true);
          dispatch(obtenerPacientes(stateAuth.user));
        }
      }

      if (state.pacientes.length !== numeroPacientes) {
        setNumeroPacientes(state.pacientes.length);
        state.pacientesFiltrados = state.pacientes;
      }

      if (pacienteAgregado) {
        dispatch(obtenerPacientes(stateAuth.user));
        setPacienteAgregado(false);
        state.pacientesFiltrados = state.pacientes;
      }

      // if(pacientesObtenidos && state.pacientesFiltrados.length > 0) {
      //   console.log("COMPARTIDOS: " + state.pacientesCompartidos);
      //   setTodosPacientes([]);
      //   state.pacientesFiltrados.forEach(p => {
      //     console.log("NOT SHRED");
      //     todosPacientes.push({paciente: p, compartido: false});
      //   });
        
      //   state.pacientesCompartidos.forEach(p => {
      //     console.log("SHRED");
      //     todosPacientes.push({paciente: p, compartido: true});
      //   });
      // }

      // if (state.error !== null) {
      //   dispatch(setAlert(state.error, "danger"));
      // }
    } else history.push("/login");

    // useEffect se llama cada vez que una de las variables puestas en el array del segundo parámetro se modifica,
    // por lo que debemos usar una variable que no se modifique (que no modifiquemos dentro del useEffect) para evitar múltiples llamadas al mismo
  }, [state.pacientes, stateAuth.user]);
  // }, [state.error, state.pacientes]);

  // const loadUser = async () => { 
  //   setAuthToken(localStorage.token);
  //   try {
  //     const res = await axios.get('/api/auth/me');
  //     dispatch({type: USER_LOADED, payload: res.data});
  //   } catch (err) {
  //     console.log(err);
  //     dispatch({type: AUTH_ERROR, payload: err.message}); 
  //   }
  // };

  const handleRemove = (id) => {
    console.log(id);
    if (window.confirm('¿Desea eliminar a este paciente?')) {
      console.log("Paciente eliminado");
      dispatch(eliminarPaciente(id));
    };
  };

  const handleEdit = (id) => {
    console.log(id);
    dispatch({type: MODIFICAR_PACIENTE});
  };

  // Esta es la alternativa
  // const cargarPacientes = async () => {

  //     // seteamos el token en el header cuando vamos a usar "axios" para llamar a la API
  //     setAuthToken(localStorage.token);
  //     try {
  //         const res = await axios.get('/api/pacientes');
  //         dispatch({
  //             type: PACIENTES_CARGADOS,
  //             payload: res.data
  //         });

  //         setLoading(false);
  //     } catch (err) {
  //         console.log(err);
  //         dispatch({type: PACIENTE_ERROR, payload: err.message});
  //     }
  // }

  return (
    <React.Fragment>
      <Search pacientes={state.pacientesFiltrados} />
      <div className="container">
        <h6 className="d-inline ml-2">
          <FolderCreado viewBox="10 10 30 30" className="svg-inline--fa mr-2 svg-icon" />
            Mis pacientes
        </h6>
        <h6 className="d-inline ml-4">
          <FolderCompartido viewBox="10 10 30 30" className="svg-inline--fa mr-2 svg-icon" />
            Pacientes que me están compartiendo
        </h6>
      </div>
      <div className="container pacientes-container">
        <div className="row bg-white mx-0 border border-dark py-3">
          {!state.loading ? (
            state.pacientesFiltrados.length === 0 ? (
              <div className="col">
                <h5 className="text-center my-5">
                  No hay pacientes para mostrar
                </h5>
              </div>
            ) : (
              state.pacientesFiltrados.map((paciente) => {
                if(paciente.seccion1.nombre==="Prueba"){
                  console.log(paciente)
                }
                if(paciente.seccion1.fallecimiento==="Sí" || stateAuth.user.rol==="EPF") {
                  return (
                    <ItemListaPacientesSinEdicion key={paciente._id} paciente={paciente} />
                  );
                }
                else if(paciente.compartido) {
                  return (
                    <ItemListaPacientesCompartidos key={paciente._id} paciente={paciente} handleRemove={handleRemove} handleEdit={handleEdit} />
                  );
                }
                else {
                  return (
                    <ItemListaPacientes key={paciente._id} paciente={paciente} handleRemove={handleRemove} handleEdit={handleEdit} />
                  );
                }
              })
            )
          ) : (
            <div className="col">
              <Loader
                className="text-center"
                type="ThreeDots"
                color="#999999"
                height={100}
                width={100}
              />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default ListaPacientes;
