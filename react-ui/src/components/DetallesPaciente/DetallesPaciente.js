import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAddressCard, faUserAltSlash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { obtenerPaciente } from "../../redux/_actions/pacienteAction";
//import schema from "./schema";
import JSONSchemaForm from "@rjsf/core";
import CustomCheckboxes from "../CustomWidgets/CustomCheckBoxes";
import CustomRadioWidget from "../CustomWidgets/CustomRadio";
import CompartirPaciente from "../CustomWidgets/CompartirPaciente"
import UsuariosCompartidos from "../CustomWidgets/UsuariosCompartidos";
import {
  TitleField,
  DescriptionField,
  CustomTextWidget,
  CustomDateWidget,
  CustomFieldTemplate,
  ObjectFieldTemplate,
  SubObjectFieldTemplate,
} from "../../utils/customFormFunctions";
import SeguimientosPaciente from "../SeguimientosPaciente/SeguimientosPaciente";
import { GetUISchema, GetSchema, GetSchemaUnder18, GetUISchemaUnder18 } from "./schemasDetallePaciente";
import cloneDeep from "lodash.clonedeep";
import moment from "moment";
import {jsPDF} from "jspdf";
import { obtenerUsuariosParaCompartir } from "../../redux/_actions/authAction";

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

const schema = GetSchemaUnder18();
const uiSchema = GetUISchemaUnder18();



