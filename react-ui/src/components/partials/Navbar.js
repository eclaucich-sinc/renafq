import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import PropTypes from 'prop-types'
import {AGREGAR_PACIENTE, LISTAR_PACIENTES, LOGOUT, PACIENTES_INIT} from '../../redux/types'
import { Link, withRouter, useLocation, Route } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import setAuthToken from '../../utils/setAuthToken'

const Navbar = ({title, icon}) => {

  const location = useLocation();
  const auth = useSelector(state => state.auth)

  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch({ type: LOGOUT });
    dispatch({ type: PACIENTES_INIT });
    setAuthToken(false);
  };

  const AgregarPaciente = () => {
    return <Route render={({history}) => (
      <a href='javascript:;' className='nav-link' onClick={() => {
        dispatch({ type: AGREGAR_PACIENTE });
        history.push(`/paciente/alta`);
      }}>
        <FontAwesomeIcon icon={faUserPlus} className="mr-2" />Agregar paciente
      </a>
    )} />
  }

  const GoHome = () => {
    return <Route render={({history}) => (
      <div>
        <a href='javascript:;' className='navbar-brand' onClick={() => {
          dispatch({ type: LISTAR_PACIENTES });
          history.push(`/`);
        }}>
          Fibrosis Quística
        </a>
        <img src={require("./renafq.png")} className='logo'/>
      </div>
      
    )} />
  }

  const authLinks = (
    <>
      <li>
        <AgregarPaciente />
        {/* <Link className="nav-link" to={`/paciente/alta`}><FontAwesomeIcon icon={faUserPlus} className="mr-2" />Agregar paciente</Link> */}
      </li>
      <li>
        <Link className="nav-link" onClick={onLogout} to={`/login`}><FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/>Cerrar sesión</Link>
        {/* <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"><span className="hide-sm">Logout</span></i>
        </a> */}
      </li>
    </>
  )

  const guestLinks = (
    <>
       <li className="nav-item active">
          <Link to="/login">Login</Link>
        </li>
        <li className="nav-item active">
          <Link to="/register">Register</Link>
        </li>
    </>
  )

  return (
    // <div className="navbar bg-primary">
    //   <h2>
    //   <Link to="/"><i className={icon}/> {title}</Link>
    //   </h2>
    //   <ul>
    //     {auth.isAuthenticated ? authLinks : guestLinks}
    //   </ul>
    // </div>

    <nav className="navbar navbar-expand-lg navbar-light navbar-color py-3 sticky-top">
      <div className="container non-colored">
          {/* <Link className="navbar-brand" to={`/`} onClick={onClickGoHome} >Fibrosis Quística</Link> */}
          <GoHome />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarmenu" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
          </button>

          <div id="navbarmenu" className="ml-3 collapse navbar-collapse menu-items">
              {/* <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                      <Link className="nav-link" to={`/paciente/alta`}><FontAwesomeIcon icon={faUserPlus} className="mr-2" />Agregar paciente</Link>
                  </li>
              </ul> */}
              <ul className="navbar-nav">
                {auth.isAuthenticated ? authLinks : ''}
                  {/* <li className="nav-item active">
                      <Link className="nav-link" to={`/logout`}><FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/>Cerrar sesión</Link>
                  </li> */}
              </ul>
          </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string
}

Navbar.defaultProps = {
  title: "App Title",
  icon: 'fas fa-lightbulb'
}

export default withRouter(Navbar);
