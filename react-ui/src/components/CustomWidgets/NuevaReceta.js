import React, {useState, useEffect} from "react";
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalTitle, Overlay, Table, Tooltip, Image } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { actualizarRecetasSeguimiento, agregarReceta } from "../../redux/_actions/pacienteAction";
import { PACIENTES_INIT } from "../../redux/types";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ModalInformativo from "../ModalInformativo";

function GetTodayDate() {
    const d = new Date();
  
    let day = d.getDate()
    let month = d.getMonth()+1
    let year = d.getFullYear().toString()

    let monthStr = month < 10 ? "0"+month.toString() : month.toString();
    let dayStr = day < 10 ? "0"+day.toString() : day.toString();

    return year+"-"+monthStr+"-"+dayStr;
  }

function NuevaReceta({recetasData, pacienteId, seguimientoId}) {

    const [recetas, setRecetas] = useState(recetasData);
    const state = useSelector((state) => state.paciente);
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const [tooltipModal, setTooltipModal] = useState(false);
    const targetModal = useRef(null);
    const [seguimientoActualizado, setSeguimientoActualizado] = useState(false);
    const [imagenAgregada, setImagenAgregada] = useState(false);
    const [fileLoaded, setFileLoaded] = useState(false);
    const [tipoMedicacion, setTipoMedicacion] = useState(null);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const history = useHistory();

    const dispatch = useDispatch();

    useEffect(() => {
        if(state.receta._id && imagenAgregada && !seguimientoActualizado) {
            console.log("Nuevo ID de receta agregada:", state.receta._id);
            setSeguimientoActualizado(true);
            let newRecetas = [...recetas, {id: state.receta._id, fechaReceta: GetTodayDate(), fechaEnvio: "", cajasEnviadas: ""}]
            console.log("Nueva lista de recetas:", newRecetas);
            setRecetas(newRecetas)
            dispatch(actualizarRecetasSeguimiento(pacienteId, seguimientoId, newRecetas))
            setAlert({ show: true, type: 'success', message: 'Receta guardada exitosamente...' });
            setTimeout(() => {
                history.go(0);
            }, 1500);
        }
    }, [state.receta._id, imagenAgregada, seguimientoActualizado])

    const convertImage = async (fechaSeguimiento) => {
        let archivo = document.getElementById('inputFile').files[0];
        setSeguimientoActualizado(false);
        setImagenAgregada(false);
        setAlert({ show: false, type: '', message: '' });

        try {
            if(archivo && !imagenAgregada)
            {
                console.log("RECETA OK");
                setAlert({ show: true, type: 'info', message: 'Subiendo receta, por favor espere...' });
                dispatch(agregarReceta(archivo, pacienteId, fechaSeguimiento, tipoMedicacion));
                setImagenAgregada(true);
            }
            else
            {
                setAlert({ show: true, type: 'danger', message: 'ERROR: No se ha seleccionado un archivo o el formato no es válido. Por favor, utilice archivos de extensión .pdf, .jpg o .jpeg' });
                console.log("ERROR FORMATO FACTURA");
            }
        }
        catch (error)
        {
            setAlert({ show: true, type: 'danger', message: 'ERROR al subir la receta. Por favor, vuelva a intentar. Si persiste el problema, contacte con soporte para que podamos ayudarle.' });
            console.log("ERROR FACTURA");
        }
    }

    function handleCloseModal() {
        setShowModal(false);
        setFileLoaded(false);
        setImagenAgregada(false);
        setAlert({ show: false, type: '', message: '' });
        setTipoMedicacion(null);
    }

    function handleGuardar() {
        convertImage(GetTodayDate())
    }

    function handleChangeInput() {
        setFileLoaded(true);
    }

    return (
        <>
        <button className='btn btn-sm btn-primary' onClick={handleShowModal}><FontAwesomeIcon icon={faPlus} className="mr-2" />Nueva Receta</button>
        <Modal show={showModal} onHide={handleCloseModal}>
            <ModalHeader closeButton>
                <Button variant="dark" className='btn btn-primary mr-3' ref={targetModal} onClick={() => setTooltipModal(!tooltipModal)}><FontAwesomeIcon icon={faInfoCircle}/></Button>
                <ModalTitle>Agregar receta para el paciente</ModalTitle>
                <Overlay target={targetModal.current} show={tooltipModal} placement="right">
                    {(props) => (
                        <Tooltip id="help-tooltipModal" {...props}>
                            En esta pantalla podrá agregar una nueva receta del paciente para el seguimiento en cuestión. Una vez cargada, automáticamente pasará al estado pendiente y podrá realizar el seguimiento de la misma en la pestaña "Recetas".
                        </Tooltip>
                    )}
                </Overlay>
            </ModalHeader>
            <ModalBody>
                {alert.show && (
                    <Alert variant={alert.type} onClose={() => setAlert({ show: false, type: '', message: '' })} dismissible>
                        {alert.message}
                    </Alert>
                )}
                <div>
                    <p>La dispensa de la medicación será cada 3 meses, está sujeta a que las variantes sean respondedoras a la triple terapia según las indicadas en la evaluación de <a href="https://www.argentina.gob.ar/sites/default/files/informe-18-moduladores-en-fq.pdf" target="_blank">Tecnología sanitaria</a>, y que los aspectos clínicos del paciente estén actualizados.</p>
                    <p>Cargue la receta digital en formato PDF</p>
                    <label class="custom-file-upload">
                        <input type="file" id="inputFile" accept="image/jpg, image/jpeg, application/pdf" onChange={handleChangeInput}/>
                    </label>

                    <div style={{ marginBottom: "1rem" }}>
                    <p><strong>Seleccione el tipo de medicación:</strong></p>
                    <label>
                        <input
                        type="radio"
                        name="tipoMedicacion"
                        value="modulador"
                        onChange={(e) => setTipoMedicacion(e.target.value)}
                        />
                        Modulador
                    </label>
                    <br />
                    <label>
                        <input
                        type="radio"
                        name="tipoMedicacion"
                        value="enzima"
                        onChange={(e) => setTipoMedicacion(e.target.value)}
                        />
                        Enzima
                    </label>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="danger" onClick={handleCloseModal} disabled={imagenAgregada && !seguimientoActualizado}>Cerrar</Button>
                <Button variant="success" onClick={handleGuardar} disabled={!fileLoaded||imagenAgregada||tipoMedicacion==null}>Guardar</Button>
            </ModalFooter>
        </Modal>
        </>
    ) 
}

export default NuevaReceta;