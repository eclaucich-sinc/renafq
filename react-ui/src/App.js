import React from "react";
import "./App.css";
import setAuthToken from "./utils/setAuthToken";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/routing/PrivateRoute";
import Home from "./components/pages/Home";
// import Header from './components/Header/Header';
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import LandingPage from "./components/pages/LandingPage";
import Formulario from "./components/Formulario/Formulario";
import FormularioSeguimiento from "./components/FormularioSeguimiento/FormularioSeguimiento";
import ListaPacientes from "./components/ListaPacientes/ListaPacientes";
import Navbar from "./components/partials/Navbar";
import Alerts from "./components/partials/Alerts";
import DetallesPaciente from "./components/DetallesPaciente/DetallesPaciente";
import NotFound from "./components/NotFound/NotFound";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  document.title = "Fibrosis Quística";
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Alerts />
        <Switch>
          {/* <PrivateRoute exact path='/' component={ListaPacientes}/> Usando "PrivateRoute" hacemos que se solicite estar logueado para entrar */}
          <Route exact path="/" component={ListaPacientes} />
          <PrivateRoute exact path="/home" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/paciente/alta" component={Formulario} />
          <Route exact path="/paciente/:id" component={DetallesPaciente} />
          <Route exact path="/paciente/:id/edit" component={Formulario} />
          <Route exact path="/paciente/:id/seguimiento" component={FormularioSeguimiento} />
          <Route exact path="/paciente/:id/seguimiento/:sid/edit" component={FormularioSeguimiento} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
