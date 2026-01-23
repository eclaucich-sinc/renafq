/*
  Schemas utilizados en la pantalla de detalles de un paciente. Solo la parte superior referida a información personal del paciente.
  Todos campos de solo lectura.
*/

import { ObjectFieldTemplate, CustomFieldTemplate } from "../../utils/customFormFunctions";
import { faAddressCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { GetInstituciones, GetNivelesEducativo, GetProvincias, GetSexos, GetAlelos } from "../../utils/listsForSchemas";

export const GetSchema = () => {
  return {
    "title": "Formulario de alta de un nuevo paciente",
    "type": "object",
    "properties": {
      "seccion1": {
        "title": "Datos del paciente",
        "type": "object",
        "properties": {
          "datosPaciente": {
            "type": "string",
            "title": "Paciente"
          },
          "historiaClinica": {
            "type": "string",
            "title": "Historia Clínica"
          },
          "nombre": {
            "type": "string",
            "title": "Nombre"
          },
          "apellido": {
            "type": "string",
            "title": "Apellido"
          },
          "dni": {
            "type": "number",
            "title": "D.N.I.",
            "minLength": 8
          },
          "fechaNacimiento": {
            "type": "string",
            "title": "Fecha de nacimiento",
            "format": "date"
          },
          "sexo": {
            "type": "string",
            "title": "Sexo",
            "enum": GetSexos()
          },
          "genero": {
            "type": "string",
            "title": "Género"
          },
          "nivelEducativo": {
            "type": "string",
            "title": "Nivel educativo",
          },
          "residencia": {
            "type": "string",
            "title": "Residencia"
          },
          "pais": {
            "title": "País",
            "type": "string"
          },
          "provincia": {
            "title": "Provincia",
            "type": "string",
          },
          "localidad": {
            "title": "Localidad",
            "type": "string",
          },
          "departamento": {
            "type": "string",
            "title": "Departamento"
          },
          "codigoPostal": {
            "title": "Código postal",
            "type": "string"
          },
          "domicilioCalle": {
            "title": "Domicilio Calle",
            "type": "string"
          },
          "domicilioNumero": {
            "title": "Domicilio Nro.",
            "type": "string"
          },
          "domicilioPiso": {
            "title": "Domicilio Piso",
            "type": "string"
          },
          "domicilioDepartamento": {
            "title": "Domicilio Departamento",
            "type": "string"
          },
          "celular": {
            "title": "Celular",
            "type": "string"
          },
          "email": {
            "title": "Email",
            "type": "string"
          },
          "datosInstitucion": {
            "title": "Institución",
            "type": "string"
          },
          "institucion_provincia": {
            "title": "Provincia",
            "type": "string"
          },
          "institucion_departamento": {
            "title": "Departamento",
            "type": "string"
          },
          "institucion": {
            "title": "Institución",
            "type": "string"
          },
          "institucion_otra": {
            "title": "Otra institución",
            "type": "string"
          },
          "fallecimiento": {
            "type": "string",
            "enum": [
              "Sí",
              "No"
            ],
            "title": "Fallecido",
            "default": "No"
          },
        },
        "dependencies": {
          "fallecimiento": {
            "oneOf": [
              {
                "properties": {
                  "fallecimiento": {
                    "enum": [
                      "No"
                    ]
                  }
                }
              },
              {
                "properties": {
                  "fallecimiento": {
                    "enum": [
                      "Sí"
                    ]
                  },
                  "fechaFallecimiento": {
                    "type": "string",
                    "format": "date",
                    "title": "Fecha de fallecimiento"
                  },
                  "causaFallecimiento": {
                    "type": "string",
                    "title": "Causa fallecimiento",
                    "enum": [
                      "Respiratoria",
                      "Cardíaca",
                      "Gastrointestinal/hepática",
                      "Relacionadas al trasplante",
                      "Otras"
                    ]
                  }
                },
              }
            ]
          },
        },
      },
      "seccion2": {
        "title": "Ficha médica",
        "type": "object",
        "properties": {
          "fechaDiagnostico": {
            "type": "string",
            "title": "Fecha de diagnóstico",
            "format": "date"
          },
          "edadDiagnostico": {
            "type": "string",
            "title": "Edad al diagnóstico"
          },
          "pesquisaNeonatal": {
            "type": "string",
            "title": "Pesquisa neonatal",
            "enum": [
              "No realizada",
              "Realizada"
            ]
          },
          "sospechaDiagnostica": {
            "type": "array",
            "title": "Sospecha diagnóstica",
            "minItems": 1,
            "items": {
              "type": "string",
              "enum": [
                "Asintomático/a",
                "Pesquisa neonatal",
                "Antecedentes familiares",
                "Síntomas respiratorios",
                "Malnutrición / falla de crecimiento",
                "Diarrea crónica/malabsorción",
                "Ileo meconial",
                "Azoospermia",
                "Edemas",
                "Alcalosis metabólica/deshidratación",
                "Anemia/Hipoalbuminemia",
                "Hepatopatía",
                "Sudor salado"
              ]
            },
            "uniqueItems": true
          },
          "pruebaSudor": {
            "type": "string",
            "title": "Prueba del sudor"
          },
          "cloruro1": {
            "type": "number",
            "title": "Cloruro 1",
            "minimum": "0",
            "maximum": "160"
          },
          "cloruro2": {
            "type": "number",
            "title": "Cloruro 2",
            "minimum": "0",
            "maximum": "160"
          },
          "fechaCloruro": {
            "type": "string",
            "title": "Fecha del test",
            "format": "date"
          },
          "estudioGeneticoMolecular": {
            "type": "string",
            "title": "Estudio genético molecular",
            "enum": [
              "Pendiente",
              "Realizado"
            ],
            "default": "Pendiente"
          },
          "potencialNasal": {
            "type": "string",
            "title": "Potencial nasal",
            "enum": [
              "No realizado",
              "Realizado"
            ],
            "default": "No realizado"
          },
          "funcionalismoPancreatico": {
            "type": "string",
            "title": "Funcionalismo pancreático",
            "enum": [
              "Suficiente",
              "Insuficiente"
            ]
          }
        },
        "dependencies": {
          "pesquisaNeonatal": {
            "oneOf": [
              {
                "properties": {
                  "pesquisaNeonatal": {
                    "enum": [
                      "No realizada"
                    ]
                  }
                }
              },
              {
                "properties": {
                  "pesquisaNeonatal": {
                    "enum": [
                      "Realizada"
                    ]
                  },
                  "estrategia": {
                    "title": "Estrategia",
                    "type": "string",
                    "enum": [
                      "TIR/TIR",
                      "TIR/PAP",
                      "No Realizado"
                    ]
                  }
                },
              }
            ]
          },
          "estudioGeneticoMolecular": {
            "oneOf": [
              {
                "properties": {
                  "estudioGeneticoMolecular": {
                    "enum": [
                      "No realizado"
                    ]
                  }
                }
              },
              {
                "properties": {
                  "estudioGeneticoMolecular": {
                    "enum": [
                      "Realizado"
                    ]
                  },
                  "alelo1": {
                    "type": "string",
                    "title": "Alelo 1",
                    "enum": GetAlelos()
                  },
                  "alelo2": {
                    "type": "string",
                    "title": "Alelo 2",
                    "enum": GetAlelos()
                  }
                },
                "dependencies": {
                  "alelo1": {
                    "oneOf": [
                      {
                        "properties": {
                          "alelo1": {
                            "enum": GetAlelos().slice(0, GetAlelos().length-1)
                          }
                        }
                      },
                      {
                        "properties": {
                          "alelo1": {
                            "enum": ["Otra"]
                          },
                          "otroAlelo1": {
                            "type": "string",
                            "title": "Otro alelo 1"
                          }
                        }
                      }
                    ]
                  },
                  "alelo2": {
                    "oneOf": [
                      {
                        "properties": {
                          "alelo2": {
                            "enum": GetAlelos().slice(0, GetAlelos().length-1)
                          }
                        }
                      },
                      {
                        "properties": {
                          "alelo2": {
                            "enum": ["Otra"]
                          },
                          "otroAlelo2": {
                            "type": "string",
                            "title": "Otro alelo 2"
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ]
          },
          "potencialNasal": {
            "oneOf": [
              {
                "properties": {
                  "potencialNasal": {
                    "enum": [
                      "No realizado"
                    ]
                  }
                }
              },
              {
                "properties": {
                  "potencialNasal": {
                    "enum": [
                      "Realizado"
                    ]
                  },
                  "potencialNasalRealizado": {
                    "type": "string",
                    "title": "Potencial nasal realizado",
                    "enum": [
                      "Normal",
                      "Anormal"
                    ]
                  }
                },
              }
            ]
          }
        }
      }
    }
  };
}

export const GetSchemaUnder18 = () => {
  return {
    "title": "Formulario de alta de un nuevo paciente",
    "type": "object",
    "properties": {
      "seccion1": {
        "title": "Datos del paciente",
        "type": "object",
        "properties": {
          "datosPaciente": {
            "type": "string",
            "title": "Paciente"
          },
          "historiaClinica": {
            "type": "string",
            "title": "Historia Clínica"
          },
          "nombre": {
            "type": "string",
            "title": "Nombre"
          },
          "apellido": {
            "type": "string",
            "title": "Apellido"
          },
          "dni": {
            "type": "number",
            "title": "D.N.I.",
            "minLength": 8
          },
          "fechaNacimiento": {
            "type": "string",
            "title": "Fecha de nacimiento",
            "format": "date"
          },
          "datosResponsable": {
            "type": "string",
            "title": "Responsable"
          },
          "nombreResponsable": {
            "type": "string",
            "title": "Nombre del responsable"
          },
          "apellidoResponsable": {
            "type": "string",
            "title": "Apellido del responsable"
          },
          "edadResponsable": {
            "type": "string",
            "title": "Edad del responsable"
          },
          "dniResponsable": {
            "type": "number",
            "title": "DNI Responsable"
          },
          "vinculoResponsable": {
            "type": "string",
            "title": "Vinculo con el paciente"
          },
          "sexo": {
            "type": "string",
            "title": "Sexo",
          },
          "genero": {
            "type": "string",
            "title": "Género"
          },
          "nivelEducativo": {
            "type": "string",
            "title": "Nivel educativo",
          },
          "residencia": {
            "type": "string",
            "title": "Residencia"
          },
          "pais": {
            "title": "País",
            "type": "string"
          },
          "provincia": {
            "title": "Provincia",
            "type": "string",
          },
          "departamento": {
            "title": "Departamento",
            "type": "string"
          },
          "localidad": {
            "title": "Localidad",
            "type": "string"
          },
          "codigoPostal": {
            "title": "Código postal",
            "type": "string"
          },
          "domicilioCalle": {
            "title": "Domicilio Calle",
            "type": "string"
          },
          "domicilioNumero": {
            "title": "Domicilio Nro.",
            "type": "string"
          },
          "domicilioPiso": {
            "title": "Domicilio Piso",
            "type": "string"
          },
          "domicilioDepartamento": {
            "title": "Domicilio Departamento",
            "type": "string"
          },
          "celular": {
            "title": "Celular",
            "type": "string"
          },
          "email": {
            "title": "Email",
            "type": "string"
          },
          "datosInstitucion": {
            "title": "Institución",
            "type": "string"
          },
          "institucion_provincia": {
            "title": "Provincia",
            "type": "string"
          },
          "institucion_departamento": {
            "title": "Departamento",
            "type": "string"
          },
          "institucion": {
            "title": "Institución",
            "type": "string",
          },
          "institucion_otra": {
            "title": "Otra institución",
            "type": "string"
          },
          "fallecimiento": {
            "type": "string",
            "enum": [
              "Sí",
              "No"
            ],
            "title": "Fallecido",
            "default": "No"
          },
        },
        "dependencies": {
          "fallecimiento": {
            "oneOf": [
              {
                "properties": {
                  "fallecimiento": {
                    "enum": [
                      "No"
                    ]
                  }
                }
              },
              {
                "properties": {
                  "fallecimiento": {
                    "enum": [
                      "Sí"
                    ]
                  },
                  "fechaFallecimiento": {
                    "type": "string",
                    "format": "date",
                    "title": "Fecha de fallecimiento"
                  },
                  "causaFallecimiento": {
                    "type": "string",
                    "title": "Causa fallecimiento",
                    "enum": [
                      "Respiratoria",
                      "Cardíaca",
                      "Gastrointestinal/hepática",
                      "Relacionadas al trasplante",
                      "Otras"
                    ]
                  }
                },
              }
            ]
          },
        },
      },
      "seccion2": {
        "title": "Ficha médica",
        "type": "object",
        "properties": {
          "fechaDiagnostico": {
            "type": "string",
            "title": "Fecha de diagnóstico",
            "format": "date"
          },
          "edadDiagnostico": {
            "type": "string",
            "title": "Edad al diagnóstico"
          },
          "pesquisaNeonatal": {
            "type": "string",
            "title": "Pesquisa neonatal",
            "enum": [
              "No realizada",
              "Realizada"
            ]
          },
          "sospechaDiagnostica": {
            "type": "array",
            "title": "Sospecha diagnóstica",
            "minItems": 1,
            "items": {
              "type": "string",
              "enum": [
                "Asintomático/a",
                "Pesquisa neonatal",
                "Antecedentes familiares",
                "Síntomas respiratorios",
                "Malnutrición / falla de crecimiento",
                "Diarrea crónica/malabsorción",
                "Ileo meconial",
                "Azoospermia",
                "Edemas",
                "Alcalosis metabólica/deshidratación",
                "Anemia/Hipoalbuminemia",
                "Hepatopatía",
                "Sudor salado"
              ]
            },
            "uniqueItems": true
          },
          "pruebaSudor": {
            "type": "string",
            "title": "Prueba del sudor"
          },
          "cloruro1": {
            "type": "number",
            "title": "Cloruro 1",
            "minimum": "0",
            "maximum": "160"
          },
          "cloruro2": {
            "type": "number",
            "title": "Cloruro 2",
            "minimum": "0",
            "maximum": "160"
          },
          "fechaCloruro": {
            "type": "string",
            "title": "Fecha del test",
            "format": "date"
          },
          "estudioGeneticoMolecular": {
            "type": "string",
            "title": "Estudio genético molecular",
            "enum": [
              "Pendiente",
              "Realizado"
            ],
            "default": "Pendiente"
          },
          "potencialNasal": {
            "type": "string",
            "title": "Potencial nasal",
            "enum": [
              "No realizado",
              "Realizado"
            ],
            "default": "No realizado"
          },
          "funcionalismoPancreatico": {
            "type": "string",
            "title": "Funcionalismo pancreático",
            "enum": [
              "Suficiente",
              "Insuficiente"
            ]
          }
        },
        "dependencies": {
          "pesquisaNeonatal": {
            "oneOf": [
              {
                "properties": {
                  "pesquisaNeonatal": {
                    "enum": [
                      "No realizada"
                    ]
                  }
                }
              },
              {
                "properties": {
                  "pesquisaNeonatal": {
                    "enum": [
                      "Realizada"
                    ]
                  },
                  "estrategia": {
                    "title": "Estrategia",
                    "type": "string",
                    "enum": [
                      "TIR/TIR",
                      "TIR/PAP",
                      "No Realizado"
                    ]
                  }
                },
              }
            ]
          },
          "estudioGeneticoMolecular": {
            "oneOf": [
              {
                "properties": {
                  "estudioGeneticoMolecular": {
                    "enum": [
                      "No realizado"
                    ]
                  }
                }
              },
              {
                "properties": {
                  "estudioGeneticoMolecular": {
                    "enum": [
                      "Realizado"
                    ]
                  },
                  "alelo1": {
                    "type": "string",
                    "title": "Alelo 1",
                    "enum": GetAlelos()
                  },
                  "alelo2": {
                    "type": "string",
                    "title": "Alelo 2",
                    "enum": GetAlelos()
                  }
                },
                "dependencies": {
                  "alelo1": {
                    "oneOf": [
                      {
                        "properties": {
                          "alelo1": {
                            "enum": GetAlelos().slice(0, GetAlelos().length-1)
                          }
                        }
                      },
                      {
                        "properties": {
                          "alelo1": {
                            "enum": ["Otra"]
                          },
                          "otroAlelo1": {
                            "type": "string",
                            "title": "Otro alelo 1"
                          }
                        }
                      }
                    ]
                  },
                  "alelo2": {
                    "oneOf": [
                      {
                        "properties": {
                          "alelo2": {
                            "enum": GetAlelos().slice(0, GetAlelos().length-1)
                          }
                        }
                      },
                      {
                        "properties": {
                          "alelo2": {
                            "enum": ["Otra"]
                          },
                          "otroAlelo2": {
                            "type": "string",
                            "title": "Otro alelo 2"
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ]
          },
          "potencialNasal": {
            "oneOf": [
              {
                "properties": {
                  "potencialNasal": {
                    "enum": [
                      "No realizado"
                    ]
                  }
                }
              },
              {
                "properties": {
                  "potencialNasal": {
                    "enum": [
                      "Realizado"
                    ]
                  },
                  "potencialNasalRealizado": {
                    "type": "string",
                    "title": "Potencial nasal realizado",
                    "enum": [
                      "Normal",
                      "Anormal"
                    ]
                  }
                },
              }
            ]
          }
        }
      }
    }
  };
}


export const GetUISchema = () => {
  let uiSchema = {
      seccion1: {
        "ui:ObjectFieldTemplate": ObjectFieldTemplate,
        MostrarTitulo: true,
        Icono: faUser,
        "ui:order": [
          "datosPaciente",
          "historiaClinica",
          "nombre",
          "apellido",
          "dni",
          "fechaNacimiento",
          "sexo",
          "genero",
          "nivelEducativo",
          "celular",
          "email",
          
          "datosInstitucion",
          "institucion_provincia",
          "institucion_departamento",
          "institucion",
          "institucion_otra",

          "fallecimiento",
          "fechaFallecimiento",
          "causaFallecimiento",

          "residencia",
          "pais",
          "provincia",
          "departamento",
          "localidad",
          "codigoPostal",
          "domicilioCalle",
          "domicilioNumero",
          "domicilioPiso",
          "domicilioDepartamento",
        ],
        datosPaciente: {
          "ui:FieldTemplate": CustomFieldTemplate,
          "ui:widget": "hidden",
          clases: "col-md-12 font-weight-bold",
        },
        historiaClinica: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          // "ui:disabled": true,
          clases: "col-md-3",
          // clasesWidget: "col-md-4 col-lg-3" //definir asi si se necesitan mas clases
        },
        nombre: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          // "ui:disabled": true,
          clases: "col-md-3",
          // clasesWidget: "col-md-4 col-lg-3" //definir asi si se necesitan mas clases
        },
        apellido: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        dni: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        fechaNacimiento: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        sexo: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        genero: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        nivelEducativo: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        residencia: {
          "ui:FieldTemplate": CustomFieldTemplate,
          "ui:widget": "hidden",
          clases: "col-md-12 font-weight-bold",
        },
        pais: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        provincia: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        departamento: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        localidad: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        codigoPostal: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        domicilioCalle: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        domicilioNumero: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        domicilioPiso: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        domicilioDepartamento: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        celular: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        email: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },

        datosInstitucion: {
          "ui:FieldTemplate": CustomFieldTemplate,
          "ui:widget": "hidden",
          clases: "col-md-12 font-weight-bold",
        },
        institucion_provincia: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        institucion_departamento: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        institucion: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        fallecimiento: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        fechaFallecimiento: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3",
        },
        causaFallecimiento: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-3"
        }
      },
      seccion2: {
        "ui:ObjectFieldTemplate": ObjectFieldTemplate,
        "ui:order": [
          "fechaDiagnostico",
          "edadDiagnostico",
          "pesquisaNeonatal",
          "estrategia",
          "sospechaDiagnostica",
          "pruebaSudor",
          "cloruro1",
          "cloruro2",
          "fechaCloruro",
          "potencialNasal",
          "potencialNasalRealizado",
          "estudioGeneticoMolecular",
          "alelo1",
          "otroAlelo1",
          "alelo2",
          "otroAlelo2",
          "funcionalismoPancreatico",
        ],
        MostrarTitulo: true,
        Icono: faAddressCard,
        // className: "custom-class-name",
        fechaDiagnostico: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          // clasesWidget: "col-md-4 col-lg-3" //definir asi si se necesitan mas clases
        },
        edadDiagnostico: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
        },
        pesquisaNeonatal: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          // clases: "col-md-6"
        },
        sospechaDiagnostica: {
          // "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          clases: "col-md-12",
          "ui:widget": "customCheckboxesWidget",
          "ui:disabled": true,
          "ui:readOnly": true,
        },
        estrategia: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
        },
        pruebaSudor: {
          "ui:FieldTemplate": CustomFieldTemplate,
          "ui:widget": "hidden",
          clases: "col-md-12 font-weight-bold",
        },
        cloruro1: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          // clases: "col-md-6",
        },
        cloruro2: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          // clases: "col-md-3",
        },
        fechaCloruro: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          // clases: "col-md-3",
        },
        estudioGeneticoMolecular: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
        },
        potencialNasal: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
        },
        funcionalismoPancreatico: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
        },

        alelo1: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
        },
        otroAlelo1: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
        },
        alelo2: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
        },
        otroAlelo2: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
        },
        potencialNasalRealizado: {
          "ui:widget": "textWidget",
          "ui:FieldTemplate": CustomFieldTemplate,
          // "ui:widget": "radio",
        },
      },
    };

  return uiSchema;
}

