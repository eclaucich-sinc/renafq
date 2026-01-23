/*
  Schemas utilizados en la pantalla de detalles de un paciente. Solo la parte inferior, referida a los seguimientos del paciente.
  Todos campos de solo lectura.
*/

import { ObjectFieldTemplate, CustomFieldTemplate, CustomObjectFieldTemplate } from "../../utils/customFormFunctions";
import { faAddressCard, faAddressBook, faAd, faUser, faPlusCircle, faMedkit } from "@fortawesome/free-solid-svg-icons";
import { GetInstituciones, GetNivelesEducativo, GetProvincias } from "../../utils/listsForSchemas"

export const GetSchema = () => {
    return {
        "title": "Datos de seguimiento anual",
        "type": "object",
        "properties": {
          "seccion1": {
            "type": "object",
            "title": "Datos básicos del paciente",
            "ui:order":["*"],
            "properties": {
              "fechaSeguimiento": {
                "type": "string",
                "format": "date",
                "title": "Fecha de seguimiento"
              },
              "edadSeguimiento": {
                "type": "number",
                "title": "Edad al seguimiento"
              },
              "datosInstitucion": {
                "type": "string",
                "title": "Institución"
              },
              "institucion_provincia": {
                "type": "string",
                "title": "Provincia",
              },
              "institucion_departamento": {
                "type": "string",
                "title": "Departamento",
              },
              "institucion": {
                "type": "string",
                "title": "Institución",
              },
              "institucion_cp":{
                "type": "number",
                "title": "Código postal"
              },
              "institucion_otra":{
                "type": "string",
                "title": "Otra institución"
              },
              "nivelEducativo": {
                "type": "string",
                "title": "Nivel educativo del paciente",
                "enum": GetNivelesEducativo()
              },
              "actividadLaboral": {
                "type": "string",
                "title": "Actividad laboral",
                "enum": [
                  "Trabaja",
                  "No trabaja",
                  "No corresponde por edad"
                ]
              },
              "cud": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "CUD"
              },
              "coberturaSocial": {
                "type": "string",
                "enum": [
                  "Cobertura Pública Exclusiva",
                  "INCLUIR SALUD",
                  "Otra"
                ],
                "title": "Cobertura de salud"
              },
              "tratamientoAntibioticoHospitalizado": {
                "type": "number",
                "title": "N° tratamiento antibiótico intravenoso HOSPITALIZADO en el año"
              },
              "tratamientoAntibioticoHospitalizadoDias": {
                "type": "number",
                "title": "N° de DÍAS totales en el año con tratamiento antibiótico intravenoso HOSPITALIZADO"
              },
              "tratamientoAntibioticoDomiciliario": {
                "type": "number",
                "title": "N° tratamiento antibiótico intravenoso DOMICILIARIO en el año"
              },
              "tratamientoAntibioticoDomiciliarioDias": {
                "type": "number",
                "title": "N° de DÍAS totales en el año con tratamiento antibiótico intravenoso DOMICILIARIO"
              },
              "consultasAmbulatorias": {
                "type": "number",
                "title": "N° consultas ambulatorias /año"
              },
                "embarazo": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Embarazo"
              }
            },
            "dependencies": {
              "coberturaSocial": {
                "oneOf": [
                  {
                    "properties": {
                      "coberturaSocial": {
                        "enum": [
                          "Cobertura Pública Exclusiva",
                          "INCLUIR SALUD"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "coberturaSocial": {
                        "enum": [
                          "Otra"
                        ]
                      },
                      "otraCoberturaSocial": {
                        "type": "string",
                        "title": "Otra cobertura"
                      }
                    }
                  }
                ]
              },
              "cud": {
                "oneOf": [
                  {
                    "properties": {
                      "cud": {
                        "enum": [
                          "No"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "cud": {
                        "enum": [
                          "Sí"
                        ]
                      },
                      "pensionDiscapacidad": {
                        "type": "string",
                        "enum": [
                          "Sí",
                          "No"
                        ],
                        "title": "Pensión por discapacidad"
                      }
                    },
                  }
                ]
              }
            }
          },
          "seccion2": {
            "type": "object",
            "title": "Antropometría",
            "properties": {
              "peso": {
                "type": "number",
                "title": "Peso[Kg]"
              },
              "talla": {
                "type": "number",
                "title": "Talla[cm]"
              },
              "imc": {
                "type": "number",
                "title": "Índice de Masa Corporal absoluto"
              },
              "percentiloPeso": {
                "type": "number",
                "title": "Percentilo Peso"
              },
              "zPeso": {
                "type": "number",
                "title": "z Peso"
              },
              "percentiloTalla": {
                "type": "number",
                "title": "Percentilo talla"
              },
              "zTalla": {
                "type": "number",
                "title": "z Talla"
              },
              "percentiloImc": {
                "type": "number",
                "title": "Percentilo IMC"
              },
              "zImc": {
                "type": "number",
                "title": "z IMC"
              }
            }
          },
          "seccion3": {
            "type": "object",
            "title": "Espirometrías",
            "properties": {
              "espirometrias": {
                "type": "number",
                "title": "Espirometrías por año"
              },
              "cvf": {
                "type": "number",
                "title": "CVF (% teórico)"
              },
              "vef": {
                "type": "number",
                "title": "VEF__1__ (% teórico)"
              },
              "vef_cvf": {
                "type": "number",
                "title": "VEF__1__/CVF (absoluto)"
              },
              "cvfLitros": {
                "type": "number",
                "title": "CVF (litros) "
              },
              "vefLitros": {
                "type": "number",
                "title": "VEF__1__ (litros)"
              }
            }
          },
          "seccion4": {
            "type": "object",
            "title": "Microbiología",
            "properties": {
              "cultivos": {
                "type": "number",
                "title": "N° de cultivos/año"
              },
              "germenes": {
                "type": "string",
                "title": "Gérmenes",
                "enum": [
                  "Staphylococcus aureus meticilino sensible",
                  "Staphylococcus aureus meticilino resistente",
                  "Pseudomonas aeruginosa",
                  "Pseudomonas aeruginosa mucosa",
                  "Pseudomonas aeruginosa multirresistente",
                  "Haemophilus influenzae",
                  "Stenotrophomonas maltophilia",
                  "Achromobacter xyloxoxidans ",
                  "Burkholderia cenocepacia",
                  "Burkholderia contaminans",
                  "Otras BC",
                  "Micobacterium  abscessus",
                  "Micobacterium avium",
                  "Micobacterium tuberculosis",
                  "Aspergillus fumigatus",
                  "Aspergillus terreus",
                  "Scedosporium",
                  "Flora habitual"
                ]
              },
              "otrosGermenes": {
                "type": "string",
                "title": "Otros gérmenes"
              }
            }
          },
          "seccion5": {
            "type": "object",
            "title": "Estudios complementarios",
            "properties": {
              "toleranciaGlucosa": {
                "type": "string",
                "title": "Curva de tolerancia a la glucosa",
                "enum": [
                  "No realizada",
                  "Realizada"
                ]
              },
              "vitaminaD": {
                "type": "string",
                "title": "Vitamina D",
                "enum": [
                  "No realizada",
                  "Realizada"
                ]
              },
              "densitometria": {
                "type": "string",
                "title": "Densitometría",
                "enum": [
                  "No realizada",
                  "Realizada"
                ]
              },
              "inmunoglobulina": {
                "type": "string",
                "title": "Inmunoglobulina E total",
                "enum": [
                  "No realizada",
                  "Realizada"
                ]
              },
              "tacTorax": {
                "type": "string",
                "title": "TAC de tórax",
                "enum": [
                  "No realizada",
                  "Realizada"
                ]
              },
              "complicaciones": {
                "type": "array",
                "title": "Complicaciones o asociaciones",
                "items": {
                  "type": "string",
                  "enum": [
                    "Hemoptisis",
                    "Hemoptisis Masiva (más de 200 mL)",
                    "Atelectasia lobar",
                    "Neumotórax",
                    "Hipoxemia crónica ",
                    "Hipertensión Pulmonar",
                    "Aspergilosis ABPA Bronquitis Invasiva",
                    "Pólipos que requirieron cirugía",
                    "SOID",
                    "Constipación",
                    "Prolapso rectal",
                    "Pancreatitis",
                    "Diabetes",
                    "Hepatopatía",
                    "HTPortal",
                    "Litiasis Biliar",
                    "Osteoporosis",
                    "Fracturas",
                    "Depresión",
                    "Ototoxicidad",
                    "Nefrotoxicidad",
                    "Rinosinusitis crónica",
                    "Traqueostomía"
                  ]
                },
                "uniqueItems": true
              }
            },
            "dependencies": {
              "toleranciaGlucosa": {
                "oneOf": [
                  {
                    "properties": {
                      "toleranciaGlucosa": {
                        "enum": [
                          "No realizada"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "toleranciaGlucosa": {
                        "enum": [
                          "Realizada"
                        ]
                      },
                      "toleranciaGlucosaRealizada": {
                        "type": "string",
                        "title": "Curva de tolerancia a la glucosa realizada",
                        "enum": [
                          "Normal",
                          "Intolerancia",
                          "Diabetes"
                        ]
                      }
                    },
                  }
                ]
              },
              "vitaminaD": {
                "oneOf": [
                  {
                    "properties": {
                      "vitaminaD": {
                        "enum": [
                          "No realizada"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "vitaminaD": {
                        "enum": [
                          "Realizada"
                        ]
                      },
                      "vitaminaDRealizada": {
                        "type": "string",
                        "title": "Vitamina D realizada",
                        "enum": [
                          "Normal",
                          "Insuficiente"
                        ]
                      }
                    },
                  }
                ]
              },
              "densitometria": {
                "oneOf": [
                  {
                    "properties": {
                      "densitometria": {
                        "enum": [
                          "No realizada"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "densitometria": {
                        "enum": [
                          "Realizada"
                        ]
                      },
                      "densitometriaRealizada": {
                        "type": "string",
                        "title": "Densitometría realizada",
                        "enum": [
                          "Normal",
                          "Patológica"
                        ]
                      }
                    },
                  }
                ]
              },
              "inmunoglobulina": {
                "oneOf": [
                  {
                    "properties": {
                      "inmunoglobulina": {
                        "enum": [
                          "No realizada"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "inmunoglobulina": {
                        "enum": [
                          "Realizada"
                        ]
                      },
                      "inmunoglobulinaRealizada": {
                        "type": "string",
                        "title": "Inmunoglobulina E total realizada",
                        "enum": [
                          "< 500 U",
                          "> 500 U "
                        ]
                      }
                    },
                  }
                ]
              },
              "tacTorax": {
                "oneOf": [
                  {
                    "properties": {
                      "tacTorax": {
                        "enum": [
                          "No realizada"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "tacTorax": {
                        "enum": [
                          "Realizada"
                        ]
                      },
                      "tacToraxRealizada": {
                        "type": "string",
                        "title": "TAC de tórax realizada",
                        "enum": [
                          "Normal",
                          "Bronquiectasia",
                          "Atrapamiento aéreo",
                          "Atrapamiento aéreo y bronquiectasias",
                          "Patológica"
                        ]
                      },
                      "scoreBhalla": {
                        "type": "number",
                        "title": "Score de Bhalla"
                      }
                    },
                  }
                ]
              }
            }
          },
          "seccion6": {
            "type": "object",
            "title": "Tratamientos",
            "properties": {
              "alimentacion": {
                "type": "array",
                "title": "Alimentación",
                "items": {
                  "type": "string",
                  "enum": [
                    "Oral",
                    "Enteral por gastrostomía",
                    "Enteral por SNG"
                  ]
                },
                "uniqueItems": true
              },
              "vitaminas": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Vitaminas"
              },
              "suplementacionVitaminaD": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Suplementación de Vitamina D"
              },
              "suplementoNutricional": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Suplemento nutricional"
              },
              "acidoUrsodesoxicolico": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Ácido Ursodesoxicólico"
              },
              "antiacidos": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Antiácidos"
              },
              "insulina": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Insulina"
              },
              "broncodilatadores": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Broncodilatadores"
              },
              "dnasa": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "DNasa"
              },
              "solucionSalinaHipertonica": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Solución Salina Hipertónica"
              },
              "antibioticosInhalados": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Antibióticos inhalados"
              },
              "corticoides": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Corticoides"
              },
              "azitromicinaOral": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Azitromicina oral"
              },
              "terapiaRespiratoria": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Terapia respiratoria"
              },
              "actividadDeportiva": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Actividad deportiva"
              },
              "oxigenoterapiaDomiciliaria": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Oxigenoterapia domiciliaria"
              },
              "asistenciaRespiratoria": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Asistencia respiratoria"
              },
              "moduladores": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Moduladores"
              },
              "enzimas": {
                "type": "string",
                "enum": [
                  "Sí",
                  "No"
                ],
                "title": "Enzimas"
              },
              "trasplante": {
                "type": "string",
                "title": "Trasplante",
                "enum": [
                  "No",
                  "Lista de espera",
                  "Sí"
                ]
              },
              "observacionesClinicas": {
                "type": "string",
                "title": "Observaciones (novedades clínicas)",
              }
            },
            "dependencies": {
              "antibioticosInhalados": {
                "oneOf": [
                  {
                    "properties": {
                      "antibioticosInhalados": {
                        "enum": [
                          "No"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "antibioticosInhalados": {
                        "enum": [
                          "Sí"
                        ]
                      },
                      "antibioticosInhaladosRealizada": {
                        "type": "array",
                        "title": "Antibióticos inhalados realizada",
                        "minItems": 1,
                        "items": {
                          "type": "string",
                          "enum": [
                            "Colistina",
                            "Tobramicina",
                            "Aztreonan",
                            "Vancomicina",
                            "Otros"
                          ]
                        },
                        "uniqueItems": true
                      }
                    }
                  }
                ]
              },
              "corticoides": {
                "oneOf": [
                  {
                    "properties": {
                      "corticoides": {
                        "enum": [
                          "No"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "corticoides": {
                        "enum": [
                          "Sí"
                        ]
                      },
                      "corticoidesRealizada": {
                        "type": "array",
                        "title": "Corticoides realizada",
                        "minItems": 1,
                        "items": {
                          "type": "string",
                          "enum": [
                            "Orales",
                            "Inhalados"
                          ]
                        },
                        "uniqueItems": true
                      }
                    }
                  }
                ]
              },
              "terapiaRespiratoria": {
                "oneOf": [
                  {
                    "properties": {
                      "terapiaRespiratoria": {
                        "enum": [
                          "No"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "terapiaRespiratoria": {
                        "enum": [
                          "Sí"
                        ]
                      },
                      "terapiaRespiratoriaRealizada": {
                        "type": "array",
                        "title": "Terapia respiratoria realizada",
                        "minItems": 1,
                        "items": {
                          "type": "string",
                          "enum": [
                            "Convencional",
                            "Ciclo activo",
                            "Drenaje autogénico",
                            "Dispositivo mecánicos",
                            "Chaleco",
                            "VNI"
                          ]
                        },
                        "uniqueItems": true
                      }
                    }
                  }
                ]
              },
              "asistenciaRespiratoria": {
                "oneOf": [
                  {
                    "properties": {
                      "asistenciaRespiratoria": {
                        "enum": [
                          "No"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "asistenciaRespiratoria": {
                        "enum": [
                          "Sí"
                        ]
                      },
                      "asistenciaRespiratoriaRealizada": {
                        "type": "string",
                        "title": "Asistencia respiratoria realizada",
                        "enum": [
                          "VMI",
                          "VNI"
                        ]
                      }
                    },
                  }
                ]
              },
              "moduladores": {
                "oneOf": [
                  {
                    "properties": {
                      "moduladores": {
                        "enum": [
                          "No"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "moduladores": {
                        "enum": [
                          "Sí"
                        ]
                      },
                      "moduladoresRealizada": {
                        "type": "string",
                        "title": "Moduladores para prescribir",
                        "enum": [
                          "Tezacaftor - Ivacaftor + Ivacaftor (100 - 150 + 150 mg)",
                          "Ivacaftor 150 Mg Comprimidos",
                          "Ivacaftor 125 Mg + Lumacaftor 100 Mg",
                          "Ivacaftor 125 Mg + Lumacaftor 200 Mg",
                          "ELEXACAFTOR 100 mg - TEZACAFTOR 50 mg - IVACAFTOR 75 mg + IVACAFTOR 150 mg",
                          "ELEXACAFTOR 50 TEZACAFTOR 25 IVACAFTOR 37.7 + 65 mg"
                        ]
                      },
                      "otrosModuladores": {
                        "type": "string",
                        "title": "Otros moduladores"
                      }
                    },
                    "dependencies": {
                      "moduladoresRealizada": {
                        "oneOf": [
                          {
                            "properties": {
                              "moduladoresRealizada": {
                                "enum": [
                                  "Tezacaftor - Ivacaftor + Ivacaftor (100 - 150 + 150 mg)",
                                  "Ivacaftor 150 Mg Comprimidos",
                                  "Ivacaftor 125 Mg + Lumacaftor 100 Mg",
                                  "Ivacaftor 125 Mg + Lumacaftor 200 Mg",
                                  "ELEXACAFTOR 100 mg - TEZACAFTOR 50 mg - IVACAFTOR 75 mg + IVACAFTOR 150 mg",
                                  "ELEXACAFTOR 50 TEZACAFTOR 25 IVACAFTOR 37.7 + 65 mg"
                                ]
                              },
                              "prescribirModulador": {
                                "type": "string",
                                "title": "Prescribir modulador",
                                "enum": ["Si", "No"],
                                "default": "Si"
                              }
                            },
                            "dependencies":{
                              "prescribirModulador": {
                                "oneOf": [
                                  {
                                    "properties": {
                                      "prescribirModulador":{
                                        "enum": ["Si"]
                                      },
                                      "seccion7":{
                                          "type": "object",
                                          "title": "Prescripción modulador",
                                          "properties": {
                                            "institucionRecepcion": {
                                              "type": "string",
                                              "title": "Institución responsable de recepción"
                                            },
                                            "institucion_provincia": {
                                              "type": "string",
                                              "title": "Provincia",
                                            },
                                            "institucion_departamento": {
                                              "type": "string",
                                              "title": "Departamento",
                                            },
                                            "institucion": {
                                              "type": "string",
                                              "title": "Institución",
                                            },
                                            "institucion_cp": {
                                              "type": "string",
                                              "title": "Código postal",
                                            },
                                            "institucion_otra": {
                                              "type": "string",
                                              "title": "Otra institución"
                                            },
                                            
                                            "medicoResponsable": {
                                              "type": "string",
                                              "title": "Médico responsable"
                                            },
                                            "nombreMedicoResponsable": {
                                              "type": "string",
                                              "title": "Nombre"
                                            },
                                            "apellidoMedicoResponsable": {
                                              "type": "string",
                                              "title": "Apellido"
                                            },
                                            "matriculaMedicoResponsable": {
                                              "type": "string",
                                              "title": "Matrícula"
                                            },
                                            "mailMedicoResponsable": {
                                              "type": "string",
                                              "title": "Mail"
                                            },
                                            "institucion_medicoResponsable_provincia": {
                                              "type": "string",
                                              "title": "Provincia"
                                            },
                                            "institucion_medicoResponsable_departamento": {
                                              "type": "string",
                                              "title": "Departamento"
                                            },
                                            "institucion_medicoResponsable": {
                                              "type": "string",
                                              "title": "Institución"
                                            },
                                            
                                            "responsablesRecepcion": {
                                              "type": "string",
                                              "title": "Responsable en la farmacia de la recepción del medicamento"
                                            },
                                            "nombreResponsableFarmacia": {
                                              "type": "string",
                                              "title": "Nombre"
                                            },
                                            "apellidoResponsableFarmacia": {
                                              "type": "string",
                                              "title": "Apellido"
                                            },
                                            "emailResponsableFarmacia": {
                                              "type": "string",
                                              "title": "Email"
                                            },
                                            "glnResponsableFarmacia": {
                                              "type": "string",
                                              "title": "GLN farmacia"
                                            },
                                      }
                                      },
                                    }
                                  }
                                ]
                              },
                            },
                          },
                        ],
                      },
                    },
                  }
                ]
              },
              "enzimas": {
                "oneOf": [
                  {
                    "properties": {
                      "enzimas": {
                        "enum": [
                          "No"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "enzimas": {
                        "enum": [
                          "Sí"
                        ]
                      },
                      "enzimasRealizada": {
                        "type": "string",
                        "title": "Ezimas para prescribir",
                        "enum": [
                          "Cápsulas 300 mg de pancreatina (25.000 UI de lipasa, a 18.000 UI de amilasa y 1.000 UI de proteasa)",
                          "Cápsulas 150 mg de pancreatina (10.000 U de lipasa, a 8.000 U de amilasa y 600 U de proteasa)",
                        ]
                      },
                      "otrasEnzimas": {
                        "type": "string",
                        "title": "Otras enzimas"
                      }
                    },
                    "dependencies": {
                      "enzimasRealizada": {
                        "oneOf": [
                          {
                            "properties": {
                              "enzimasRealizada": {
                                "enum": [
                                  "Cápsulas 300 mg de pancreatina (25.000 UI de lipasa, a 18.000 UI de amilasa y 1.000 UI de proteasa)",
                                  "Cápsulas 150 mg de pancreatina (10.000 U de lipasa, a 8.000 U de amilasa y 600 U de proteasa)",
                                ]
                              },
                              "prescribirEnzimas": {
                                "type": "string",
                                "title": "Prescribir enzimas",
                                "enum": ["Si", "No"],
                                "default": "Si"
                              }
                            },
                            "dependencies":{
                              "prescribirEnzimas": {
                                "oneOf": [
                                  {
                                    "properties": {
                                      "prescribirEnzimas":{
                                        "enum": ["Si"]
                                      },
                                      "seccion8":{
                                          "type": "object",
                                          "title": "Prescripción ezimas",
                                          "properties": {
                                            "institucionRecepcion": {
                                              "type": "string",
                                              "title": "Institución responsable de recepción"
                                            },
                                            "institucion_provincia": {
                                              "type": "string",
                                              "title": "Provincia",
                                            },
                                            "institucion_departamento": {
                                              "type": "string",
                                              "title": "Departamento",
                                            },
                                            "institucion": {
                                              "type": "string",
                                              "title": "Institución",
                                            },
                                            "institucion_cp": {
                                              "type": "string",
                                              "title": "Código postal",
                                            },
                                            "institucion_otra": {
                                              "type": "string",
                                              "title": "Otra institución"
                                            },
                                            
                                            "medicoResponsable": {
                                              "type": "string",
                                              "title": "Médico responsable"
                                            },
                                            "nombreMedicoResponsable": {
                                              "type": "string",
                                              "title": "Nombre"
                                            },
                                            "apellidoMedicoResponsable": {
                                              "type": "string",
                                              "title": "Apellido"
                                            },
                                            "matriculaMedicoResponsable": {
                                              "type": "string",
                                              "title": "Matrícula"
                                            },
                                            "mailMedicoResponsable": {
                                              "type": "string",
                                              "title": "Mail"
                                            },
                                            "institucion_medicoResponsable_provincia": {
                                              "type": "string",
                                              "title": "Provincia"
                                            },
                                            "institucion_medicoResponsable_departamento": {
                                              "type": "string",
                                              "title": "Departamento"
                                            },
                                            "institucion_medicoResponsable": {
                                              "type": "string",
                                              "title": "Institución"
                                            },
                                            
                                            "responsablesRecepcion": {
                                              "type": "string",
                                              "title": "Responsable en la farmacia de la recepción del medicamento"
                                            },
                                            "nombreResponsableFarmacia": {
                                              "type": "string",
                                              "title": "Nombre"
                                            },
                                            "apellidoResponsableFarmacia": {
                                              "type": "string",
                                              "title": "Apellido"
                                            },
                                            "emailResponsableFarmacia": {
                                              "type": "string",
                                              "title": "Email"
                                            },
                                            "glnResponsableFarmacia": {
                                              "type": "string",
                                              "title": "GLN farmacia"
                                            },
                                      }
                                      },
                                    }
                                  }
                                ]
                              },
                            },
                          },
                        ],
                      },
                    },
                  }
                ]
              },
              "trasplante": {
                "oneOf": [
                  {
                    "properties": {
                      "trasplante": {
                        "enum": [
                          "No",
                          "Lista de espera"
                        ]
                      }
                    }
                  },
                  {
                    "properties": {
                      "trasplante": {
                        "enum": [
                          "Sí"
                        ]
                      },
                      "trasplanteRealizada": {
                        "type": "string",
                        "title": "Trasplante realizado",
                        "enum": [
                          "pulmonar",
                          "hepático",
                          "pancreático",
                          "pulmonar/hepático"
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

export const GetBaseSchema = () => {
    return {
        seccion1: {
          "ui:ObjectFieldTemplate": ObjectFieldTemplate,
          MostrarTitulo: true,
          Icono: faAddressCard,
          auxID: "seguimiento",
          "ui:order": [
            "fechaSeguimiento",
            "edadSeguimiento",
            "nivelEducativo",
            "actividadLaboral",
            
            "cud",
            "pensionDiscapacidad",

            "coberturaSocial",
            "otraCoberturaSocial",
            "embarazo",

            "tratamientoAntibioticoHospitalizado",
            "tratamientoAntibioticoHospitalizadoDias",
            "tratamientoAntibioticoDomiciliario",
            "tratamientoAntibioticoDomiciliarioDias",
            "consultasAmbulatorias",
            
            "datosInstitucion",
            "institucion_provincia",
            "institucion_departamento",
            "institucion",
            "institucion_cp",
            "institucion_otra"
          ],
          fechaSeguimiento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          edadSeguimiento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          nivelEducativo: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          actividadLaboral: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          cud: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          pensionDiscapacidad: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          coberturaSocial: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          otraCoberturaSocial: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          tratamientoAntibioticoHospitalizado: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          tratamientoAntibioticoHospitalizadoDias: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          tratamientoAntibioticoDomiciliario: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          tratamientoAntibioticoDomiciliarioDias: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          consultasAmbulatorias: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          embarazo: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },

          datosInstitucion: {
            "ui:FieldTemplate": CustomFieldTemplate,
            "ui:widget": "hidden",
            clases: "col-md-12 font-weight-bold",
          },
          institucion_provincia: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          institucion_departamento: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          institucion: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          institucion_cp: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          institucion_otra: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          }
        },
        seccion2: {
          "ui:ObjectFieldTemplate": ObjectFieldTemplate,
          MostrarTitulo: true,
          Icono: faAddressBook,
          auxID: "seguimiento",
          peso: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          talla: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          imc: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          percentiloPeso: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4",
          },
          zPeso: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          percentiloTalla: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4",
          },
          zTalla: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          percentiloImc: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4",
          },
          zImc: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
        },
        seccion3: {
          "ui:ObjectFieldTemplate": ObjectFieldTemplate,
          MostrarTitulo: true,
          Icono: faAd,
          espirometrias: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4",
          },
          cvf: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          vef: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          vef_cvf: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          cvfLitros: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          vefLitros: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
        },
        seccion4: {
          "ui:ObjectFieldTemplate": ObjectFieldTemplate,
          MostrarTitulo: true,
          Icono:faUser,
          cultivos: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6"
          },
          germenes: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6"
          },
          otrosGermenes: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6"
          }
        },
        seccion5: {
          "ui:ObjectFieldTemplate": ObjectFieldTemplate,
          "ui:order": [
            "toleranciaGlucosa",
            "toleranciaGlucosaRealizada",
            "vitaminaD",
            "vitaminaDRealizada",
            "densitometria",
            "densitometriaRealizada",
            "inmunoglobulina",
            "inmunoglobulinaRealizada",
            "tacTorax",
            "tacToraxRealizada",
            "scoreBhalla",
            "complicaciones",
          ],
          MostrarTitulo: true,
          Icono:faPlusCircle,
          toleranciaGlucosa: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6",
          },
          toleranciaGlucosaRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6",
          },
          vitaminaD: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6"
          },
          vitaminaDRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6",
          },
          densitometria: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6",
          },
          densitometriaRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6",
          },
          inmunoglobulina: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-6",
          },
          inmunoglobulinaRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          tacTorax: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          tacToraxRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          scoreBhalla: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-4"
          },
          complicaciones: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-12",
          },
        },
        seccion6: {
          "ui:ObjectFieldTemplate": ObjectFieldTemplate,
          "ui:order": [
            "*",
            "antibioticosInhalados",
            "antibioticosInhaladosRealizada",
            "corticoides",
            "corticoidesRealizada",
            "terapiaRespiratoria",
            "terapiaRespiratoriaRealizada",
            
            "moduladores",
            "moduladoresRealizada",
            "otrosModuladores",
            "prescribirModulador",

            "enzimas",
            "enzimasRealizada",
            "otrasEnzimas",
            "prescribirEnzimas",

            "trasplante",
            "trasplanteRealizada",
            "observacionesClinicas",
            "seccion7",
            "seccion8"
          ],
          MostrarTitulo: true,
          Icono: faMedkit,
          alimentacion: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          vitaminas: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          suplementacionVitaminaD: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          suplementoNutricional: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          acidoUrsodesoxicolico: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          antiacidos: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          insulina: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          broncodilatadores: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          dnasa: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          solucionSalinaHipertonica: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          antibioticosInhalados: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          antibioticosInhaladosRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          corticoides: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          corticoidesRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          azitromicinaOral: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          terapiaRespiratoria: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          terapiaRespiratoriaRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          actividadDeportiva: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          oxigenoterapiaDomiciliaria: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          asistenciaRespiratoria: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },

          moduladores: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          moduladoresRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          otrosModuladores: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          prescribirModulador: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          
          enzimas: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          enzimasRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          otrasEnzimas: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },
          prescribirEnzimas: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
          },

          trasplante: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          trasplanteRealizada: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate
          },
          observacionesClinicas: {
            "ui:widget": "textWidget",
            "ui:FieldTemplate": CustomFieldTemplate,
            clases: "col-md-12"
          },
      
          seccion7: {
            "ui:ObjectFieldTemplate": CustomObjectFieldTemplate,
            "ui:order": [
              "medicoResponsable",
              "nombreMedicoResponsable",
              "apellidoMedicoResponsable",
              "matriculaMedicoResponsable",
              "mailMedicoResponsable",
              "institucion_medicoResponsable_provincia",
              "institucion_medicoResponsable_departamento",
              "institucion_medicoResponsable",

              "institucionRecepcion",
              "institucion_provincia",
              "institucion_departamento",
              "institucion",
              "institucion_cp",
              "institucion_otra",

              "responsablesRecepcion",
              "nombreResponsableFarmacia",
              "apellidoResponsableFarmacia",
              "emailResponsableFarmacia",
              "glnResponsableFarmacia",
            ],
            Titulo: "Prescripción modulador",
            Icono: faMedkit,

            institucionRecepcion: {
              "ui:FieldTemplate": CustomFieldTemplate,
              "ui:widget": "hidden",
              clases: "col-md-12 font-weight-bold mt-5 h5",
            },
            institucion_provincia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            institucion_departamento: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            institucion: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            institucion_cp: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            institucion_otra: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            
            medicoResponsable: {
              "ui:FieldTemplate": CustomFieldTemplate,
              "ui:widget": "hidden",
              clases: "col-md-12 font-weight-bold h5",
            },
            nombreMedicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            apellidoMedicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            matriculaMedicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            mailMedicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            institucion_medicoResponsable_provincia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            institucion_medicoResponsable_departamento: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            institucion_medicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
        
            responsablesRecepcion: {
              "ui:FieldTemplate": CustomFieldTemplate,
              "ui:widget": "hidden",
              clases: "col-md-12 font-weight-bold mt-5 h5",
            },
            nombreResponsableFarmacia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            apellidoResponsableFarmacia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            emailResponsableFarmacia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            glnResponsableFarmacia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
          },

          seccion8: {
            "ui:ObjectFieldTemplate": CustomObjectFieldTemplate,
            "ui:order": [
              "medicoResponsable",
              "nombreMedicoResponsable",
              "apellidoMedicoResponsable",
              "matriculaMedicoResponsable",
              "mailMedicoResponsable",
              "institucion_medicoResponsable_provincia",
              "institucion_medicoResponsable_departamento",
              "institucion_medicoResponsable",

              "institucionRecepcion",
              "institucion_provincia",
              "institucion_departamento",
              "institucion",
              "institucion_cp",
              "institucion_otra",

              "responsablesRecepcion",
              "nombreResponsableFarmacia",
              "apellidoResponsableFarmacia",
              "emailResponsableFarmacia",
              "glnResponsableFarmacia",
            ],
            Titulo: "Prescripción enzimas",
            Icono: faMedkit,

            institucionRecepcion: {
              "ui:FieldTemplate": CustomFieldTemplate,
              "ui:widget": "hidden",
              clases: "col-md-12 font-weight-bold mt-5 h5",
            },
            institucion_provincia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            institucion_departamento: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            institucion: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            institucion_cp: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            institucion_otra: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate
            },
            
            medicoResponsable: {
              "ui:FieldTemplate": CustomFieldTemplate,
              "ui:widget": "hidden",
              clases: "col-md-12 font-weight-bold h5",
            },
            nombreMedicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            apellidoMedicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            matriculaMedicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            mailMedicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            institucion_medicoResponsable_provincia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            institucion_medicoResponsable_departamento: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            institucion_medicoResponsable: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
        
            responsablesRecepcion: {
              "ui:FieldTemplate": CustomFieldTemplate,
              "ui:widget": "hidden",
              clases: "col-md-12 font-weight-bold mt-5 h5",
            },
            nombreResponsableFarmacia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            apellidoResponsableFarmacia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            emailResponsableFarmacia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
            glnResponsableFarmacia: {
              "ui:widget": "textWidget",
              "ui:FieldTemplate": CustomFieldTemplate, 
              clases: "col-md-4"
            },
          },
        },
    };
}