import React, { useEffect, useState } from 'react';
import { ReactComponent as FolderSvg } from '../../assets/Icons8_flat_folder.svg';
// import folder from '../../assets/Icons8_flat_folder.svg';
import { Link, Route } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import JSONSchemaForm from "@rjsf/core";
//import schema from "./schemaSeguimiento";
import CustomCheckboxes from "../CustomWidgets/CustomCheckBoxes";

import {
  faUser,
  faCalendarAlt,
  faAddressCard,
  faBookMedical, faAddressBook, faAd, faPlusCircle, faMedkit
} from "@fortawesome/free-solid-svg-icons";

import {
  TitleField,
  DescriptionField,
  CustomTextWidget,
  CustomDateWidget,
  CustomFieldTemplate,
  ObjectFieldTemplate,
  CustomObjectFieldTemplate,
  SubObjectFieldTemplate,
} from "../../utils/customFormFunctions";
import { GetBaseSchema, GetSchema } from './schemasSeguimientosPaciente';
import { useSelector, useDispatch } from "react-redux";
import { obtenerReceta } from '../../redux/_actions/pacienteAction';
import {jsPDF} from "jspdf";
import SeguimientosPaciente from './SeguimientosPaciente';
import InfoRecetas from '../CustomWidgets/InfoRecetas';
import NuevaReceta from '../CustomWidgets/NuevaReceta';

const widgets = {
  textWidget: CustomTextWidget,
  fechaWidget: CustomDateWidget,
  // objectFieldTemplate: ObjectFieldTemplate
  customCheckboxesWidget: CustomCheckboxes,
  // RadioWidget: CustomRadioWidget,
};

const fields = {
  // layout_grid: LayoutGridField,
  TitleField: TitleField,
  DescriptionField: DescriptionField,
};

let schema = GetSchema();
const uiSchema = GetBaseSchema();

