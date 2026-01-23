### Se importaron los pacientes, los usuarios y los seguimientos del sistema anterior de FQ.
### Detalle de archivos:
- usuarios-importar.csv se encuentran los usuarios importados con las claves sin encriptar.
- ImportacionFQ: calculos auxiliares para importar los pacientes. Los pacientes que se importan están en la hoja *formato-mongodb*
- SeguimientosFQ: calculos auxiliares para importar los seguimientos. En la hoja *seguimientos-pacientes* columna AA (UPDATE_COMPLETO) están los seguimientos que se actualizarán del sistema.

### La importación de los pacientes se hace utilizando el archivo en formato JSON: importar-pacientes-json.json
### El esquema se armó a partir de la hoja formato-mongodb y siguiendo los siguientes pasos:

1. Buscar:
"seccion1.apellido"
*Reemplazar:*
"seccion1":{
    "apellido"
2. Buscar:
,
      "seccion2.alelo1"
    },
*Reemplazar:*
    "seccion2":{
     "alelo1"

3. Buscar:
]
},
*Reemplazar:*
]}}

4. Buscar:
seccion1.
*Remplazar:* (vacio)

5. Buscar:
seccion2.
*Remplazar:* (vacio)

### Para importar el archivo, en Compass -> Collection -> Import Data


### Para los seguimientos, lo que se hace es hacer una actualización de los pacientes. Se actualiza el array de seguimientos.
### El esquema se arma en la columna AA de la hoja seguimientos-pacientes y se ejecuta dentro del Shell de Compass.
### Tener en cuenta que esto actualizará todo el arrego de seguimientos, de modo que se pisan los nuevos años.
### Para corregir esto debemos actualizar los seguimientos con el operador posicional $.
### Ver ejemplos: https://docs.mongodb.com/manual/reference/operator/update/positional/