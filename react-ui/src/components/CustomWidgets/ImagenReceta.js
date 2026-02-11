import React, {useState, useEffect} from "react";
import { Button, Image, Modal, ModalBody, ModalFooter } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";

function ImagenReceta({recetaid}) {

    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const handleShowModal = () => {
        console.log("Abriendo modal para receta ID:", recetaid);
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
    }
    
    // URL del archivo en el servidor
    const fileUrl = `./uploads/recetas/${recetaid}.pdf`;
    // log the fileUrl
    console.log("fileUrl:", fileUrl);

    const handleIframeError = () => {
        console.error("Error al cargar el iframe para:", fileUrl);
        setError("No se pudo cargar la receta. Verifique que el archivo existe.");
    };

    return (
        <>
            <button className='btn btn-sm btn-outline-success' onClick={handleShowModal}><FontAwesomeIcon icon={faImage} className="mr-2" /></button>
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <ModalHeader closeButton></ModalHeader>
                <ModalBody>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <iframe
                        src={fileUrl}
                        title="Receta Preview"
                        width="100%"
                        height="500px"
                        style={{ border: 'none' }}
                        onError={handleIframeError}
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