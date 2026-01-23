import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware, compose }from 'redux';
import { Provider }from 'react-redux';
import rootReducers from './redux/_reducers';
import thunk from 'redux-thunk';
import './index.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import setAuthToken from './utils/setAuthToken';
import jwt from 'jsonwebtoken';
import { setCurrentUser } from './redux/_actions/authAction';

const middlewares = [thunk]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducers,  composeEnhancers(applyMiddleware(...middlewares)));

// const loadUser = async () => { 
//     // setAuthToken(localStorage.token);
//     try {
//       const res = await axios.get('/api/auth/me');
//       dispatch({type: USER_LOADED, payload: res.data});
//     } catch (err) {
//       console.log(err);
//       dispatch({type: AUTH_ERROR, payload: err.message}); 
//     }
//   };

// import token if exists. This allow autologin of users when reloading
if (localStorage.token) {
  setAuthToken(localStorage.token);
  store.dispatch(setCurrentUser(jwt.decode(localStorage.token)));
}

ReactDOM.render(
  <Provider store={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
