import {REGISTER_SUCCESS, CLEAR_ERRORS, LOGIN_SUCCESS, REGISTER_FAIL, LOGIN_FAIL, LOGOUT, AUTH_ERROR, USER_LOADED, USERS_ERROR, GET_USERS} from '../types'

const initState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  error: null,
  loading: true,
  users: []
}

const authReducer = (state = initState, action) => {
  switch(action.type){
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: action.payload.data
        }
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        localStorage.setItem('token', action.payload.token)
        console.log("🚀 ~ file: authReducer.js ~ line 23 ~ authReducer ~ action.payload", action.payload)
        return {
          ...state,
          token: action.payload.token,
          isAuthenticated: true,
          user: action.payload.user,
          loading: false
        }
      case REGISTER_FAIL:
      case AUTH_ERROR:
      case LOGIN_FAIL:
      case LOGOUT:
          localStorage.removeItem('token') 
          return {
            ...state,
            token: null,
            isAuthenticated: false,
            user: null,
            error: action.payload
          }
      case GET_USERS:
        return {
          ...state,
          users: action.payload.data
        }
      case USERS_ERROR: 
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
          }
      default:
        return state;
  }     
}

export default authReducer;