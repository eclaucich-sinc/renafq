import React, { useState, useEffect } from "react";
import "./Formulario.scss";
import JSONSchemaForm from "@rjsf/core";
// import _, { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faBookMedical,
} from "@fortawesome/free-solid-svg-icons";
import CustomCheckboxes from "../CustomWidgets/CustomCheckBoxes";
import {
  agregarPaciente,
  agregarPacienteEPF,
  obtenerPaciente,
  modificarPaciente,
} from "../../redux/_actions/pacienteAction";
import { useSelector, useDispatch } from "react-redux";
import {
  PACIENTE_AGREGADO,
  PACIENTE_MODIFICADO,
  PACIENTE_ELIMINADO,
  PACIENTE_ERROR,
  CLEAR_ERRORS,
  LISTAR_PACIENTES,
} from "../../redux/types";
import { setAlert } from "../../redux/_actions/alertAction";
//import schema from "./schema";
import CustomRadioWidget from "../CustomWidgets/CustomRadio";
import cloneDeep from "lodash.clonedeep";
import moment from "moment";
import ModalInformativo from "../ModalInformativo";
import { useHistory } from "react-router-dom";

import {
  TitleField,
  DescriptionField,
  CustomTextWidget,
  CustomDateWidget,
  CustomFieldTemplate,
  ObjectFieldTemplate,
  SubObjectFieldTemplate,
} from "../../utils/customFormFunctions";
import { getDate } from "date-fns";

import { GetSchema, GetSchemaUnder18, GetUISchema, GetUISchemaUnder18 } from "./schemasFormulario";
import axios from "axios";

// export const TitleField = (props) => {
//   // console.log("titlefield", props);
//   const { title } = props;

//   let legend = `${title}`;

//   // let icon = faUser;
//   // switch (title) {
//   //   case "Prueba del sudor":
//   //     icon = faAddressCard;
//   //     break;

//   //   case "Ficha médica":
//   //     icon = faBookMedical;
//   //     break;

//   //   default:
//   //     break;
//   // }

//   return <h5 className="card-header-title">
//             {legend}
//         </h5>;
//   //return "";
// };
const widgets = {
  CheckboxesWidget: CustomCheckboxes,
  RadioWidget: CustomRadioWidget,
};

const fields = {
  TitleField: TitleField,
};

// /**
//  * Template base para los fields.
//  * @param {*} props
//  */
// function CustomFieldTemplate(props) {
//   const {
//     id,
//     classNames,
//     label,
//     help,
//     required,
//     description,
//     rawErrors = [],
//     children,
//     uiSchema,
//     errors,
//   } = props;
//   return (
//     <div className={uiSchema.clases || "col-md-4 col-lg-3"}>
//       <div className={classNames}>
//         <label htmlFor={id}>
//           {label}
//           {required ? "*" : null}
//         </label>
//         {description}
//         {children}
//         {errors}
//         {/* <div>
//           <ul class="error-detail bs-callout bs-callout-info">
//           {rawErrors.map(error => <li class="text-danger">{error}</li>)}
//           </ul>
//         </div> */}

//         {help}
//       </div>
//     </div>
//   );
// }

// /**
//  * Función que modifica los type object (ver schema.json). No son widgets, por lo tanto no se definen dentro de "widget"
//  * Se usa así: "ui:ObjectFieldTemplate": ObjectFieldTemplate, dentro del uiSchema
//  * @param {*} props
//  */
// function ObjectFieldTemplate(props) {
//   const icono = props.uiSchema.Icono ? (
//     <FontAwesomeIcon icon={props.uiSchema.Icono} className="mr-2" />
//   ) : (
//     ""
//   );
//   const titulo = props.uiSchema.MostrarTitulo ? (
//     <div className="border-bottom border-gray pb-2 mb-3 title">
//       {icono}
//       {props.title}
//     </div>
//   ) : (
//     ""
//   );

//   return (
//     <div className="card shadow-sm border border-dark" id={props.idSchema.$id}>
//       <div className="card-body">
//         {titulo}
//         <div className="row">
//           {props.description}
//           {props.properties.map((element) => (
//             <React.Fragment key={element.content.props.idSchema.$id}>
//               {element.content}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// ObjectFieldTemplate.defaultProps = {
//   options: {
//     value: "",
//     // clases: "col-md-4 col-lg-3"
//   },
// };

