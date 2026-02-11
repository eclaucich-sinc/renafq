import React, {useState, useEffect} from "react";
import { Button, InputGroup, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalTitle, Overlay, Table, Tooltip, Image } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross, faFile, faInfoCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { actualizarRecetasSeguimiento, eliminarReceta, obtenerUsuariosCompartidos } from "../../redux/_actions/pacienteAction";
import ImagenReceta from "./ImagenReceta";
import { PACIENTES_INIT } from "../../redux/types";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function InfoRecetas({recetasData, pacienteId, seguimientoId}) {

    const [recetas, setRecetas] = useState(recetasData);
    const state = useSelector((state) => state.paciente);
    const stateAuth = useSelector(state => state.auth);
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => {
        console.log("=== DATOS DE RECETAS ===");
        console.log("recetasData recibido:", recetasData);
        console.log("recetas (estado local):", recetas);
        recetas.forEach((rec, idx) => {
            console.log(`Receta ${idx}:`, rec);
        });
        setShowModal(true);
    }
    const handleCloseModal = () => setShowModal(false);
    const [showImage, setShowImage] = useState(false);
    const [tooltipModal, setTooltipModal] = useState(false);
    const targetModal = useRef(null);
    const history = useHistory();



    const dispatch = useDispatch();

    const onChangeInput = (e,i) => {
        const {name, value } = e.target

        const editData = recetas.map((item, idx) =>
            idx === i && name ? { ...item, [name]: value } : item
        )
        setRecetas(editData)
    }

    function handleGuardar() {
        handleCloseModal()
        dispatch(actualizarRecetasSeguimiento(pacienteId, seguimientoId, recetas))
    }

    function onAceptarPedido(i) {
        handleCloseModal()
        const editData = [...recetas]
        editData[i].aceptado = true
        setRecetas(editData)
        dispatch(actualizarRecetasSeguimiento(pacienteId, seguimientoId, recetas))
    }

    function onRechazarPedido(i) {
        handleCloseModal()
        const editData = [...recetas]
        editData[i].aceptado = false
        setRecetas(editData)
        dispatch(actualizarRecetasSeguimiento(pacienteId, seguimientoId, recetas))
    }


    function onEliminarReceta(i){
        if(window.confirm("¿Está seguro de eliminar la receta? Se eliminará todo registro de la misma."))
        {
            dispatch(eliminarReceta(recetas[i].id))
            const recid = recetas[i].id
            const editData = recetas.filter(rec => rec.id!==recid)
            setRecetas(editData)
            dispatch(actualizarRecetasSeguimiento(pacienteId, seguimientoId, editData))
            handleCloseModal()
        }
    }

    return (
        <>
            <button className='btn btn-sm btn-primary' onClick={handleShowModal}><FontAwesomeIcon icon={faFile} className="mr-2" />Recetas</button>
            <Modal size="lg" show={showModal} onHide={handleCloseModal}>
                <ModalHeader closeButton>
                    <Button variant="dark" className='btn btn-primary mr-3' ref={targetModal} onClick={() => setTooltipModal(!tooltipModal)}><FontAwesomeIcon icon={faInfoCircle}/></Button>
                    <ModalTitle>Recetas del paciente</ModalTitle>
                    <Overlay target={targetModal.current} show={tooltipModal} placement="right">
                        {(props) => (
                            <Tooltip id="help-tooltipModal" {...props}>
                                En esta pantalla se listan todas las recetas del paciente asociadas al seguimiento en cuestión. Una vez caragada una nueva receta automáticamente entrará en estado pendiente y, una vez finalizado el proceso, se completarán los datos de fecha de envío y cajas enviadas según corresponda.
                            </Tooltip>
                        )}
                    </Overlay>
                </ModalHeader>
                <ModalBody>
                    <div class="table-responsive">
                        <Table striped>
                            <thead class="thead-dark">
                                <tr>
                                    <th>Eliminar</th>
                                    <th>Imagen</th>
                                    <th>Fecha receta</th>
                                    <th>Fecha envío medicamento</th>
                                    <th>Cajas enviadas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recetas.map((item, i) => {
                                    if(stateAuth.user.rol==="admin" || stateAuth.user.rol==="EPF") { // Lo que ve un usuario ADMIN
                                        if(!item.hasOwnProperty("aceptado")){ //Muestro los botones de aceptar/rechazar
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <Button variant="danger" onClick={() => onEliminarReceta(i)}><FontAwesomeIcon icon={faTrash}/></Button>
                                                    </td>
                                                    {(item.id!=null && item.id!=="" && 
                                                    <td>
                                                        <ImagenReceta recetaid={item.id}></ImagenReceta>
                                                    </td>)
                                                    }
                                                    <td>{item.fechaReceta}</td>
                                                    <td>
                                                        <Button variant="success" onClick={() => onAceptarPedido(i)}>Aceptar</Button>
                                                    </td>
                                                    <td>
                                                        <Button variant="danger" onClick={() => onRechazarPedido(i)}>Rechazar</Button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        else if(item.aceptado){ //muestro para agregar las cajas y fecha
                                            return (
                                                <tr key={i}>
                                                    <td></td>
                                                    {(item.id!=null && item.id!=="" && 
                                                    <td>
                                                        <ImagenReceta recetaid={item.id}></ImagenReceta>
                                                    </td>)
                                                    }
                                                    <td>{item.fechaReceta}</td>
                                                    <td>
                                                        <input 
                                                            name="fechaEnvio"
                                                            value={item.fechaEnvio}
                                                            type="date"
                                                            onChange={(e)=>onChangeInput(e,i)}>
                                                        </input>
                                                    </td>
                                                    <td>
                                                        <input 
                                                            name="cajasEnviadas"
                                                            value={item.cajasEnviadas}
                                                            type="number"
                                                            onChange={(e)=>onChangeInput(e,i)}>
                                                        </input>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        else{ //muestro para agregar razones de rechazo
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <Button variant="danger" onClick={() => onEliminarReceta(i)}><FontAwesomeIcon icon={faTrash}/></Button>
                                                    </td>
                                                    {(item.id!=null && item.id!=="" && 
                                                    <td>
                                                        <ImagenReceta recetaid={item.id}></ImagenReceta>
                                                    </td>)
                                                    }
                                                    <td>{item.fechaReceta}</td>
                                                    <td>
                                                        <Button variant="success" onClick={() => onAceptarPedido(i)}>Aceptar</Button>
                                                    </td>
                                                    <td colSpan={2}>
                                                        <input 
                                                            name="razonRechazo"
                                                            value={item.razonRechazo}
                                                            type="text"
                                                            onChange={(e)=>onChangeInput(e,i)}>
                                                        </input>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    }
                                    else { //Loq ue ve un usuario normal
                                        if(!item.hasOwnProperty("aceptado")) {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <Button variant="danger" onClick={() => onEliminarReceta(i)}><FontAwesomeIcon icon={faTrash}/></Button>
                                                    </td>
                                                    {(item.id!=null && item.id!=="" && 
                                                        <td>
                                                            <ImagenReceta recetaid={item.id}></ImagenReceta>
                                                        </td>)
                                                    }
                                                    <td>{item.fechaReceta}</td>
                                                    <td colSpan={2}>Pedido pendiente de aceptación</td>
                                                </tr>
                                            )
                                        }
                                        else {
                                            if(item.aceptado)
                                            {
                                                return (
                                                    <tr key={i}>
                                                        <td></td>
                                                        {(item.id!=null && item.id!=="" && 
                                                            <td>
                                                                <ImagenReceta recetaid={item.id}></ImagenReceta>
                                                            </td>)
                                                        }
                                                        <td>{item.fechaReceta}</td>
                                                        <td>{item.fechaEnvio}</td>
                                                        <td>{item.cajasEnviadas}</td>
                                                    </tr>
                                                )
                                            }
                                            else{
                                                return (
                                                    <tr key={i}>
                                                        <td>
                                                            <Button variant="danger" onClick={() => onEliminarReceta(i)}><FontAwesomeIcon icon={faTrash}/></Button>
                                                        </td>
                                                        {(item.id!=null && item.id!=="" && 
                                                            <td>
                                                                <ImagenReceta recetaid={item.id}></ImagenReceta>
                                                            </td>)
                                                        }
                                                        <td>{item.fechaReceta}</td>
                                                        <td>Pedido rechazado</td>
                                                        <td>{item.razonRechazo}</td>
                                                    </tr>
                                                )
                                            }
                                            
                                        }
                                    }
                                })}
                            </tbody>
                        </Table>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="danger" onClick={handleCloseModal}>Cerrar</Button>
                    {(stateAuth.user.rol==="admin" || stateAuth.user.rol==="EPF") ? 
                        (<Button variant="success" onClick={handleGuardar}>Guardar</Button>):<></>
                    }
                </ModalFooter>
            </Modal>
        </>
    ) 
}

export default InfoRecetas;