function DetallesPaciente(props) {
  const id = props.match.params.id ? props.match.params.id : -1;

  const stateAuth = useSelector((state) => state.auth);
  const state = useSelector((state) => state.paciente);
  const dispatch = useDispatch();

  
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [pacienteReady, setPacienteReady] = useState(false);

  useEffect(() => {

    if (state.paciente.length === 0 && id !== -1) {
      dispatch(obtenerPaciente(id));
    } else {
      if (state.paciente._id !== id){
       dispatch(obtenerPaciente(id));
      }
      else {
        setFormData(state.paciente);
        //setLoading(state.loading);
        setPacienteReady(true);

        if(stateAuth.user!=null)
        {
          setUserId(stateAuth.user._id);
          setLoading(state.loading);
        }
      }
    }

  }, [state.paciente]);

  useEffect(() => {
    if (pacienteReady && stateAuth.user!=null){
      setUserId(stateAuth.user._id);
      setLoading(false);
    }
  }, [pacienteReady, stateAuth.user])


  function MakePDFWithData() {
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

    function NewBlock(blockName, blockTitles, blockFields, largeTitles=null, largeFields=null)
    {
      var x_left = 40; //comienzo del texto de los campos en cada sección de la parte izquierda
      var x_right = 135; //comienzo del texto de los campos en cada sección de la parte derecha
      var space_btw_seccion = 10; //espacio entre cada bloque de contenido
      var space_btw_field = 7; //espacio entre cada campo dentro de las secciones
      var space_btw_seccion_and_field = 10;
      var offset_field_right = 55;
      var offset_field_left = 40;

      doc.setFontSize(h3);
      doc.setTextColor(color_verde);
      doc.text(blockName, 10, y, "left");

      doc.setFontSize(h4);
      doc.setTextColor(color_gris_normal);

      y += space_btw_seccion_and_field;
      
      var left = true;

      for (var i = 0; i < blockTitles.length; i++) 
      {
        var x_title = left ? x_left : x_right;
        var x_field = left ? x_left+offset_field_left : x_right+offset_field_right;

        doc.text(blockTitles[i]+":", x_title, y, "right");
        doc.text(blockFields[i], x_field, y, "right");

        left = !left;
        if(left)
            y += space_btw_field;
      }
      
      if(!left)
        y += space_btw_field;

      if(largeTitles!=null)
      {
        for (var i = 0; i < largeTitles.length; i++) 
        {
          doc.text(largeTitles[i]+":", x_left, y, "right");
          doc.text(largeFields[i], x_left+5, y, {maxWidth:130});

          y+=space_btw_field;
        }
      }

      y += space_btw_seccion;
    }

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

    //Info paciente
    y += 20;
    
    var block_titles = [];
    var block_fields = [];

    if(state.paciente.seccion1.hasOwnProperty('historiaClinica'))
    {
      block_titles.push("Historia Clínica");
      block_fields.push(state.paciente.seccion1.historiaClinica);
    }
    if(state.paciente.seccion1.hasOwnProperty('fechaNacimiento'))
    {
      block_titles.push("Fecha de nacimiento");
      block_fields.push(state.paciente.seccion1.fechaNacimiento);
    }
    if(state.paciente.seccion1.hasOwnProperty('fallecimiento'))
    {
      block_titles.push("Fallecido");
      block_fields.push(state.paciente.seccion1.fallecimiento);
    }
    if(state.paciente.seccion1.hasOwnProperty('fechaFallecimiento'))
    {
      block_titles.push("Fecha fallecimiento");
      block_fields.push(state.paciente.seccion1.fechaFallecimiento);
    }
    if(state.paciente.seccion1.hasOwnProperty('causaFallecimiento'))
    {
      block_titles.push("Causa fallecimiento");
      block_fields.push(state.paciente.seccion1.causaFallecimiento);
    }
    if(state.paciente.seccion1.hasOwnProperty('sexo'))
    {
      block_titles.push("Sexo");
      block_fields.push(state.paciente.seccion1.sexo);
    }
    if(state.paciente.seccion1.hasOwnProperty('nivelEducativo'))
    {
      block_titles.push("Nivel educativo");
      block_fields.push(state.paciente.seccion1.nivelEducativo);
    }
    if(state.paciente.seccion1.hasOwnProperty('celular'))
    {
      block_titles.push("Celular");
      block_fields.push(state.paciente.seccion1.celular);
    }
    if(state.paciente.seccion1.hasOwnProperty('email'))
    {
      block_titles.push("Email");
      block_fields.push(state.paciente.seccion1.email);
    }
    NewBlock("Datos básicos del paciente", block_titles, block_fields);


    block_titles = [];
    block_fields = [];
    if(state.paciente.seccion1.hasOwnProperty('nombreResponsable') && state.paciente.seccion1.hasOwnProperty('apellidoResponsable'))
    {
      block_titles.push("Nombre y apellido");
      block_fields.push(state.paciente.seccion1.nombreResponsable+" "+state.paciente.seccion1.apellidoResponsable);
    }
    if(state.paciente.seccion1.hasOwnProperty('dniResponsable'))
    {
      block_titles.push("DNI");
      block_fields.push(state.paciente.seccion1.dniResponsable.toString());
    }
    if(state.paciente.seccion1.hasOwnProperty('filiacionResponsable'))
    {
      block_titles.push("Filiación");
      block_fields.push(state.paciente.seccion1.filiacionResponsable);
    }
    if(state.paciente.seccion1.hasOwnProperty('edadResponsable'))
    {
      block_titles.push("Edad");
      block_fields.push(state.paciente.seccion1.edadResponsable);
    }
    if(state.paciente.seccion1.hasOwnProperty('vinculoResponsable'))
    {
      block_titles.push("Vínculo");
      block_fields.push(state.paciente.seccion1.vinculoResponsable);
    }
    NewBlock("Datos del responsable", block_titles, block_fields);


    block_titles = [];
    block_fields = [];
    var large_titles = [];
    var large_fields = [];
    if(state.paciente.seccion1.hasOwnProperty('institucion_provincia'))
    {
      block_titles.push("Provincia");
      block_fields.push(state.paciente.seccion1.institucion_provincia);
    }
    if(state.paciente.seccion1.hasOwnProperty('institucion_departamento'))
    {
      block_titles.push("Departamento");
      block_fields.push(state.paciente.seccion1.institucion_departamento);
    }
    if(state.paciente.seccion1.hasOwnProperty('institucion'))
    {
      large_titles.push("Institucion");
      large_fields.push(state.paciente.seccion1.institucion);
    }
    NewBlock("Datos de la institución", block_titles, block_fields, large_titles, large_fields);


    block_titles = [];
    block_fields = [];
    large_titles = [];
    large_fields = [];
    if(state.paciente.seccion1.hasOwnProperty('pais'))
    {
      block_titles.push("País");
      block_fields.push(state.paciente.seccion1.pais);
    }
    if(state.paciente.seccion1.hasOwnProperty('provincia'))
    {
      block_titles.push("Provincia");
      block_fields.push(state.paciente.seccion1.provincia);
    }
    if(state.paciente.seccion1.hasOwnProperty('departamento'))
    {
      block_titles.push("Departamento");
      block_fields.push(state.paciente.seccion1.departamento);
    }
    if(state.paciente.seccion1.hasOwnProperty('localidad'))
    {
      block_titles.push("Localidad");
      block_fields.push(state.paciente.seccion1.localidad);
    }
    var direccion = "";
    if(state.paciente.seccion1.hasOwnProperty('domicilioCalle'))
    {
      direccion += state.paciente.seccion1.domicilioCalle;
    }
    if(state.paciente.seccion1.hasOwnProperty('domicilioNumero'))
    {
      direccion += " "+state.paciente.seccion1.domicilioNumero;
    }
    if(state.paciente.seccion1.hasOwnProperty('domicilioPiso'))
    {
      direccion += " "+state.paciente.seccion1.domicilioPiso;
    }
    if(state.paciente.seccion1.hasOwnProperty('domicilioDepartamento'))
    {
      direccion += " "+state.paciente.seccion1.domicilioDepartamento;
    }
    if(direccion!="")
    {
      large_titles.push("Dirección");
      large_fields.push(direccion);
    }
    NewBlock("Datos de residencia", block_titles, block_fields, large_titles, large_fields);


    block_titles = [];
    block_fields = [];
    large_titles = [];
    large_fields = [];
    if(state.paciente.seccion2.hasOwnProperty('fechaDiagnostico'))
    {
      block_titles.push("Fecha de diagnóstico");
      block_fields.push(state.paciente.seccion2.fechaDiagnostico);
    }
    if(state.paciente.seccion2.hasOwnProperty('edadDiagnostico'))
    {
      block_titles.push("Edad al diagnóstico");
      block_fields.push(state.paciente.seccion2.edadDiagnostico);
    }
    if(state.paciente.seccion2.hasOwnProperty('pesquisaNeonatal'))
    {
      if(state.paciente.seccion2.pesquisaNeonatal=="Realizada")
      {
        if(state.paciente.seccion2.hasOwnProperty('estrategia'))
        {
          block_titles.push("Estrategia pesquisa");
          block_fields.push(state.paciente.seccion2.estrategia);
        }
      }
    }
    if(state.paciente.seccion2.hasOwnProperty('funcionalismoPancreatico'))
    {
      block_titles.push("Funcionalismo pancreático");
      block_fields.push(state.paciente.seccion2.funcionalismoPancreatico);
    }
    if(state.paciente.seccion2.hasOwnProperty('fechaCloruro'))
    {
      block_titles.push("Fecha prueba sudor");
      block_fields.push(state.paciente.seccion2.fechaCloruro);
    }
    if(state.paciente.seccion2.hasOwnProperty('cloruro1'))
    {
      block_titles.push("Primer cloruro");
      block_fields.push(state.paciente.seccion2.cloruro1.toString());
    }
    if(state.paciente.seccion2.hasOwnProperty('cloruro2'))
    {
      block_titles.push("Segundo cloruro");
      block_fields.push(state.paciente.seccion2.cloruro2.toString());
    }
    if(state.paciente.seccion2.hasOwnProperty('potencialNasal'))
    {
      if(state.paciente.seccion2.potencialNasal=="Realizado")
      {
        if(state.paciente.seccion2.hasOwnProperty('potencialNasalRealizado'))
        {
          block_titles.push("Potencial nasal");
          block_fields.push(state.paciente.seccion2.potencialNasalRealizado);
        }
      }
    }
    if(state.paciente.seccion2.hasOwnProperty('estudioGeneticoMolecular'))
    {
      if(state.paciente.seccion2.estudioGeneticoMolecular=="Realizado")
      {
        if(state.paciente.seccion2.hasOwnProperty('alelo1'))
        {
          block_titles.push("Primer alelo");
          block_fields.push(state.paciente.seccion2.alelo1);
        }
        if(state.paciente.seccion2.hasOwnProperty('alelo2'))
        {
          block_titles.push("Segundo alelo");
          block_fields.push(state.paciente.seccion2.alelo2);
        }
      }
    }
    if(state.paciente.seccion2.hasOwnProperty('sospechaDiagnostica'))
    {
      large_titles.push("Sospecha diagnóstica");
      var sospecha = "";
      for (let i = 0; i < state.paciente.seccion2.sospechaDiagnostica.length; i++) 
      {
        sospecha += state.paciente.seccion2.sospechaDiagnostica[i];
        if(i<state.paciente.seccion2.sospechaDiagnostica.length-1)
          sospecha += " - ";
      }
      large_fields.push(sospecha);
    }
    NewBlock("Datos de diagnóstico", block_titles, block_fields, large_titles, large_fields);

    doc.save(`${state.paciente.seccion1.dni}_formulario_completo.pdf`);
  }

  function MakePDFEmpty() {
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

    function NewBlock(blockName, blockTitles, blockFields, largeTitles=null, largeFields=null)
    {
      var x_left = 40; //comienzo del texto de los campos en cada sección de la parte izquierda
      var x_right = 135; //comienzo del texto de los campos en cada sección de la parte derecha
      var space_btw_seccion = 10; //espacio entre cada bloque de contenido
      var space_btw_field = 7; //espacio entre cada campo dentro de las secciones
      var space_btw_seccion_and_field = 10;
      var offset_field_right = 55;
      var offset_field_left = 40;
  
      doc.setFontSize(h3);
      doc.setTextColor(color_verde);
      doc.text(blockName, 10, y, "left");
  
      doc.setFontSize(h4);
      doc.setTextColor(color_gris_normal);
  
      y += space_btw_seccion_and_field;
      
      var left = true;
  
      for (var i = 0; i < blockTitles.length; i++) 
      {
        var x_title = left ? x_left : x_right;
        var x_field = left ? x_left+offset_field_left : x_right+offset_field_right;
  
        doc.text(blockTitles[i]+":", x_title, y, "right");
        doc.text(blockFields[i], x_field, y, "right");
  
        left = !left;
        if(left)
            y += space_btw_field;
      }
      
      if(!left)
        y += space_btw_field;
  
      if(largeTitles!=null)
      {
        for (var i = 0; i < largeTitles.length; i++) 
        {
          doc.text(largeTitles[i]+":", x_left, y, "right");
          doc.text(largeFields[i], x_left+5, y, {maxWidth:130});
  
          y+=space_btw_field;
        }
      }
  
      y += space_btw_seccion;
    }

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

    //Info paciente
    y += 20;

    var block_titles = ["Historia Clínica", "Fecha de nacimiento", "Fallecido", "Fecha fallecimiento", "Causa fallecimiento", "Género", "Celular", "Email"];
    var block_fields = ["", "", "", "", "", "", "", ""];
    var large_titles = ["Sexo", "Nivel educativo"];
    var large_fields = ["Masculino - Femenino - Otro", "Escuela inicial/Jardín - Primario - Secundario - Terciario - Universitario"];
    NewBlock("Datos básicos del paciente", block_titles, block_fields, large_titles, large_fields);

    block_titles = ["Nombre y apellido", "Edad", "Filiación", "DNI"];
    block_fields = ["", "", "", ""];
    large_titles = ["Vínculo"];
    large_fields = ["Padre - Madre - Tutor - Hermano/a - Otro familiar - Otro parentesco - Hijo/a - Abuelo/a - Tío/a - Primo/a - Nieto/a - Conyuge - Conviviente - Padre buiológico - Madre biológica"];
    NewBlock("Datos del responsable", block_titles, block_fields, large_titles, large_fields);

    block_titles = ["Provincia", "Departamento", "Institución"];
    block_fields = ["", "", ""];
    NewBlock("Datos de la institución", block_titles, block_fields);

    block_titles = ["País", "Provincia", "Departamento", "Localidad", "Código postal", "Domicilio"];
    block_fields = ["", "", "", "", "", ""];
    NewBlock("Datos de residencia", block_titles, block_fields);

    block_titles = ["Fecha diagnóstico", "Pesquisa neonatal", "Estrategia", "Primer cloruro", "Segundo cloruro", "Fecha prueba sudor", "Potencial nasal", "Potencial nasal realizado", "Estudio genético molecular", "Funcionalismo pancreático"];
    block_fields = ["", "Realizada - No realizada", "TIR/TIR - TIR/PAP", "", "", "", "Realizado - No realizado", "Normal - Anormal", "Realizado - Pendiente", "Suficiente - Insuficiente"];
    large_titles = ["Sospecha diagnóstica", "Primer alelo", "Segundo alelo"];
    large_fields = ["", "", ""];
    NewBlock("Datos de diagnóstico", block_titles, block_fields, large_titles, large_fields);

    doc.save(`${state.paciente.seccion1.dni}_formulario_vacio.pdf`);
  }


  return (
    <React.Fragment>
      {!loading ? (
        <React.Fragment>
          <div className="row">
            <div className="col-12">
              {
                (state.paciente.creadoPor == userId && state.paciente.seccion1.fallecimiento!=="Sí") ? (
                  <CompartirPaciente></CompartirPaciente>
                ) : (<></>)
              }
              <div className="row">
                <div className="col-6 col-md-2 my-2">
                  <button className="btn btn-lg btn-outline-primary w-100 font-weight-bold" data-toggle="collapse" data-target="#collapsePDF" aria-expanded="false" aria-controls="collapsePDF">Formularios</button>
                </div>
                {/* <div className="col-6 col-md-2 my-2">
                  <button className="btn btn-lg btn-outline-primary w-100 font-weight-bold">Datos</button>
                </div> */}
              </div>
              <div className="row">
                <div className="col-6 collapse" id="collapsePDF">
                  <button className="btn btn-lg btn-outline-primary w-100 font-weight-bold" onClick={MakePDFWithData}>Formulario con datos actuales</button>
                </div>
                <div className="col-6 collapse" id="collapsePDF">
                  <button className="btn btn-lg btn-outline-primary w-100 font-weight-bold" onClick={MakePDFEmpty}>Formulario vacío</button>
                </div>
              </div>
              {state.paciente.seccion1.fallecimiento==="Sí" && <h6>El registro se encuentra en sólo edición al estar fallecido el paciente.</h6>}
              <JSONSchemaForm
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                fields={fields}
                widgets={widgets}
                children={true} // esconde el submit
              />
            </div>
          </div>
          <SeguimientosPaciente paciente={state.paciente} userId={userId} />
        </React.Fragment>
      ) : (
        <div className="col">
          <Loader
            className="text-center"
            type="ThreeDots"
            color="#999999"
            height={100}
            width={100}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default DetallesPaciente;