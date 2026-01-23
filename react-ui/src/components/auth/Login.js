import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../../redux/_actions/authAction'
import { Link } from 'react-router-dom'
import { setAlert } from '../../redux/_actions/alertAction'
import { CLEAR_ERRORS } from '../../redux/types'

const Login = ({history}) => {

  const state = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state.isAuthenticated) {
      history.push('/');
    }
    if (state.error === 'Invalid Creds..') {
      dispatch(setAlert(state.error, 'danger'));
      dispatch({type: CLEAR_ERRORS});
    }
    // eslint-disable-next-line
  }, [state.isAuthenticated, state.error]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    if(email === '' || password === ''){
      dispatch(setAlert('Please enter all the fields.', 'danger'));
    }else{
      dispatch(login(email, password));
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 offset-md-3 col-md-6 mt-md-5">
          <div className="card border border-dark">
            <div className="card-header">
              <h2 className="text-primary mb-0">Bienvenido</h2>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="password">Contraseña</label>
                  <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                {/* <p>Register to login <Link to="/register">Register</Link></p> */}
                <input type="submit" value="Ingresar" className="btn btn-primary btn-block"/>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
