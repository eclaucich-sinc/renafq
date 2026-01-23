import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from "date-fns";
import { Typeahead } from 'react-bootstrap-typeahead';

// remove all titles
export const TitleField = (props) => {
  const { title, required, id } = props
  return '';
}

// remove all descriptions
export const DescriptionField = (props) => {
  return '';
}

export const CustomTypeAhead = (props) => {

  const [singleSelections, setSingleSelections] = useState([]);
  const [multiSelections, setMultiSelections] = useState([]);
  const { options } = props;
  const options2 = [1,2,3,4,5,6,7,8,9].map(o => `Option ${o.toString()}`);

  return (
    <Typeahead
      id="basic-typeahead-single"
      labelKey="name"
      onChange={setSingleSelections}
      options={options2}
      placeholder="Choose a state..."
      selected={singleSelections}
    />
  );
}

CustomTypeAhead.defaultProps = {
  options: {},
};


/**
 * Función que permite modificar un determinado widget. Se va a aplicar a todos los elementos que
 * en el uiSchema se declaren de este tipo
 * @param {*} props
 */
export const CustomTextWidget = (props) => {

  const {options} = props;
  const {value, clases} = options;
  
  return (
      <input type="text"
        className="form-control-plaintext"
        readOnly
        value={props.value || value}
        data-toggle="tooltip"
        data-placement="top"
        title={props.value}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)} />
  );
};

CustomTextWidget.defaultProps = {
  options: {
    value: "",
  }
};

/**
 * Función que permite modificar un determinado widget. Se va a aplicar a todos los elementos que
 * en el uiSchema se declaren de este tipo
 * @param {*} props
 */
export const CustomDateWidget = (props) => {
  const {id, classNames, label, help, required, description, rawErrors=[], children, uiSchema, errors} = props;
  const regExp = /(.+)\s*__(.+)__(\s*(.+))?/;
  const match = regExp.exec(label);
  let desc = match && match[2] ? `${match[1]}<sub>${match[2]}</sub>${match[3] ? match[3] : ''}` : label;
  desc = required ? `${desc} <span class="text-danger font-weight-bolder">*</span>` : desc;

  return (
    <div className={uiSchema.clases || "col-md-4 col-lg-3"}>
      <div className={classNames}>
        <label htmlFor={id} dangerouslySetInnerHTML={{__html: desc}}></label>
        {description}
        {children}
        {errors}
        {<ul className="text-muted small">{help} </ul>}
      </div>
    </div>
  );
};

/**
 * Template base para los fields.
 * @param {*} props
 */
export function CustomFieldTemplate(props) {
  const {id, classNames, label, help, required, description, rawErrors=[], children, uiSchema, errors} = props;
  const regExp = /(.+)\s*__(.+)__(\s*(.+))?/;
  const match = regExp.exec(label);
  let desc = match && match[2] ? `${match[1]}<sub>${match[2]}</sub>${match[3] ? match[3] : ''}` : label;
  desc = required ? `${desc} <span class="text-danger font-weight-bolder">*</span>` : desc;
  return (
    <div className={uiSchema.clases || "col-md-4 col-lg-3"}>
      <div className={classNames}>
        <label htmlFor={id} dangerouslySetInnerHTML={{__html: desc}}></label>
        {description}
        {children}
        {errors}
        {<ul className="text-muted small">{help} </ul>}
      </div>
    </div>
  );
}

/**
 * Función que modifica los type object (ver schema.json). No son widgets, por lo tanto no se definen dentro de "widget"
 * Se usa así: "ui:ObjectFieldTemplate": ObjectFieldTemplate, dentro del uiSchema
 * @param {*} props
 */
export function ObjectFieldTemplate(props) {
  const icono = props.uiSchema.Icono ? <FontAwesomeIcon icon={props.uiSchema.Icono} className="mr-2" /> : '';
  const targetId = props.uiSchema.auxID ? props.idSchema.$id+'_'+props.uiSchema.auxID : props.idSchema.$id; //Cuando en una misma página hay schemas con el mismo nombre el auxID ayuda a diferenciarlos para que no se desplieguen dos accordion al mismo tiempo
  const titulo = props.uiSchema.MostrarTitulo ?
  <div className="title" data-toggle="collapse" data-target={"#" + targetId + '_body'} aria-expanded="true" aria-controls="collapseOne">
    {icono}{props.title}
  </div> : '';

  return (
    <div className="accordion" id={targetId}>
      <div className="card shadow-sm border border-dark">
        <div className="card-header">
          {titulo}
        </div>
        <div id={targetId + '_body'} className="collapse show">
          <div className="card-body">
            <div className="row">
              {props.description}
              {props.properties.map(element => <React.Fragment key={element.content.props.idSchema.$id}>{element.content}</React.Fragment>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function CustomObjectFieldTemplate(props) {
  const icono = props.uiSchema.Icono ? <FontAwesomeIcon icon={props.uiSchema.Icono} className="mr-2" /> : '';
  const titulo = props.uiSchema.Titulo

  return (
    <div className="card">
      <div className="card-header font-weight-bold mt-4 h4">
        {titulo}
      </div>
      <div className="card-body">
        <div className="row">
          {props.description}
          {props.properties.map(element => <React.Fragment key={element.content.props.idSchema.$id}>{element.content}</React.Fragment>)}
        </div>
      </div>
    </div>
  );
}

export function FileObjectTemplate(props) {
  const title = props.uiSchema.Titulo;
  const desc = props.required ? `<span class="text-danger font-weight-bolder">*</span>` : '';
  
  return (
    <div>
      <label htmlFor="inputFile">{title}</label>
      <label htmlFor={props.id} dangerouslySetInnerHTML={{__html: desc}}></label>
      <input className="form-control form-control-lg" id="inputFile" type="file" accept="image/jpg, image/jpeg" ></input>
    </div>
  );
}

ObjectFieldTemplate.defaultProps = {
  options: {
    value: "",
    // clases: "col-md-4 col-lg-3"
  }
};

/**
 * Función que modifica los type object (ver schema.json). No son widgets, por lo tanto no se definen dentro de "widget"
 * Se usa así: "ui:ObjectFieldTemplate": ObjectFieldTemplate, dentro del uiSchema
 * @param {*} props
 */
export function SubObjectFieldTemplate(props) {
  const icono = props.uiSchema.Icono ? <FontAwesomeIcon icon={props.uiSchema.Icono} className="mr-2" /> : '';
  const titulo = props.uiSchema.MostrarTitulo ?
    <div className="border-bottom border-gray pb-2 mb-3 title">
      {icono}{props.title}
    </div> : '';

  return (
      <React.Fragment>
          {titulo}
          <div className="row">
            {props.description}
            {props.properties.map(element => <React.Fragment key={element.content.props.idSchema.$id}>{element.content}</React.Fragment>)}
          </div>
      </React.Fragment>
  );
}
