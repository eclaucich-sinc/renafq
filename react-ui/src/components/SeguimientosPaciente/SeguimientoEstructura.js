import React, { useState } from 'react';
import { ReactComponent as FolderSvg } from '../../assets/Icons8_flat_folder.svg';
// import folder from '../../assets/Icons8_flat_folder.svg';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

function SeguimientoEstructura({seguimiento}) {

  const [estaActivo, setEstaActivo] = useState(false)
  const [estaDesplegado, setEstaDesplegado] = useState(false)

  return (
    <div key={seguimiento.id} className="col-6 col-md-2 my-2">
      <button className={"btn btn-lg btn-outline-primary w-100 font-weight-bold" + (estaActivo ? " active" : "")}
        data-toggle="collapse"
        data-target={"#collapseSeguimiento" + seguimiento.id}
        aria-expanded="false"
        aria-controls={"collapseSeguimiento" + seguimiento.id}
        onClick={() => setEstaActivo(!estaActivo)}>
        {seguimiento.id}
      </button>
    </div>
  )
}

export default SeguimientoEstructura;
