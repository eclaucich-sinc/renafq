import React, {useState, useEffect, useRef} from "react";
import { Button, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalTitle, Overlay, Tooltip } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { obtenerUsuariosCompartidos } from "../../redux/_actions/pacienteAction";
import { useDispatch, useSelector } from "react-redux";

function UsuariosCompartidos(props) {
    const {
        options,
        value,
        required,
        disabled,
        readonly,
        autofocus,
        onBlur,
        onFocus,
        onChange,
        id
    } = props;

    const dispatch = useDispatch();

    const state = useSelector((state) => state.paciente);

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [items, setItems] = useState([]);
    const [usuariosCargados, setUsuariosCargados] = useState(false);

    const [tooltip, setTooltip] = useState(false);
    const target = useRef(null);
    
    useEffect(() => {
        if(!usuariosCargados){
            dispatch(obtenerUsuariosCompartidos(state.paciente._id));
            setUsuariosCargados(true);
        }
        
        if(usuariosCargados && state.sharedUsers.length>0) {
            state.sharedUsers.forEach((usr,i) => {
                var username = usr.username;
                if(username!=undefined){
                    username = "("+username+")";
                }else {
                    username = "";
                }
                items.push({id: i, userId: usr._id, title: usr.name, username: username, active: false})
            });
        }
    }, [usuariosCargados, state.sharedUsers])

    function toggleSelection(itemId) {
        setItems((prevItems) =>
          prevItems.map((item) => {
            if (item.id === itemId) {
              return { ...item, active: !item.active };
            }
            return item;
          })
        );
      }

    function handleCompartir(){
        handleClose(false);
        items.forEach(itm => {
            if(itm.active)
                console.log(itm.title)
        });
    }

    return (
        <>
            <button className='btn btn-sm btn-primary' onClick={handleShow}><FontAwesomeIcon icon={faUserFriends} className="mr-2" />Paciente compartido</button>

            <Modal show={show} onHide={handleClose}>
                <ModalHeader closeButton>
                    <Button variant="dark" className='btn btn-primary mr-3' ref={target} onClick={() => setTooltip(!tooltip)}><FontAwesomeIcon icon={faInfoCircle}/></Button>
                    <ModalTitle>Usuarios con acceso al paciente</ModalTitle>
                    <Overlay target={target.current} show={tooltip} placement="right">
                        {(props) => (
                            <Tooltip id="help-tooltip" {...props}>
                                El paciente está siendo compartido actualmente a los usuarios listados. Seleccione aquellos que quiera remover de esta lista.
                            </Tooltip>
                        )}
                    </Overlay>
                </ModalHeader>
                <ModalBody>
                    <ListGroup as="ul">
                        {items.map((itm, i) => {
                            return (
                                <ListGroupItem key={`itemSelect${itm.id}`} onClick={()=>toggleSelection(itm.id)} active={itm.active}>
                                    {itm.title} {itm.username}
                                </ListGroupItem>
                            )
                        })}
                    </ListGroup>
                </ModalBody>
                <ModalFooter>
                    <Button variant="danger" onClick={handleClose}>Cerrar</Button>
                    <Button variant="success" onClick={handleCompartir}>Dejar de compartir</Button>
                </ModalFooter>
            </Modal>
        </>
    ) 
}

export default UsuariosCompartidos;