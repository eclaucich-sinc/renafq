import { combineReducers } from 'redux'
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import pacienteReducer from './pacienteReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  paciente: pacienteReducer
});