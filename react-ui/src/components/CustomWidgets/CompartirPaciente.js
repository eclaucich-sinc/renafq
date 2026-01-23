import React, {useState, useEffect} from "react";
import { Button, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalTitle, Overlay, Tooltip } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faShare, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { agregarUsuariosCompartir, obtenerUsuariosParaCompartir, quitarUsuariosCompartir } from "../../redux/_actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { obtenerUsuariosCompartidos } from "../../redux/_actions/pacienteAction";

function CompartirPaciente() {

    const stateAuth = useSelector(state => state.auth);
    const state = useSelector((state) => state.paciente);


    const [showCompartir, setShowCompartir] = useState(false);
    const [showDejarCompartir, setShowDejarCompartir] = useState(false);


    const handleShowCompartir = () => setShowCompartir(true);
    const handleCloseCompartir = () => setShowCompartir(false);

    const handleShowDejarCompartir = () => setShowDejarCompartir(true);
    const handleCloseDejarCompartir = () => setShowDejarCompartir(false);


    const [usuariosTotales, setUsuariosTotales] = useState([]);
    const [usuariosTotalesCargados, setUsuariosTotalesCargados] = useState(false);

    const [usuariosCompartidos, setUsuariosCompartidos] = useState([]);
    const [usuariosCompartidosCargados, setUsuariosCompartidosCargados] = useState(false);

    
    const [tooltipCompartir, setTooltipCompartir] = useState(false);
    const targetCompartir = useRef(null);

    const [tooltipDejarCompartir, setTooltipDejarCompartir] = useState(false);
    const targetDejarCompartir = useRef(null);


    const dispatch = useDispatch();

    useEffect(() => {
        if(!usuariosCompartidosCargados){
            dispatch(obtenerUsuariosCompartidos(state.paciente._id));
            setUsuariosCompartidosCargados(true);
        }

        if(usuariosCompartidosCargados && state.sharedUsers.length>0) {
            state.sharedUsers.forEach((usr,i) => {
                var username = usr.username;
                if(username!=undefined){
                    username = "("+username+")";
                }else {
                    username = "";
                }
                usuariosCompartidos.push({id: i, userId: usr._id, title: usr.name, username: username, active: false})
            });
        }
        
    }, [usuariosCompartidosCargados, state.sharedUsers])


    useEffect(() => {
        if(!usuariosTotalesCargados && stateAuth.users.length == 0){
            dispatch(obtenerUsuariosParaCompartir(stateAuth.user));
            setUsuariosTotalesCargados(true);
        }

        // Si ya se obtuvieron los pacientes (puede ser que se haya entrado ya en otro paciente y no hace falta perdirlos de nuevo)
        if(stateAuth.users.length>0) {
            if(usuariosTotales.length>0) { // Si ya tiene algo el array de todos los usuarios
                if(usuariosCompartidos.length>0) { // y además hay pacientes compartidos
                    usuariosTotales.forEach((usr, i) => { // borro de los totales los que estén compartidos
                        usuariosCompartidos.forEach((usrShared) => {
                            if(usr.userId == usrShared.userId) {
                                usuariosTotales.splice(i, 1);
                            }
                        })
                    })
                }
            }
            else { // Si todavía el array de usuarios totales no tiene nada
                stateAuth.users.forEach((usr,i) => { //lo lleno
                    var username = usr.username;
                    if(username!=undefined){
                        username = "("+username+")";
                    }else {
                        username = "";
                    }
                    if(usr._id != stateAuth.user._id && usr.name != undefined) //me fijo de no poner mi usuario y por alguna razón hay un usuario sin nombre
                        usuariosTotales.push({id: i, userId: usr._id, title: usr.name, username: username, active: false});
                });
            }
        }
    }, [usuariosTotalesCargados, stateAuth.users, state.sharedUsers])

    /* Toggles selections */
    function toggleSelectionCompartir(itemId) {
        setUsuariosTotales((prevItems) =>
          prevItems.map((item) => {
            if (item.id === itemId) {
              return { ...item, active: !item.active };
            }
            return item;
          })
        );
    }
    
    function toggleSelectionDejarCompartir(itemId) {
        setUsuariosCompartidos((prevItems) =>
          prevItems.map((item) => {
            if (item.id === itemId) {
              return { ...item, active: !item.active };
            }
            return item;
          })
        );
    }


    /* Handles de success*/
    function handleCompartir(){
        handleCloseCompartir(false); // escondo el modal
        var shared = [] // array con los usuarios seleccionados para compartir
        var new_usuariosTotales = [] // nuevo array con todos los usuarios (menos los nuevos compartidos)
        var aux_i = 0;
        usuariosTotales.forEach(itm => {
            if(itm.active) {
                shared.push(itm.userId);
                usuariosCompartidos.push({id: usuariosCompartidos.length+aux_i, userId: itm.userId, title: itm.title, username: itm.username, active: false});
                aux_i += 1;
            }
            else{
                new_usuariosTotales.push(itm);
            }
        });
        setUsuariosTotales(new_usuariosTotales);

        dispatch(agregarUsuariosCompartir(state.paciente._id, shared));
    }

    function handleDejarCompartir(){
        handleCloseDejarCompartir(false); //escondo el modal
        var stop_sharing = []; // array con los usuarios seleccionados para dejar de compartir
        var new_usuariosCompartidos = []; // nuevo array con los usuarios compartidos, menos los que se sacaron
        var aux_i = 0;
        usuariosCompartidos.forEach(itm => {
            if(itm.active){
                stop_sharing.push(itm.userId);
                usuariosTotales.push({id: usuariosTotales.length+aux_i, userId: itm.userId, title: itm.title, username: itm.username, active: false});
                aux_i += 1;
            }
            else {
                new_usuariosCompartidos.push(itm);
            }
        });
        setUsuariosCompartidos(new_usuariosCompartidos);

        dispatch(quitarUsuariosCompartir(state.paciente._id, stop_sharing));
    }



    return (
        <>
            <button className='btn btn-sm btn-primary' onClick={handleShowCompartir}><FontAwesomeIcon icon={faShare} className="mr-2" />Compartir</button>
            {usuariosCompartidos.length>0 ? <button className='btn btn-sm btn-primary' onClick={handleShowDejarCompartir}><FontAwesomeIcon icon={faUserFriends} className="mr-2" />Paciente compartido</button> : <></>}

            <Modal show={showDejarCompartir} onHide={handleCloseDejarCompartir}>
                <ModalHeader closeButton>
                    <Button variant="dark" className='btn btn-primary mr-3' ref={targetDejarCompartir} onClick={() => setTooltipDejarCompartir(!tooltipDejarCompartir)}><FontAwesomeIcon icon={faInfoCircle}/></Button>
                    <ModalTitle>Usuarios con acceso al paciente</ModalTitle>
                    <Overlay target={targetDejarCompartir.current} show={tooltipDejarCompartir} placement="right">
                        {(props) => (
                            <Tooltip id="help-tooltipDejarCompartir" {...props}>
                                El paciente está siendo compartido actualmente a los usuarios listados. Seleccione aquellos que quiera remover de esta lista.
                            </Tooltip>
                        )}
                    </Overlay>
                </ModalHeader>
                <ModalBody>
                    <ListGroup as="ul">
                        {usuariosCompartidos.map((itm, i) => {
                            return (
                                <ListGroupItem key={`itemSelect${itm.id}`} onClick={()=>toggleSelectionDejarCompartir(itm.id)} active={itm.active}>
                                    {itm.title} {itm.username}
                                </ListGroupItem>
                            )
                        })}
                    </ListGroup>
                </ModalBody>
                <ModalFooter>
                    <Button variant="danger" onClick={handleCloseDejarCompartir}>Cerrar</Button>
                    <Button variant="success" onClick={handleDejarCompartir}>Dejar de compartir</Button>
                </ModalFooter>
            </Modal>
            
            <Modal show={showCompartir} onHide={handleCloseCompartir} scrollable>
                <ModalHeader closeButton>
                    <Button variant="dark" className='btn btn-primary mr-3' ref={targetCompartir} onClick={() => setTooltipCompartir(!tooltipCompartir)}><FontAwesomeIcon icon={faInfoCircle}/></Button>
                    <ModalTitle>Compartir el paciente</ModalTitle>
                    <Overlay target={targetCompartir.current} show={tooltipCompartir} placement="right">
                        {(props) => (
                            <Tooltip id="help-tooltipCompartir" {...props}>
                                Al compartir un paciente se le otorga permiso de visualización al usuario y la posibilidad de agregar nuevos seguimientos.
                            </Tooltip>
                        )}
                    </Overlay>
                </ModalHeader>
                <ModalBody>
                    <ListGroup as="ul">
                        {usuariosTotales.map((itm, i) => {
                            return (
                                <ListGroupItem key={`itemSelect${itm.id}`} onClick={()=>toggleSelectionCompartir(itm.id)} active={itm.active}>
                                        {itm.title} {itm.username}
                                </ListGroupItem>
                            )
                        })}
                    </ListGroup>
                </ModalBody>
                <ModalFooter>
                    <Button variant="danger" onClick={handleCloseCompartir}>Cerrar</Button>
                    <Button variant="success" onClick={handleCompartir}>Compartir</Button>
                </ModalFooter>
            </Modal>
        </>
    ) 
}

export default CompartirPaciente;