export const GetUISchemaUnder18 = () => {
    let uiSchema = {
        seccion1: {
          "ui:ObjectFieldTemplate": ObjectFieldTemplate,
          MostrarTitulo: true,
          Icono: faUser,
          "ui:order": [
            "datosPaciente",
            "historiaClinica",
            "nombre",
            "apellido",
            "dni",
            "fechaNacimiento",
            "sexo",
            "genero",
            "nivelEducativo",
            "celular",
            "email",

            "datosInstitucion",
            "institucion_provincia",
            "institucion_departamento",
            "institucion",
            "institucion_otra",

            "fallecimiento",
            "fechaFallecimiento",
            "causaFallecimiento",

            "datosResponsable",
            "nombreResponsable",
            "apellidoResponsable",
            "edadResponsable",
            "dniResponsable",
            "vinculoResponsable",

            "residencia",
            "pais",
            "provincia",
            "departamento",
            "localidad",
            "codigoPostal",
            "domicilioCalle",
            "domicilioNumero",
            "domicilioPiso",
            "domicilioDepartamento",
          ],
          datosPaciente: {
            "ui:FieldTemplate": CustomFieldTemplate,
            "ui:widget": "hidden",
            clases: "col-md-12 font-weight-bold",
          },
          historiaClinica: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            // "ui:disabled": true,
            clases: "col-md-3",
            // clasesWidget: "col-md-4 col-lg-3" //definir asi si se necesitan mas clases
          },
          nombre: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            // "ui:disabled": true,
            clases: "col-md-3",
            // clasesWidget: "col-md-4 col-lg-3" //definir asi si se necesitan mas clases
          },
          apellido: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          dni: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          fechaNacimiento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          datosResponsable: {
            "ui:FieldTemplate": CustomFieldTemplate,
            "ui:widget": "hidden",
            clases: "col-md-12 font-weight-bold",
          },
          nombreResponsable: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          apellidoResponsable: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          edadResponsable: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          dniResponsable: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          vinculoResponsable: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          sexo: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          genero: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          nivelEducativo: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          residencia: {
            "ui:FieldTemplate": CustomFieldTemplate,
            "ui:widget": "hidden",
            clases: "col-md-12 font-weight-bold",
          },
          pais: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          provincia: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          departamento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          localidad: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          codigoPostal: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          domicilioCalle: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          domicilioNumero: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          domicilioPiso: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          domicilioDepartamento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          celular: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          email: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },

          datosInstitucion: {
            "ui:FieldTemplate": CustomFieldTemplate,
            "ui:widget": "hidden",
            clases: "col-md-12 font-weight-bold",
          },
          institucion_provincia: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          institucion_departamento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          institucion: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          fallecimiento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          fechaFallecimiento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          },
          causaFallecimiento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-3",
          }
        },
        seccion2: {
          "ui:ObjectFieldTemplate": ObjectFieldTemplate,
          "ui:order": [
            "fechaDiagnostico",
            "edadDiagnostico",
            "pesquisaNeonatal",
            "estrategia",
            "sospechaDiagnostica",
            "pruebaSudor",
            "cloruro1",
            "cloruro2",
            "fechaCloruro",
            "potencialNasal",
            "potencialNasalRealizado",
            "estudioGeneticoMolecular",
            "alelo1",
            "otroAlelo1",
            "alelo2",
            "otroAlelo2",
            "funcionalismoPancreatico",
          ],
          MostrarTitulo: true,
          Icono: faAddressCard,
          // className: "custom-class-name",
          fechaDiagnostico: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            // clasesWidget: "col-md-4 col-lg-3" //definir asi si se necesitan mas clases
          },
          edadDiagnostico: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          pesquisaNeonatal: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            // clases: "col-md-6"
          },
          sospechaDiagnostica: {
            // "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-12",
            "ui:widget": "customCheckboxesWidget",
            "ui:disabled": true,
            "ui:readOnly": true,
          },
          estrategia: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          pruebaSudor: {
            "ui:FieldTemplate": CustomFieldTemplate,
            "ui:widget": "hidden",
            clases: "col-md-12 font-weight-bold",
          },
          cloruro1: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            // clases: "col-md-6",
          },
          cloruro2: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            // clases: "col-md-3",
          },
          fechaCloruro: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            // clases: "col-md-3",
          },
          estudioGeneticoMolecular: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          potencialNasal: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          funcionalismoPancreatico: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          alelo1: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          otroAlelo1: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          alelo2: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          otroAlelo2: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          potencialNasalRealizado: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            // "ui:widget": "radio",
          },
        },
      };

    return uiSchema;
}