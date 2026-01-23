import React, {useState, useEffect} from "react";
import { Button, Image, Modal, ModalBody, ModalFooter } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";

function ImagenReceta({recetaid}) {

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    
    // URL del archivo en el servidor
    const fileUrl = `/api/recetas/${recetaid}`;

    return (
        <>
            <button className='btn btn-sm btn-outline-success' onClick={handleShowModal}><FontAwesomeIcon icon={faImage} className="mr-2" /></button>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <ModalHeader closeButton></ModalHeader>
                <ModalBody>
                    <iframe
                        src={fileUrl}
                        title="Receta Preview"
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="danger" onClick={handleCloseModal}>Cerrar</Button>
                    <a className='link-receta btn btn-outline-success ml-3' download href={fileUrl} target="_blank" rel="noopener noreferrer">Descargar receta</a>
                </ModalFooter>
            </Modal>
        </>
    ) 
}

export default ImagenReceta;