let schema = GetSchema();
let uiSchema = GetUISchema();

const formData = {};

let fechaNacimientoPrev = null;

//---------------------------------------------------------------------------//
//FUNCIONES
//---------------------------------------------------------------------------//

//funcion para calcular la edad
function getAge(fechaDesde, fechaHasta) {
  // let a = moment(fechaHasta, "YYYY-MM-D");
  // let b = moment(fechaDesde, "YYYY-MM-D");
  let age = moment.duration(fechaHasta.diff(fechaDesde));
  let yearAge = age.years();
  let monthAge = age.months();
  let dayAge = age.days();
  let yearString, monthString, dayString;
  let ageString = "";

  age = {
    years: yearAge,
    months: monthAge,
    days: dayAge,
  };

  if (age.years > 1) yearString = " años";
  else yearString = " año";
  if (age.months > 1) monthString = " meses";
  else monthString = " mes";
  if (age.days > 1) dayString = " días";
  else dayString = " día";

  if (age.years > 0 && age.months > 0 && age.days > 0)
    ageString =
      age.years +
      yearString +
      ", " +
      age.months +
      monthString +
      ", y " +
      age.days +
      dayString +
      "";
  else if (age.years === 0 && age.months === 0 && age.days > 0)
    ageString = "" + age.days + dayString + "";
  else if (age.years > 0 && age.months === 0 && age.days === 0)
    ageString = age.years + yearString;
  else if (age.years > 0 && age.months > 0 && age.days === 0)
    ageString = age.years + yearString + " y " + age.months + monthString + " ";
  else if (age.years === 0 && age.months > 0 && age.days > 0)
    ageString = age.months + monthString + " y " + age.days + dayString + " ";
  else if (age.years > 0 && age.months === 0 && age.days > 0)
    ageString = age.years + yearString + " y " + age.days + dayString + " ";
  else if (age.years === 0 && age.months > 0 && age.days === 0)
    ageString = age.months + monthString + " ";
  else ageString = "No es posible calcular la edad";

  return ageString;
}

function getAgeYears(fechaDesde) {
  let age = moment.duration(moment().diff(fechaDesde));
  return age.years();
}