const DetalleSeguimiento = (props) => {
  const state = useSelector((state) => state.paciente);
  const stateAuth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [recetaCargada, setRecetaCargada] = useState(false);
  const [dataCargada, setDataCargada] = useState(false);
  const [dataReceta, setDataReceta] = useState("");
  const [nameReceta, setNameReceta] = useState("");
  const { pacienteId, seguimiento, handleEdit, userId } = props;
  console.log("🚀 ~ file: DetalleSeguimiento.js ~ line 437 ~ DetalleSeguimiento ~ props", props)

  const EditButton = ({seguimientoId}) => {
    return <Route render={({history}) => (
      <button className='btn btn-outline-dark ml-3' onClick={() => {
        handleEdit(seguimientoId);
        history.push(`/paciente/${pacienteId}/seguimiento/${seguimientoId}/edit`);
      }}>
        Editar
      </button>
    )} />
  }

  useEffect(() => {
    if((seguimiento.seccion6).hasOwnProperty('seccion7') && (seguimiento.seccion6.seccion7).hasOwnProperty('recetaid'))
    {
      
      if(!recetaCargada && seguimiento.seccion6.seccion7.recetaid!=='')
      {
        console.log("OBTENER RECETA");
        setRecetaCargada(true);
        dispatch(obtenerReceta(seguimiento.seccion6.seccion7.recetaid));
      }  
    }

    if(recetaCargada && !dataCargada)
    {
      if(!(seguimiento.seccion6.seccion7.recetaid in state.recetas))
      {
        console.log("NO ESTA TODAVIA");
      }
      else
      {
        console.log("AHORA ESTÁ");
        if(state.recetas[seguimiento.seccion6.seccion7.recetaid.toString()].contentType==="image/png")
        {
          console.log("RECETA PNG");
          setDataReceta("data:image/png;base64,"+(state.recetas[seguimiento.seccion6.seccion7.recetaid.toString()].data).substring(19));
          setNameReceta(state.recetas[seguimiento.seccion6.seccion7.recetaid.toString()].name+'.png');
          setDataCargada(true);
        }
        else if(state.recetas[seguimiento.seccion6.seccion7.recetaid.toString()].contentType==="image/jpeg")
        {
          console.log("RECETA JPEG");
          setDataReceta("data:image/jpeg;base64,"+(state.recetas[seguimiento.seccion6.seccion7.recetaid.toString()].data).substring(20));
          setNameReceta(state.recetas[seguimiento.seccion6.seccion7.recetaid.toString()].name+'.jpeg');
          setDataCargada(true);
        }
      }
    }

  }, [state.recetas]);


  function MakePDFWithData()
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
    doc.text(`${state.paciente.seccion1.nombre} ${state.paciente.seccion1.apellido}`, 10, y, "left");
    doc.text(state.paciente.seccion1.dni.toString(), 150, y, "left");

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

    var block_titles = [];
    var block_fields = [];

    if(seguimiento.seccion1.hasOwnProperty('fechaSeguimiento'))
    {
      block_titles.push("Fecha de seguimiento");
      block_fields.push(seguimiento.seccion1.fechaSeguimiento);
    }
    if(seguimiento.seccion1.hasOwnProperty('edadSeguimiento'))
    {
      block_titles.push("Edad al seguimiento");
      block_fields.push(seguimiento.seccion1.edadSeguimiento);
    }
    if(seguimiento.seccion1.hasOwnProperty('nivelEducativo'))
    {
      block_titles.push("Nivel educativo");
      block_fields.push(seguimiento.seccion1.nivelEducativo);
    }
    if(seguimiento.seccion1.hasOwnProperty('actividadLavoral'))
    {
      block_titles.push("Actividad laboral");
      block_fields.push(seguimiento.seccion1.actividadLaboral);
    }
    if(seguimiento.seccion1.hasOwnProperty('cud'))
    {
      block_titles.push("CUD");
      block_fields.push(seguimiento.seccion1.cud);
    }
    if(seguimiento.seccion1.hasOwnProperty('pensionDiscapacidad'))
    {
      block_titles.push("Pensión discapacidad");
      block_fields.push(seguimiento.seccion1.pensionDiscapacidad);
    }
    if(seguimiento.seccion1.hasOwnProperty('coberturaSocial'))
    {
      block_titles.push("Cobertura social");
      block_fields.push(seguimiento.seccion1.coberturaSocial);
    }
    if(seguimiento.seccion1.hasOwnProperty('embarazo'))
    {
      block_titles.push("Embarazo");
      block_fields.push(seguimiento.seccion1.embarazo);
    }
    if(seguimiento.seccion1.hasOwnProperty('tratamientoAntibioticoHospitalizado'))
    {
      block_titles.push("Tratamiento hospitalizado en el año");
      block_fields.push(seguimiento.seccion1.tratamientoAntibioticoHospitalizado.toString());
    }
    if(seguimiento.seccion1.hasOwnProperty('tratamientoAntibioticoHospitalizadoDias'))
    {
      block_titles.push("Días con tratamiento hospitalizado");
      block_fields.push(seguimiento.seccion1.tratamientoAntibioticoHospitalizadoDias.toString());
    }
    if(seguimiento.seccion1.hasOwnProperty('tratamientoAntibioticoDomiciliario'))
    {
      block_titles.push("Tratamientos domiciliario en el año");
      block_fields.push(seguimiento.seccion1.tratamientoAntibioticoDomiciliario.toString());
    }
    if(seguimiento.seccion1.hasOwnProperty('tratamientoAntibioticoDomiciliarioDias'))
    {
      block_titles.push("Días con tratamiento domiciliario");
      block_fields.push(seguimiento.seccion1.tratamientoAntibioticoDomiciliarioDias.toString());
    }
    if(seguimiento.seccion1.hasOwnProperty('consultasAmbulatorias'))
    {
      block_titles.push("Consultas ambulatorias");
      block_fields.push(seguimiento.seccion1.consultasAmbulatorias.toString());
    }
    NewBlock("Datos básicos del paciente", block_titles, block_fields);


    block_titles = [];
    block_fields = [];
    var large_titles = [];
    var large_fields = [];
    if(seguimiento.seccion1.hasOwnProperty('institucion_otra') && seguimiento.seccion1.institucion_otra!="")
    {
      large_titles.push("Institución");
      large_fields.push(seguimiento.seccion1.institucion_otra);
    }
    else
    {
      if(seguimiento.seccion1.hasOwnProperty('institucion_provincia'))
      {
        block_titles.push("Provincia");
        block_fields.push(seguimiento.seccion1.institucion_provincia);
      }
      if(seguimiento.seccion1.hasOwnProperty('institucion_departamento'))
      {
        block_titles.push("Departamento");
        block_fields.push(seguimiento.seccion1.institucion_departamento);
      }
      if(seguimiento.seccion1.hasOwnProperty('institucion'))
      {
        large_titles.push("Institución");
        large_fields.push(seguimiento.seccion1.institucion);
      }
    }
    if(seguimiento.seccion1.hasOwnProperty('institucion_cp'))
    {
      block_titles.push("Código postal");
      block_fields.push(seguimiento.seccion1.institucion_cp.toString());
    }
    NewBlock("Datos de la institución", block_titles, block_fields, large_titles, large_fields, [h3,h4], 10, 40, 130);


    if(seguimiento.hasOwnProperty('seccion2'))
    {
      block_titles = [];
      block_fields = [];
      if(seguimiento.seccion2.hasOwnProperty('peso'))
      {
        if(seguimiento.seccion2.peso.toString()!="")
        {
          block_titles.push("Peso (Kg)");
          block_fields.push(seguimiento.seccion2.peso.toString());
        }
      }
      if(seguimiento.seccion2.hasOwnProperty('talla'))
      {
        if(seguimiento.seccion2.talla.toString()!="")
        {
          block_titles.push("Talla (cm)");
          block_fields.push(seguimiento.seccion2.talla.toString());
        }
      }
      if(seguimiento.seccion2.hasOwnProperty('imc'))
      {
        if(seguimiento.seccion2.imc.toString()!="")
        {
          block_titles.push("IMC");
          block_fields.push(seguimiento.seccion2.imc.toString());
        }
      }
      if(seguimiento.seccion2.hasOwnProperty('percentiloPeso'))
      {
        if(seguimiento.seccion2.percentiloPeso.toString()!="")
        {
          block_titles.push("Percentilo Peso");
          block_fields.push(seguimiento.seccion2.percentiloPeso.toString());
        }
      }
      if(seguimiento.seccion2.hasOwnProperty('zPeso'))
      {
        if(seguimiento.seccion2.zPeso.toString()!="")
        {
          block_titles.push("z Peso");
          block_fields.push(seguimiento.seccion2.zPeso.toString());
        }
      }
      if(seguimiento.seccion2.hasOwnProperty('percentiloTalla'))
      {
        if(seguimiento.seccion2.percentiloTalla.toString()!="")
        {
          block_titles.push("Percentilo Talla");
          block_fields.push(seguimiento.seccion2.percentiloTalla.toString());
        }
      }
      if(seguimiento.seccion2.hasOwnProperty('zTalla'))
      {
        if(seguimiento.seccion2.zTalla.toString()!="")
        {
          block_titles.push("z Talla");
          block_fields.push(seguimiento.seccion2.zTalla.toString());
        }
      }
      if(seguimiento.seccion2.hasOwnProperty('percentiloImc'))
      {
        if(seguimiento.seccion2.percentiloImc.toString()!="")
        {
          block_titles.push("Percentilo IMC");
          block_fields.push(seguimiento.seccion2.percentiloImc.toString());
        }
      }
      if(seguimiento.seccion2.hasOwnProperty('zImc'))
      {
        if(seguimiento.seccion2.zImc.toString()!="")
        {
          block_titles.push("z IMC");
          block_fields.push(seguimiento.seccion2.zImc.toString());
        }
      }
      if(block_titles.length>0)
      {
        NewBlock("Antropometría", block_titles, block_fields);
      }
    }

    if(seguimiento.hasOwnProperty('seccion3'))
    {
      block_titles = [];
      block_fields = [];
      if(seguimiento.seccion3.hasOwnProperty('espirometrias'))
      {
        if(seguimiento.seccion3.espirometrias.toString()!="")
        {
          block_titles.push("Espirometrías por año");
          block_fields.push(seguimiento.seccion3.espirometrias.toString());
        }
      }
      if(seguimiento.seccion3.hasOwnProperty('cvf'))
      {
        if(seguimiento.seccion3.cvf.toString()!="")
        {
          block_titles.push("CVF (% teórico)");
          block_fields.push(seguimiento.seccion3.cvf.toString());
        }
      }
      if(seguimiento.seccion3.hasOwnProperty('vef'))
      {
        if(seguimiento.seccion3.vef.toString()!="")
        {
          block_titles.push("VEF (% teórico)");
          block_fields.push(seguimiento.seccion3.vef.toString());
        }
      }
      if(seguimiento.seccion3.hasOwnProperty('vef_cvf'))
      {
        if(seguimiento.seccion3.vef_cvf.toString()!="")
        {
          block_titles.push("VEF/CVF (absoluto)");
          block_fields.push(seguimiento.seccion3.vef_cvf.toString());
        }
      }
      if(seguimiento.seccion3.hasOwnProperty('cvfLitros'))
      {
        if(seguimiento.seccion3.cvfLitros.toString()!="")
        {
          block_titles.push("CVF (litros)");
          block_fields.push(seguimiento.seccion3.cvfLitros.toString());
        }
      }
      if(seguimiento.seccion3.hasOwnProperty('vefLitros'))
      {
        if(seguimiento.seccion3.vefLitros.toString()!="")
        {
          block_titles.push("VEF (litros)");
          block_fields.push(seguimiento.seccion3.vefLitros.toString());
        }
      }
      if(block_titles.length>0)
      {
        NewBlock("Espirometría", block_titles, block_fields);
      }
    }

    if(seguimiento.hasOwnProperty('seccion4'))
    {
      block_titles = [];
      block_fields = [];
      large_titles = [];
      large_fields = [];
      if(seguimiento.seccion4.hasOwnProperty('cultivos'))
      {
        if(seguimiento.seccion4.cultivos.toString()!="")
        {
          block_titles.push("N° cultivos por año");
          block_fields.push(seguimiento.seccion4.cultivos.toString());
        }
      }
      if(seguimiento.seccion4.hasOwnProperty('germenes'))
      {
        large_titles.push("Gérmenes");
        var germenes = "";
        for (let i = 0; i < seguimiento.seccion4.germenes.length; i++) {
          germenes += seguimiento.seccion4.germenes[i];
          if(i<seguimiento.seccion4.germenes.length-1)
            germenes += " - ";
        }
        large_fields.push(germenes);
      }
      if(block_titles.length>0 || large_titles.length>0)
      {
        NewBlock("Microbiología", block_titles, block_fields, large_titles, large_fields);
      }
    }

    if(seguimiento.hasOwnProperty('seccion5'))
    {
      block_titles = [];
      block_fields = [];
      large_titles = [];
      large_fields = [];
      if(seguimiento.seccion5.hasOwnProperty('toleranciaGlucosaRealizada'))
      {
        if(seguimiento.seccion5.toleranciaGlucosaRealizada.toString()!="")
        {
          block_titles.push("Curva de tolerancia a la glucosa");
          block_fields.push(seguimiento.seccion5.toleranciaGlucosaRealizada.toString());
        }
      }
      if(seguimiento.seccion5.hasOwnProperty('vitaminaDRealizada'))
      {
        if(seguimiento.seccion5.vitaminaDRealizada.toString()!="")
        {
          block_titles.push("Vitamina D");
          block_fields.push(seguimiento.seccion5.vitaminaDRealizada.toString());
        }
      }
      if(seguimiento.seccion5.hasOwnProperty('densitometriaRealizada'))
      {
        if(seguimiento.seccion5.densitometriaRealizada.toString()!="")
        {
          block_titles.push("Densitometría");
          block_fields.push(seguimiento.seccion5.densitometriaRealizada.toString());
        }
      }
      if(seguimiento.seccion5.hasOwnProperty('inmunoglobulinaRealizada'))
      {
        if(seguimiento.seccion5.inmunoglobulinaRealizada.toString()!="")
        {
          block_titles.push("Inmunoglobulina");
          block_fields.push(seguimiento.seccion5.inmunoglobulinaRealizada.toString());
        }
      }
      if(seguimiento.seccion5.hasOwnProperty('tacToraxRealizada'))
      {
        if(seguimiento.seccion5.tacToraxRealizada.toString()!="")
        {
          block_titles.push("TAC de tórax");
          block_fields.push(seguimiento.seccion5.tacToraxRealizada.toString());
        }
      }
      if(seguimiento.seccion5.hasOwnProperty('scoreBhalla'))
      {
        if(seguimiento.seccion5.scoreBhalla.toString()!="")
        {
          block_titles.push("Score Bhalla");
          block_fields.push(seguimiento.seccion5.scoreBhalla.toString());
        }
      }
      if(seguimiento.seccion5.hasOwnProperty('complicaciones'))
      {
        if(seguimiento.seccion5.complicaciones.toString()!="")
        {
          large_titles.push("Complicaciones o asociaciones");
          large_fields.push(seguimiento.seccion5.complicaciones.toString());
        }
      }
      if(block_titles.length>0 || large_titles.length>0)
      {
        NewBlock("Estudios complementarios", block_titles, block_fields, large_titles, large_fields);
      }
    }
    
    if(seguimiento.hasOwnProperty('seccion6'))
    {
      block_titles = [];
      block_fields = [];
      large_titles = [];
      large_fields = [];
      if(seguimiento.seccion6.hasOwnProperty('alimentacion'))
      {
        if(seguimiento.seccion6.alimentacion!="")
        {
          block_titles.push("Alimentación");
          block_fields.push(seguimiento.seccion6.alimentacion);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('enzimasPancreaticas'))
      {
        if(seguimiento.seccion6.enzimasPancreaticas!="")
        {
          block_titles.push("Enzimas pancreáticas");
          block_fields.push(seguimiento.seccion6.enzimasPancreaticas);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('vitaminas'))
      {
        if(seguimiento.seccion6.vitaminas!="")
        {
          block_titles.push("Vitaminas");
          block_fields.push(seguimiento.seccion6.vitaminas);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('suplementacionVitaminaD'))
      {
        if(seguimiento.seccion6.suplementacionVitaminaD!="")
        {
          block_titles.push("Suplementación de vitamina D");
          block_fields.push(seguimiento.seccion6.suplementacionVitaminaD);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('suplementoNutricional'))
      {
        if(seguimiento.seccion6.suplementoNutricional!="")
        {
          block_titles.push("Suplemento nutricional");
          block_fields.push(seguimiento.seccion6.suplementoNutricional);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('acidoUrsodesoxicolico'))
      {
        if(seguimiento.seccion6.acidoUrsodesoxicolico!="")
        {
          block_titles.push("Ácido Ursodesoxicólico");
          block_fields.push(seguimiento.seccion6.acidoUrsodesoxicolico);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('antiacidos'))
      {
        if(seguimiento.seccion6.antiacidos!="")
        {
          block_titles.push("Antiácidos");
          block_fields.push(seguimiento.seccion6.antiacidos);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('insulina'))
      {
        if(seguimiento.seccion6.insulina!="")
        {
          block_titles.push("Insulina");
          block_fields.push(seguimiento.seccion6.insulina);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('broncodilatadores'))
      {
        if(seguimiento.seccion6.broncodilatadores!="")
        {
          block_titles.push("Broncodilatadores");
          block_fields.push(seguimiento.seccion6.broncodilatadores);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('dnasa'))
      {
        if(seguimiento.seccion6.dnasa!="")
        {
          block_titles.push("DNasa");
          block_fields.push(seguimiento.seccion6.dnasa);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('solucionSalinaHipertonica'))
      {
        if(seguimiento.seccion6.solucionSalinaHipertonica!="")
        {
          block_titles.push("Solución Salina Hipertónica");
          block_fields.push(seguimiento.seccion6.solucionSalinaHipertonica);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('antibioticosInhalados'))
      {
        if(seguimiento.seccion6.antibioticosInhalados!="")
        {
          block_titles.push("Antibióticos Inhalados");
          block_fields.push(seguimiento.seccion6.antibioticosInhalados);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('antibioticosInhaladosRealizada'))
      {
        if(seguimiento.seccion6.antibioticosInhaladosRealizada!="")
        {
          large_titles.push("Antibióticos Inhalados realizada");
          var antibioticos = "";
          for (let i = 0; i < seguimiento.seccion6.antibioticosInhaladosRealizada.length; i++) {
            antibioticos += seguimiento.seccion6.antibioticosInhaladosRealizada[i];
            if(i<seguimiento.seccion6.antibioticosInhaladosRealizada.length-1)
              antibioticos += " - ";
          }
          large_fields.push(antibioticos);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('corticoides'))
      {
        if(seguimiento.seccion6.corticoides!="")
        {
          block_titles.push("Corticoides");
          block_fields.push(seguimiento.seccion6.corticoides);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('corticoidesRealizada'))
      {
        if(seguimiento.seccion6.corticoidesRealizada!="")
        {
          large_titles.push("Corticoides realizada");
          var corticoides = "";
          for (let i = 0; i < seguimiento.seccion6.corticoidesRealizada.length; i++) {
            corticoides += seguimiento.seccion6.corticoidesRealizada[i];
            if(i<seguimiento.seccion6.corticoidesRealizada.length-1)
              corticoides += " - ";
          }
          large_fields.push(corticoides);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('azitromicinaOral'))
      {
        if(seguimiento.seccion6.azitromicinaOral!="")
        {
          block_titles.push("Azitromicina Oral");
          block_fields.push(seguimiento.seccion6.azitromicinaOral);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('terapiaRespiratoria'))
      {
        if(seguimiento.seccion6.terapiaRespiratoria!="")
        {
          block_titles.push("Terapia Respiratoria");
          block_fields.push(seguimiento.seccion6.terapiaRespiratoria);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('terapiaRespiratoriaRealizada'))
      {
        if(seguimiento.seccion6.terapiaRespiratoriaRealizada!="")
        {
          large_titles.push("Terapia Respiratoria realizada");
          var terapia = "";
          for (let i = 0; i < seguimiento.seccion6.terapiaRespiratoriaRealizada.length; i++) {
            terapia += seguimiento.seccion6.terapiaRespiratoriaRealizada[i];
            if(i<seguimiento.seccion6.terapiaRespiratoriaRealizada.length-1)
              terapia += " - ";
          }
          large_fields.push(terapia);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('actividadDeportiva'))
      {
        if(seguimiento.seccion6.actividadDeportiva!="")
        {
          block_titles.push("Actividad Deportiva");
          block_fields.push(seguimiento.seccion6.actividadDeportiva);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('oxigenoterapiaDomiciliaria'))
      {
        if(seguimiento.seccion6.oxigenoterapiaDomiciliaria!="")
        {
          block_titles.push("Oxigenoterapia Domiciliaria");
          block_fields.push(seguimiento.seccion6.oxigenoterapiaDomiciliaria);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('asistenciaRespiratoria'))
      {
        if(seguimiento.seccion6.asistenciaRespiratoria!="")
        {
          block_titles.push("Asistencia Respiratoria");
          block_fields.push(seguimiento.seccion6.asistenciaRespiratoria);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('moduladores'))
      {
        if(seguimiento.seccion6.moduladores!="")
        {
          block_titles.push("Moduladores");
          block_fields.push(seguimiento.seccion6.moduladores);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('moduladoresRealizada'))
      {
        if(seguimiento.seccion6.moduladoresRealizada!="")
        {
          large_titles.push("Moduladores realizada");
          large_fields.push(seguimiento.seccion6.moduladoresRealizada);
        }
        if(seguimiento.seccion6.hasOwnProperty('otrosModuladores'))
        {
          if(seguimiento.seccion6.otrosModuladores!="")
          {
            large_titles.push("Otros moduladores");
            large_fields.push(seguimiento.seccion6.otrosModuladores);
          }
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('trasplante'))
      {
        if(seguimiento.seccion6.trasplante!="")
        {
          block_titles.push("Trasplante");
          block_fields.push(seguimiento.seccion6.trasplante);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('trasplanteRealizada'))
      {
        if(seguimiento.seccion6.trasplanteRealizada!="")
        {
          block_titles.push("Trasplante realizado");
          block_fields.push(seguimiento.seccion6.trasplanteRealizada);
        }
      }
      if(seguimiento.seccion6.hasOwnProperty('observacionesClinicas'))
      {
        if(seguimiento.seccion6.observacionesClinicas!="")
        {
          large_titles.push("Observaciones clínicas");
          large_fields.push(seguimiento.seccion6.observacionesClinicas);
        }
      }
      if(block_titles.length>0)
      {
        NewBlock("Tratamientos", block_titles, block_fields, large_titles, large_fields, [h3,h4], 10, 60, 155);
      }


      if(seguimiento.seccion6.hasOwnProperty('seccion7'))
      {
        block_titles = [];
        block_fields = [];
        NewBlock("Prescripción", block_titles, block_fields);

        block_titles = [];
        block_fields = [];
        large_titles = [];
        large_fields = [];
        if(seguimiento.seccion6.seccion7.hasOwnProperty('institucion_otra') && seguimiento.seccion6.seccion7.institucion_otra!="")
        {
          large_titles.push("Institución");
          large_fields.push(seguimiento.seccion6.seccion7.institucion_otra);
        }
        else
        {
          if(seguimiento.seccion6.seccion7.hasOwnProperty('institucion_provincia'))
          {
            if(seguimiento.seccion6.seccion7.institucion_provincia!="")
            {
              block_titles.push("Provincia");
              block_fields.push(seguimiento.seccion6.seccion7.institucion_provincia);
            }
          }
          if(seguimiento.seccion6.seccion7.hasOwnProperty('institucion_departamento'))
          {
            if(seguimiento.seccion6.seccion7.institucion_departamento!="")
            {
              block_titles.push("Departamento");
              block_fields.push(seguimiento.seccion6.seccion7.institucion_departamento);
            }
          }
          if(seguimiento.seccion6.seccion7.hasOwnProperty('institucion'))
          {
            if(seguimiento.seccion6.seccion7.institucion!="")
            {
              large_titles.push("Institución");
              large_fields.push(seguimiento.seccion6.seccion7.institucion);
            }
          }
        }
        if(seguimiento.seccion6.seccion7.hasOwnProperty('institucion_cp'))
        {
          if(seguimiento.seccion6.seccion7.institucion_cp.toString()!="")
          {
            block_titles.push("Código postal");
            block_fields.push(seguimiento.seccion6.seccion7.institucion_cp.toString());
          }
        }
        y-=10;
        NewBlock("Institución", block_titles, block_fields, large_titles, large_fields, [h3, h4], 15, 50, 130);

        block_titles = [];
        block_fields = [];
        large_titles = [];
        large_fields = [];
        var nombre_medico = "";
        if(seguimiento.seccion6.seccion7.hasOwnProperty('nombreMedicoResponsable'))
        {
          nombre_medico += seguimiento.seccion6.seccion7.nombreMedicoResponsable;
        }
        if(seguimiento.seccion6.seccion7.hasOwnProperty('apellidoMedicoResponsable'))
        {
          nombre_medico += " " + seguimiento.seccion6.seccion7.apellidoMedicoResponsable;
        }
        if(nombre_medico!="")
        {
          block_titles.push("Nombre y apellido");
          block_fields.push(nombre_medico);
        }

        if(seguimiento.seccion6.seccion7.hasOwnProperty('matriculaMedicoResponsable'))
        {
          if(seguimiento.seccion6.seccion7.matriculaMedicoResponsable.toString()!="")
          {
            block_titles.push("Matrícula");
            block_fields.push(seguimiento.seccion6.seccion7.matriculaMedicoResponsable.toString());
          }
        }
        if(block_titles.length>0)
        {
          NewBlock("Médico responsable", block_titles, block_fields, large_titles, large_fields, [h3, h4], 15, 50, 140);
        }


        block_titles = [];
        block_fields = [];
        large_titles = [];
        large_fields = [];
        var nombre_recepcion = "";
        if(seguimiento.seccion6.seccion7.hasOwnProperty('nombreResponsableFarmacia'))
        {
          nombre_recepcion += seguimiento.seccion6.seccion7.nombreResponsableFarmacia;
        }
        if(seguimiento.seccion6.seccion7.hasOwnProperty('apellidoResponsableFarmacia'))
        {
          nombre_recepcion += " " + seguimiento.seccion6.seccion7.apellidoResponsableFarmacia;
        }
        if(nombre_recepcion!="")
        {
          block_titles.push("Nombre y apellido");
          block_fields.push(nombre_recepcion);
        }

        if(seguimiento.seccion6.seccion7.hasOwnProperty('emailResponsableFarmacia'))
        {
          block_titles.push("Email");
          block_fields.push(seguimiento.seccion6.seccion7.emailResponsableFarmacia);
        }
        if(seguimiento.seccion6.seccion7.hasOwnProperty('glnResponsableFarmacia'))
        {
          block_titles.push("GLN Farmacia");
          block_fields.push(seguimiento.seccion6.seccion7.glnResponsableFarmacia);
        }
        if(block_titles.length>0)
        {
          NewBlock("Responsable de recepción", block_titles, block_fields, large_titles, large_fields, [h3, h4], 15, 50, 140);
        }

        
      }
    }

    doc.save(`${state.paciente.seccion1.dni}_${seguimiento.seccion1.fechaSeguimiento}_formulario_completo.pdf`);
  }

  return (
    <React.Fragment>
      <div className="collapse p-3 detalle-seguimiento" key={"collapseSeguimiento" + seguimiento.id} id={"collapseSeguimiento" + seguimiento.id}>
        <div className='d-flex justify-content-center'>
          <p className="titulo text-center">
            {seguimiento.id}
          </p>
          {
            (userId == seguimiento.creadoPor || stateAuth.user.rol==="admin") && state.paciente.seccion1.fallecimiento!=="Sí" ?
            (
              <EditButton seguimientoId={seguimiento.id} />
            ):<></>
          }
          <button className="btn btn-outline-success ml-3" onClick={MakePDFWithData}>Descargar Formulario</button>
          {seguimiento.recetas!=null && seguimiento.recetas.length>0 && <InfoRecetas recetasData={seguimiento.recetas} pacienteId={state.paciente._id} seguimientoId={seguimiento.id}></InfoRecetas>}
          {(seguimiento.creadoPor===null || userId===seguimiento.creadoPor || stateAuth.user.rol==="admin") && state.paciente.seccion1.fallecimiento!=="Sí" && seguimiento.seccion6.moduladores==="Sí" && seguimiento.seccion6.prescribirModulador==="Si" && 
            <NuevaReceta recetasData={seguimiento.recetas} pacienteId={state.paciente._id} seguimientoId={seguimiento.id}></NuevaReceta>
          }
        </div>
        <JSONSchemaForm
          schema={schema}
          uiSchema={uiSchema}
          formData={seguimiento}
          fields={fields}
          widgets={widgets}
          children={true} // esconde el submit
          >
        </JSONSchemaForm>
      </div>
    </React.Fragment>
  )
}

export default DetalleSeguimiento;
