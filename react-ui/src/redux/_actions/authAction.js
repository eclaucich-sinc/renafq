import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  GET_USERS,
  USERS_ERROR,
  ADD_SHARED,
  REMOVE_SHARED,
} from "../types";
import axios from "axios";
import jwt from "jsonwebtoken";
import setAuthToken from "../../utils/setAuthToken";


export function setCurrentUser(user) {
  return async (dispatch) => {
    loadUsers(dispatch);
  };
};

const loadUsers = async (dispatch) =>{ 
  setAuthToken(localStorage.token);
  try {
    console.log("LLAMADA!!!");
    const res = await axios.get('/api/auth/me');
    console.log(res.data);
    dispatch({type: USER_LOADED, payload: res.data});
  } catch (err) {
    console.log(err);
    dispatch({type: AUTH_ERROR, payload: err.message}); 
  }
}

export const register = (user) => {
  return async (dispatch) => {
    const config = { header: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/auth/register", user, config);
      console.log(res.data);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: REGISTER_FAIL, payload: err.response.data.message });
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const config = { header: { "Content-Type": "application/json" } };
      const res = await axios.post(
        `/api/auth/login`,
        { email, password },
        config
      );

      console.log( jwt.decode(res.data.token) )
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: LOGIN_FAIL, payload: err.response.data.message });
    }
  };
};


export const obtenerUsuariosParaCompartir = (user) => {
  return async (dispatch) => {
    try {
      const config = { header: { "Content-Type": "application/json" } };
      const res = await axios.get(`/api/auth/usuariosCompartir`, user, config);

      console.log(res.data);
      dispatch({ type: GET_USERS, payload: res.data });
    }
    catch (err) {
      console.log(err);
      dispatch({ type: USERS_ERROR, payload: err.response.data.message })
    }
  };
};

export const agregarUsuariosCompartir = (pacienteId, shared) => {
  return async (dispatch) => {
    try {
      const config = { header: { "Content-Type": "application/json" } };
      const res = await axios.patch(`/api/auth/addUsuariosCompartir`, {pacienteId, shared}, config);

      console.log(res.data);
      dispatch({ type: ADD_SHARED, payload: res.data });
    }
    catch (err) {
      console.log(err);
      dispatch({ type: USERS_ERROR, payload: err.response.data.message })
    }
  }
}

export const quitarUsuariosCompartir = (pacienteId, stop_sharing) => {
  return async (dispatch) => {
    try {
      const config = { header: { "Content-Type": "application/json" } };
      const res = await axios.patch(`/api/auth/removeUsuariosCompartir`, {pacienteId, stop_sharing}, config);

      console.log(res.data);
      dispatch({ type: REMOVE_SHARED, payload: res.data });
    }
    catch (err) {
      console.log(err);
      dispatch({ type: USERS_ERROR, payload: err.response.data.message })
    }
  }
}
