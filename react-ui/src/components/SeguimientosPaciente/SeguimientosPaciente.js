import React, { useState, useEffect, useRef } from "react";
import ItemListaPacientes from "../ItemListaPacientes/ItemListaPacientes";
import Search from "../Buscar/Buscar";
import { obtenerPacientes, obtenerSeguimientosPaciente } from "../../redux/_actions/pacienteAction";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../../redux/_actions/alertAction";
import { PACIENTE_ERROR, PACIENTES_CARGADOS, MODIFICAR_SEGUIMIENTO, AGREGAR_SEGUIMIENTO } from "../../redux/types";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendarAlt,
  faPlus,
  faAddressCard,
  faBookMedical, faAddressBook, faAd, faPlusCircle, faMedkit,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";

import { Link, Route } from "react-router-dom";

import SeguimientoEstructura from './SeguimientoEstructura';
import DetalleSeguimiento from './DetalleSeguimiento';
import {jsPDF} from "jspdf";

const SeguimientosPaciente = (props) => {

  const id = props.paciente._id ? props.paciente._id : -1;
  const userId = props.userId;

  console.log(id);

  const stateAuth = useSelector(state => state.auth);
  const state = useSelector(state => state.paciente);

  // const state = useSelector(state => state.paciente);
  const dispatch = useDispatch();

  // // const [loading, setLoading] = useState(true);
  // const [formData, setFormData] = useState({});

  // useEffect(() => {
  //     if (state.paciente.length === 0 && id !== -1) {
  //         dispatch(obtenerPaciente(id));
  //     } else {
  //       if (state.paciente._id !== id)
  //         dispatch(obtenerPaciente(id));
  //       else {
  //         setFormData(state.paciente);
  //         // setLoading(state.loading);
  //       }
  //     }
  // }, [state.paciente]);

  const [seguimientoActivo, setSeguimientoActivo] = useState('');

  // obtiene los anios guardados del seguimiento
  // ordenamos los seguimientos desde el más actual al menos actual
  const seguimientos = props.paciente.seguimientos ? props.paciente.seguimientos.sort( (a, b) => {
    if (a.id < b.id) return 1;
    if (a.id > b.id) return -1;
    return 0; 
  } ) : [];

  const setearSeguimientoActivo = (seguimiento_id) => {
    console.log(seguimientoActivo);
    setSeguimientoActivo(seguimiento_id);
  };

  const handleEdit = (id) => {
    console.log(id);
    dispatch({type: MODIFICAR_SEGUIMIENTO});
  };

  const AgregarSeguimiento = ({pacienteId}) => {
    return <Route render={({history}) => (
      <button className='btn btn-sm btn-primary' onClick={() => {
        dispatch({type: AGREGAR_SEGUIMIENTO});
        history.push(`/paciente/${id}/seguimiento`);
      }}>
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Agregar
      </button>
    )} />
  }

  function MakePDFEmpty()
  {
    var doc = new jsPDF();

    var fontFactor = 1.5;
    var h1 = 33.75;
    var h2 = h1/fontFactor;
    var h3 = h2/fontFactor;
    var h4 = h3/fontFactor;

    var y = 10;

    var color_verde = "ff8c38";
    var color_gris_claro = "8a8a8a";
    var color_gris_normal = "666666";
    var color_gris_fuerte = "666666";

    //Header
    doc.setFontSize(h4);
    doc.setTextColor(color_gris_claro);
    doc.text("Paciente del Registro Nacional de Fibrosis Quística", 10, y, "left");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    doc.text(`Fecha de emisión: ${today}`, 200, y, "right");

    //Info principal
    y += 20;
    doc.setFontSize(h3);
    doc.setTextColor(color_verde);
    doc.text("Nombre y apellido", 10, y, "left");
    doc.text("DNI", 150, y, "left");

    y += 10;
    doc.setFontSize(h2);
    doc.setTextColor(color_gris_fuerte);
    doc.text("", 10, y, "left");
    doc.text("", 150, y, "left");

    y += 20;

    function NewBlock(blockName, blockTitles, blockFields, largeTitles=null, largeFields=null, fontsizes=[h3, h4], x_blockName= 10, x_left = 60, x_right = 150, space_btw_seccion = 10, space_btw_field = 7, space_btw_seccion_and_field = 10, offset_field_right = 5, offset_field_left = 5)
    {
      doc.setFontSize(fontsizes[0]);
      doc.setTextColor(color_verde);
      doc.text(blockName, x_blockName, y, "left");

      doc.setFontSize(fontsizes[1]);
      doc.setTextColor(color_gris_normal);

      y += space_btw_seccion_and_field;
      
      var left = true;

      for (var i = 0; i < blockTitles.length; i++) 
      {
        var x_title = left ? x_left : x_right;
        var x_field = left ? x_left+offset_field_left : x_right+offset_field_right;

        doc.text(blockTitles[i]+":", x_title, y, {align: "right", maxWidth: 55});
        doc.text(blockFields[i], x_field, y, {align: "left", maxWidth: 50});

        left = !left;
        if(left)
            y += space_btw_field;
      }

      if(largeTitles!=null)
      {
        if(!left)
          y += space_btw_field;

        for (var i = 0; i < largeTitles.length; i++) 
        {
          doc.text(largeTitles[i]+":", x_left, y, {align: "right", maxWidth: 55});
          doc.text(largeFields[i], x_left+5, y, {maxWidth: 140});

          y+=space_btw_field+5;
        }
      }

      y += space_btw_seccion;

      if(y > 270)
      {
        doc.addPage();
        y = 20;
      }
    }

    var block_titles = ["Fecha de seguimiento", "Nivel educativo", "Actividad laboral", "CUD", "Pensión discapacidad","Cobertura social", "Embarazo", "Tratamiento hospitalizado en el año", "Días con tratamiento hospitalizado","Tratamientos domiciliario en el año", "Días con tratamiento domiciliario", "Consultas ambulatorias"];
    var block_fields = ["","","","","","","","","","","",""];
    NewBlock("Datos básicos del paciente", block_titles, block_fields);


    block_titles = ["Provincia", "Departamento", "Código postal"];
    block_fields = ["", "", ""];
    var large_titles = ["Institución"];
    var large_fields = [""];
    NewBlock("Datos de la institución", block_titles, block_fields, large_titles, large_fields, [h3,h4], 10, 40, 130);


    block_titles = ["Peso (Kg)", "Talla (cm)", "IMC", "Percentilo Peso", "z Peso", "Percentilo Talla", "z Talla", "Percentilo IMC", "z IMC"];
    block_fields = ["","","","","","","","",""];
    NewBlock("Antropometría", block_titles, block_fields);


    block_titles = ["Espirometrías por año", "CVF (% teórico)", "VEF (% teórico)", "VEF/CVF (absoluto)", "CVF (litros)", "VEF (litros)"];
    block_fields = ["","","","","",""];
    NewBlock("Espirometría", block_titles, block_fields);


    block_titles = ["N° cultivos por año"];
    block_fields = [""];
    large_titles = ["Gérmenes"];
    large_fields = [""];
    NewBlock("Microbiología", block_titles, block_fields, large_titles, large_fields);


    block_titles = ["Curva de tolerancia a la glucosa", "Vitamina D", "Densitometría", "Inmunoglobulina", "TAC de tórax", "Score Bhalla", "Complicaciones o asociaciones"];
    block_fields = ["","","","","","",""];
    large_titles = [];
    large_fields = [];
    NewBlock("Estudios complementarios", block_titles, block_fields, large_titles, large_fields);
    

    block_titles = ["Alimentación", "Enzimas pancreáticas", "Vitaminas", "Suplementación de vitamina D", "Suplemento nutricional", "Ácido Ursodesoxicólico",
                      "Antiácidos", "Insulina", "Broncodilatadores", "DNasa", "Solución Salina Hipertónica", "Antibióticos Inhalados realizada",
                      "Corticoides realizada", "Azitromicina Oral", "Terapia Respiratoria realizada", "Actividad Deportiva", "Oxigenoterapia Domiciliaria",
                      "Asistencia Respiratoria", "Moduladores realizada", "Trasplante"];
    block_fields = ["","","","","","","","","","","","","","","","","","","",""];
    large_titles = ["Observaciones clínicas"];
    large_fields = [""];
    NewBlock("Tratamientos", block_titles, block_fields, large_titles, large_fields, [h3,h4], 10, 60, 155);


    block_titles = [];
    block_fields = [];
    NewBlock("Prescripción", block_titles, block_fields);

    block_titles = ["Provincia", "Departamento", "Código postal"];
    block_fields = ["", "", ""];
    large_titles = ["Institución"];
    large_fields = [""];
    y-=10;
    NewBlock("Institución", block_titles, block_fields, large_titles, large_fields, [h3, h4], 15, 50, 130);


    block_titles = ["Nombre y apellido", "Matrícula"];
    block_fields = ["", ""];
    large_titles = [];
    large_fields = [];
    NewBlock("Médico responsable", block_titles, block_fields, large_titles, large_fields, [h3, h4], 15, 50, 140);


    block_titles = ["Nombre y apellido", "Email", "GLN farmacia"];
    block_fields = ["", "", ""];
    large_titles = [];
    large_fields = [];
    NewBlock("Responsable recepción", block_titles, block_fields, large_titles, large_fields, [h3, h4], 15, 50, 130);

    doc.save("formulario_seguimiento_vacío.pdf");
  }

  const BotonDescargarFormulario = () => {
    return <Route render={({history}) => (
      <button className='btn btn-sm btn-primary' onClick={MakePDFEmpty}>
        <FontAwesomeIcon icon={faArrowDown} className="mr-2" />
        Descargar formulario vacío
      </button>
    )} />
  }

  const botonAgregarSeguimiento = (
    <div className="card-header-title">
      <h5 className="d-inline">
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
        Seguimientos
      </h5>
      <div className="d-inline">
        {BotonDescargarFormulario()}
        {AgregarSeguimiento({pacienteId: id})}
      </div>
    </div>
  )

  return (
    <>
      <div className="row">
        <div className="col-12">
          {stateAuth.user.rol!=="EPF" && state.paciente.seccion1.fallecimiento!=="Sí" && botonAgregarSeguimiento}
          <div className="card shadow-sm border border-dark mt-0 pb-0 px-0 card-no-round-top-border">
            <div className="card-body my-0 pt-0">
              <div className="row">
              {
                seguimientos.length === 0 ? (
                  <div className="col">
                    <p className="text-left m-2">
                      No hay seguimientos cargados para este paciente
                    </p>
                  </div>
                ) :
                (
                  seguimientos.map((seguimiento) => {
                    return (
                      <SeguimientoEstructura key={seguimiento.id} seguimiento={seguimiento} />
                    );
                  })
                )
              }
              </div>
            </div>
            <div className="row">
              <div className="col-12">
              {
                seguimientos.length !== 0 ?
                (
                  seguimientos.map((seguimiento) => {
                    return (
                      <DetalleSeguimiento key={seguimiento.id} pacienteId={id} seguimiento={seguimiento} userId={userId} handleEdit={handleEdit} />
                    );
                  })
                ) : ''
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}

export default SeguimientosPaciente;
