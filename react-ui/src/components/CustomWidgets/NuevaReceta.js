import React, {useState, useEffect} from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalTitle, Overlay, Table, Tooltip, Image } from "react-bootstrap";
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
    const history = useHistory();

    const dispatch = useDispatch();

    useEffect(() => {
        if(state.receta._id && imagenAgregada && !seguimientoActualizado) {
            setSeguimientoActualizado(true);
            let newRecetas = [...recetas, {id: state.receta._id, fechaReceta: GetTodayDate(), fechaEnvio: "", cajasEnviadas: ""}]
            setRecetas(newRecetas)
            dispatch(actualizarRecetasSeguimiento(pacienteId, seguimientoId, newRecetas))
            setTimeout(() => {
                history.go(0);
            }, 300);
        }
    }, [state.receta._id, imagenAgregada, seguimientoActualizado])

    const convertImage = async (fechaSeguimiento) => {
        handleCloseModal()
        let archivo = document.getElementById('inputFile').files[0];
        setSeguimientoActualizado(false);
        setImagenAgregada(false);

        try {
            if(archivo && !imagenAgregada)
            {
                console.log("RECETA OK");
                dispatch(agregarReceta(archivo, state.paciente.seccion1.dni, fechaSeguimiento, tipoMedicacion));
                setImagenAgregada(true);
            }
            else
            {
                window.alert("ERROR con el formato de la receta. Por favor, utilice archivos de extensión .pdf, .jpg o .jpeg y vuelva a intentar")
                console.log("ERROR FORMATO FACTURA");
            }
        }
        catch (error)
        {
            window.alert("ERROR al subir la receta. Por favor, vuelva a intentar. \n Si persiste el problema, contactase con soporte para que podamos ayudarle.")
            console.log("ERROR FACTURA");
        }
    }

    function handleCloseModal() {
        setShowModal(false);
        setFileLoaded(false);
        setImagenAgregada(false);
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
                <Button variant="danger" onClick={handleCloseModal}>Cerrar</Button>
                <Button variant="success" onClick={handleGuardar} disabled={!fileLoaded||imagenAgregada||tipoMedicacion==null}>Guardar</Button>
            </ModalFooter>
        </Modal>
        </>
    ) 
}

export default NuevaReceta;