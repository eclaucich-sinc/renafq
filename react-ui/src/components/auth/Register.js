import React,{ useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../../redux/_actions/authAction';
import { setAlert } from '../../redux/_actions/alertAction'
import { CLEAR_ERRORS } from '../../redux/types';


const Register = ({history}) => {

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();


  useEffect(() => {
    // if (localStorage.getItem('token') && auth.isAuthenticated) {
    //   history.push('/login');
    // }

    if (auth.user && auth.user.rol !== 'admin') {
      history.push('/login');
    }

    if (auth.error === '¡El usuario ya existe!') {
      dispatch(setAlert(auth.error, 'danger'));
      dispatch({type: CLEAR_ERRORS});
    }
    // eslint-disable-next-line
  }, [auth.isAuthenticated, auth.error]);

  const [newUser, setNewUser] = useState({
    name: '',
    apellido: '',
    dni: '',
    institucion: '',
    cargo: '',
    email: '',
    password: ''
  });

  const {name, apellido, dni, institucion, cargo, email, password} = newUser; 

  const onChange = (e) => setNewUser({...newUser, [e.target.name]: e.target.value});

  const onSubmit = e => {
    e.preventDefault();

    if (name === '' || apellido === '' || dni === '' || email === '' || password === '')
      dispatch(setAlert('Por favor, ingrese todos los campos.', 'danger'));
    else
      dispatch(register(newUser));
  }

  return (
    <div className="form-container">
      <h1>
        Registro de <span className="text-primary">usuarios</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="form-group col col-md-6">
            <label htmlFor="name">Nombre</label>
            <input type="text" name="name" value={name} onChange={onChange}/>
          </div>
          <div className="form-group col col-md-6">
            <label htmlFor="name">Apellido</label>
            <input type="text" name="apellido" value={apellido} onChange={onChange}/>
          </div>
          <div className="form-group col col-md-6">
            <label htmlFor="name">DNI</label>
            <input type="text" name="dni" value={dni} onChange={onChange}/>
          </div>
          <div className="form-group col col-md-6">
            <label htmlFor="name">Institución/Servicio al que pertenece</label>
            <input type="text" name="institucion" value={institucion} onChange={onChange}/>
          </div>
          <div className="form-group col col-md-6">
            <label htmlFor="name">Cargo</label>
            <input type="text" name="cargo" value={cargo} onChange={onChange}/>
          </div>
          <div className="form-group col col-md-12">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={email} onChange={onChange}/>
          </div>
          <div className="form-group col col-md-12">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={password} onChange={onChange} minLength='6'/>
          </div>
          <input type="submit" value="Registrar" className="btn btn-primary btn-block"/>
        </div>
      </form>
    </div>
  )
}

export default Register;