function calculateAge(birthday) {
  // birthday is a date
  var ageDifMs = Date.now() - birthday;
  console.log(
    "ageDifMs" + ageDifMs + "- birthday " + birthday + " - Now " + Date.now()
  );
  console.log("Calculo con moment: " + moment().diff(birthday, "years"));

  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function existePaciente(id)
{
  try{
    const config = { header: { "Content-Type": "application/json" } };
    await axios.get(`/api/pacientes/dni/${id}`, config);
    return true;
  }
  catch{
    return false;
  }
}

let error_inst_dep = false;
let error_inst_prov = false;
let error_inst = false;
let error_dom_dep = false;
let error_dom_loc = false;
let error_dni = false;

let dni_inicial = ""; //cuando se edita el caso tiene el valor del dni del paciente
let dni_actual = ""; //lleva registro del dni que se está ingresando en el formulario

//Funcion utilizada para personalizar los campos de error
function transformErrors(errors) {
  return errors.map((error) => {
    if (error.name === "required") {
      error.message = "Es un valor requerido";
    }
    if (error.name === "minItems") {
      error.message = "Debe seleccionar al menos un valor";
    }
    if(error.name === "oneOf" || error.name==="enum"){
      error.message = "";
    }

    if(error.property===".seccion1.institucion_provincia")
    {
      if(error_inst_prov===false)
        error_inst_prov = true;
      else
        error.message="";
    }
    if(error.property===".seccion1.institucion_departamento")
    {
      if(error_inst_dep===false)
        error_inst_dep = true;
      else
        error.message="";
    }
    if(error.property===".seccion1.institucion")
    {
      if(error_inst===false)
        error_inst = true;
      else
        error.message="";
    }
    if(error.property===".seccion1.departamento")
    {
      if(error_dom_dep===false)
        error_dom_dep = true;
      else
        error.message="";
    }
    if(error.property===".seccion1.localidad")
    {
      if(error_dom_loc===false)
        error_dom_loc = true;
      else
        error.message="";
    }
    
    return error;
  });
}

//---------------------------------------------------------------------------//
//FORMULARIO
//---------------------------------------------------------------------------//


const Formulario = (props) => {
  const state = useSelector((state) => state.paciente);
  const stateAuth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const history = useHistory();

  const [formData, setFormData] = useState({});
  const [mostrarValidacion, setMostrarValidacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");
  const [formEnviado, setFormEnviado] = useState(false);
  const [pacienteCargado, setPacienteCargado] = useState(false);

  const { match } = props;
  console.log(
    "🚀 ~ file: Formulario.js ~ line 321 ~ Formulario ~ match",
    match
  );

  useEffect(() => {
    if (state.modificar && !pacienteCargado && match.params !== {}) {
      const { id = -1 } = match.params;

      if (id !== -1 && Object.keys(state.paciente).length === 0) {
        dispatch(obtenerPaciente(id));
      }
    }

    if (Object.keys(state.paciente).length !== 0) {
      setPacienteCargado(true);
      dni_inicial = state.paciente.seccion1.dni;
      dni_actual = state.paciente.seccion1.dni;
      console.log("DNI inicial " + dni_inicial);
    }

    if (state.agregar) {
      setPacienteCargado(true);
    }

    setFormData(state.paciente);

  }, [state.paciente]);

  useEffect(() => {
    // if (!stateAuth.isAuthenticated) {
    //   history.push('/login');
    // }

    // if (state.error !== null) {
    //   dispatch(setAlert(state.error, "danger"));
    //   dispatch({type: CLEAR_ERRORS});
    // }

    // if (state.paciente !== null) {
    //   console.log(state.paciente);
    //   // setFormData({});
    // }
    // eslint-disable-next-line
    // if(campoActualizado){
    //   setCampoActualizado(false);
    //   setFormData(formData);
    // }
  }, [state.error]);
  // }, [state.error, state.agregado, state.paciente]);

  // let mensajeConfirmacion = '';

  const onSubmit = ({ formData }, e) => {
    // e.preventDefault();

    if (state.agregar) {
      dispatch(agregarPaciente(formData, stateAuth.user._id));
      //dispatch(agregarPacienteEPF(formData));
      setMensajeConfirmacion("Paciente agregado correctamente");
      mostrarConfirmacionAgregado();
      // dispatch(obtenerPaciente("30787004"));
    }

    if (state.modificar) {
      dispatch(modificarPaciente(state.paciente._id, formData));
      setMensajeConfirmacion("Paciente modificado correctamente");
      mostrarConfirmacionAgregado();
    }

    setFormEnviado(true);
    // console.log("Data submitted: ", formData);

    // dispatch(agregarPaciente(formData, stateAuth.user._id));

    // mostrarConfirmacionAgregado();
    // dispatch(obtenerPaciente("30787004"));
  };

  const OnChange = ({ formData }) => {

    if(formData.seccion1.fallecimiento==="Sí")
    {
      window.alert("Establecer al paciente como fallecido hará que el registro del mismo quede archivado y no se pueda volver a editar")
    }

    let edadDiagnostico = "";

    if(state.modificar)
    {
      if(String(formData.seccion1.dni)!==String(dni_inicial) && String(formData.seccion1.dni)!==String(dni_actual) && String(formData.seccion1.dni).length>7)
      {
        dni_actual = formData.seccion1.dni;
        existePaciente(formData.seccion1.dni).then( existe => {
          if(existe)
          {
            console.log("Exsite");
            error_dni = true;
          }
          else
          {
            console.log("No existe");
            error_dni = false;
          }
        });
      }
    }
    else
    {
      if(String(formData.seccion1.dni).length>7 && String(formData.seccion1.dni)!==String(dni_actual))
      {
        dni_actual = formData.seccion1.dni;
        existePaciente(formData.seccion1.dni).then( existe => {
          if(existe)
          {
            console.log("Existe");
            error_dni = true;
          }
          else
          {
            console.log("No existe");
            error_dni = false;
          }
        });
      }
    }

    if (formData.seccion1.hasOwnProperty("fechaNacimiento"))
    {
      if (formData.seccion1.fechaNacimiento != undefined)
      {
        if(formData.seccion1.fechaNacimiento != fechaNacimientoPrev)
        {
          fechaNacimientoPrev = formData.seccion1.fechaNacimiento;

          //Si es menor de 18 años, muestro los campos del responsable
          if (moment().diff(formData.seccion1.fechaNacimiento, "years") < 18) 
          {
            //Solucion temporal
            //Pregutar cómo cambiar la clase
            uiSchema = GetUISchemaUnder18();
            schema = GetSchemaUnder18();
          }
          else
          {
            schema = GetSchema();
            uiSchema = GetUISchema();
          }
          
          const newFormData = cloneDeep(formData);
          setFormData(newFormData);
        }
       
        if(formData.seccion2.fechaDiagnostico != undefined)
        {
          const feNac = moment(formData.seccion1.fechaNacimiento, "YYYY-MM-DD");
          const feDiag = moment(formData.seccion2.fechaDiagnostico, "YYYY-MM-DD");
          edadDiagnostico = getAge(feNac, feDiag);
          const newFormData = cloneDeep(formData);
          newFormData.seccion2.edadDiagnostico = edadDiagnostico;
          setFormData(newFormData);
        }
      }
    }
  };

  // redirige al usuario al home una vez agregado
  const mostrarConfirmacionAgregado = () => {
    setMostrarValidacion(true);
    setTimeout(() => {
      dispatch({ type: LISTAR_PACIENTES });
      history.push("/");
    }, 2000);
  };

  //Funcion que valida los campos prueba del sudor
  const validate = (formData, errors) => {

    error_inst = false;
    error_inst_dep = false;
    error_inst_prov = false;
    error_dom_dep = false;
    error_dom_loc = false;

    if(error_dni)
    {
      errors.seccion1.dni.addError("Paciente existente");
    }

    //valido DNI
    var ex_regular_dni;
    ex_regular_dni = /^\d{8}(?:[-\s]\d{4})?$/;
    if (!ex_regular_dni.test(formData.seccion1.dni)) {
      errors.seccion1.dni.addError("Ingrese un DNI válido");
    }

    if (
      formData.seccion2.cloruro1 === undefined &&
      formData.seccion2.cloruro2 === undefined
    ) {
      errors.seccion2.cloruro1.addError(
        "Debe completar al menos un valor de Cloruro"
      );
    } else {
      if (formData.seccion2.cloruro1 > 160) {
        errors.seccion2.cloruro1.addError(
          "El valor máximo para Cloruro 1 es 160"
        );
      }
      if (formData.cloruro2 > 160) {
        errors.seccion2.cloruro2.addError(
          "El valor máximo para Cloruro 2 es 160"
        );
      }
    }

    return errors;
  };

  return (
    <div className="row">
      <div className="col-12">
        {/* <div className="card shadow-sm border border-dark">
          <div className="card-body"> */}
        { formEnviado && mostrarValidacion &&
          ( <ModalInformativo title={mensajeConfirmacion} /> )
        }
        { pacienteCargado && !mostrarValidacion && 
        (
          <>
            <h3>{state.modificar ? 'Modificar paciente' : 'Agregar paciente'}</h3>
            <div id="formulario" className={mostrarValidacion ? "d-none" : ""}>
              <JSONSchemaForm
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                fields={fields}
                onSubmit={onSubmit}
                onChange={OnChange}
                //no cargo el FieldTemplate acá por está sobrecargado para cada UiSchema
                // FieldTemplate={CustomFieldTemplate}
                widgets={widgets}
                transformErrors={transformErrors}
                validate={validate}
                showErrorList={false}
                noHtml5Validate
              >
                <div className="text-center mt-n3 mb-3">
                  <button className="btn btn-success" type="submit">{state.modificar ? 'Modificar paciente' : 'Agregar paciente'}</button>
                </div>
              </JSONSchemaForm>
            </div>
          </>
        )
      }
      </div>
    </div>
  );
};
export default Formulario;
