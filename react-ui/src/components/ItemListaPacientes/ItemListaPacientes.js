import React from 'react';
import { ReactComponent as FolderSvg } from '../../assets/Icons8_flat_folder.svg';
import { ReactComponent as RemoveSvg } from '../../assets/close-svgrepo-com.svg';
import { ReactComponent as EditSvg } from '../../assets/edit-svgrepo-com.svg';
import { useSelector, useDispatch } from 'react-redux'
import { Link, Route } from 'react-router-dom';
import Loader from 'react-loader-spinner';

const ItemListaPacientes = (props) => {

  const state = useSelector((state) => state.paciente);
  const dispatch = useDispatch();

  const paciente = (props.paciente) ? props.paciente : {};
  const { handleRemove, handleEdit } = props;

  const EditButton = ({pacienteId}) => {
    return <Route render={({history}) => (
      <button className='edit-icon' onClick={() => {
        handleEdit(pacienteId);
        history.push(`/paciente/${pacienteId}/edit`);
      }}>
        <EditSvg />
      </button>
    )} />
  }

  const iniciales = () => {
    let i = 0;
    if (paciente && paciente.seccion1) {
      i = paciente.seccion1.nombre ? paciente.seccion1.nombre[0].toUpperCase() : '';
      i += paciente.seccion1.apellido ? paciente.seccion1.apellido[0].toUpperCase() : '';
    }
    return i;
  }

    return (
      <>
        {
          paciente && paciente.seccion1 ?
          (
            <div className="paciente-card col-6 col-lg-2">
                <Link to={`/paciente/${paciente._id}`}>
                    <div className="folder-container">
                        <div className="folder-image">
                            <FolderSvg className="svg-icon" />
                            <div className="name-image">
                                <span className="logo">{iniciales()}</span>
                            </div>
                        </div>
                        <div className="folder-title px-3 pb-3">
                            {paciente.seccion1.nombre} {paciente.seccion1.apellido}
                        </div>
                    </div>
                </Link>
                <button className='remove-icon' onClick={() => handleRemove(paciente._id)}>
                  <RemoveSvg />
                </button>
                <EditButton pacienteId={paciente._id} />
                {/* <Link className="navbar-brand" to={`/`} onClick={onClickGoHome} >Fibrosis Quística</Link>
                <button class='edit-icon' onClick={() => handleRemove(paciente._id)}>
                  <EditSvg />
                </button> */}
            </div>
          ) :
          (
            <div className="col">
              <Loader
                className="text-center"
                type="ThreeDots"
                color="#999999"
                height={100}
                width={100}
              />
            </div>
          )
        }
      </>
  )
}

export default ItemListaPacientes;
