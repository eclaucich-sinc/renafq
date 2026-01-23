import React from 'react';

const ModalInformativo = ({ title }) => {
    const titleContent = title;
    const subtitleContent = "Redirigiendo a la pantalla principal...";

    return (
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <h1 className="display-5">{titleContent}</h1>
                <p className="lead">{subtitleContent}</p>
            </div>
        </div>
    )
}

export default ModalInformativo;
