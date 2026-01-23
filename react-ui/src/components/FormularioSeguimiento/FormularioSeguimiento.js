import React, { useState, useEffect } from "react";
import JSONSchemaForm from "@rjsf/core";
import {
  agregarSeguimientoPaciente,
  modificarSeguimientoPaciente,
  obtenerSeguimientoPaciente,
} from "../../redux/_actions/pacienteAction";
import { useSelector, useDispatch } from "react-redux";
import {PACIENTES_INIT} from "../../redux/types";
import cloneDeep from "lodash.clonedeep";
import ModalInformativo from "../ModalInformativo";
import { useHistory } from "react-router-dom";
//import schema from "./schemaSeguimiento";
import {TitleField} from "../../utils/customFormFunctions";
import moment from "moment";
import { GetUISchema, GetSchema } from "./schemasFormularioSeguimiento";
import axios from "axios";
import { GetResponsableData } from "../../utils/responsableFarmacias";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";


const fields = {
  TitleField: TitleField,
  // layout_grid: LayoutGridField,
};

let schema = GetSchema();
const uiSchema = GetUISchema();

//---------------------------------------------------------------------------//
//FUNCIONES
//---------------------------------------------------------------------------//

async function existeSeguimiento(idPaciente, fechaSeg)
{
  try{
    const config = { header: { "Content-Type": "application/json" } };
    await axios.get(`/api/pacientes/${idPaciente}/seguimientos/${fechaSeg}`, config);
    return true;
  }
  catch{
    return false;
  }
}

let hayErrores = false;
let error_inst_dep = false;
let error_inst = false;
let error_inst_dep2 = false;
let error_inst2 = false;
let error_fechaSeguimiento = false;
let error_fechaSeguimiento_futura = false;

let fechaSeguimiento_inicial = ""; //cuando se edita el caso tiene el valor del dni del paciente
let fechaSeguimiento_actual = ""; //lleva registro del dni que se está ingresando en el formulario


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
    if(error.property===".seccion6.seccion7.institucion_departamento")
    {
      if(error_inst_dep2===false)
        error_inst_dep2 = true;
      else
        error.message="";
    }
    if(error.property===".seccion6.seccion7.institucion")
    {
      if(error_inst2===false)
        error_inst2 = true;
      else
        error.message="";
    }
    

    return error;
  });
}

//Funcion que calcula el indice de masa corporal
function getIMC(peso, talla) {
  return peso === 0 || talla === 0 ? 0 : peso / Math.pow(talla / 100, 2);
}
//Funcion que calcula el Z-Peso a partir del peso, talla y sexo
function getZPeso(peso, longitud, Sex = 1) {
  let Length = longitud;
  let Weight = peso;

  var L, M, S;
  if (Sex === 1) {
    L = 0;
    M = 0;
    S = 0;

    if (Length < 45.5) {
      L = -0.3833;
      M = 2.4607;
      S = 0.09029;
    } else if (Length < 46) {
      L = -0.3833;
      M = 2.5457;
      S = 0.09033;
    } else if (Length < 46.5) {
      L = -0.3833;
      M = 2.6306;
      S = 0.09037;
    } else if (Length < 47) {
      L = -0.3833;
      M = 2.7155;
      S = 0.0904;
    } else if (Length < 47.5) {
      L = -0.3833;
      M = 2.8007;
      S = 0.09044;
    } else if (Length < 48) {
      L = -0.3833;
      M = 2.8867;
      S = 0.09048;
    } else if (Length < 48.5) {
      L = -0.3833;
      M = 2.9741;
      S = 0.09052;
    } else if (Length < 49) {
      L = -0.3833;
      M = 3.0636;
      S = 0.09056;
    } else if (Length < 49.5) {
      L = -0.3833;
      M = 3.156;
      S = 0.0906;
    } else if (Length < 50) {
      L = -0.3833;
      M = 3.252;
      S = 0.09064;
    } else if (Length < 50.5) {
      L = -0.3833;
      M = 3.3518;
      S = 0.09068;
    } else if (Length < 51) {
      L = -0.3833;
      M = 3.4557;
      S = 0.09072;
    } else if (Length < 51.5) {
      L = -0.3833;
      M = 3.5636;
      S = 0.09076;
    } else if (Length < 52) {
      L = -0.3833;
      M = 3.6754;
      S = 0.0908;
    } else if (Length < 52.5) {
      L = -0.3833;
      M = 3.7911;
      S = 0.09085;
    } else if (Length < 53) {
      L = -0.3833;
      M = 3.9105;
      S = 0.09089;
    } else if (Length < 53.5) {
      L = -0.3833;
      M = 4.0332;
      S = 0.09093;
    } else if (Length < 54) {
      L = -0.3833;
      M = 4.1591;
      S = 0.09098;
    } else if (Length < 54.5) {
      L = -0.3833;
      M = 4.2875;
      S = 0.09102;
    } else if (Length < 55) {
      L = -0.3833;
      M = 4.4179;
      S = 0.09106;
    } else if (Length < 55.5) {
      L = -0.3833;
      M = 4.5498;
      S = 0.0911;
    } else if (Length < 56) {
      L = -0.3833;
      M = 4.6827;
      S = 0.09114;
    } else if (Length < 56.5) {
      L = -0.3833;
      M = 4.8162;
      S = 0.09118;
    } else if (Length < 57) {
      L = -0.3833;
      M = 4.95;
      S = 0.09121;
    } else if (Length < 57.5) {
      L = -0.3833;
      M = 5.0837;
      S = 0.09125;
    } else if (Length < 58) {
      L = -0.3833;
      M = 5.2173;
      S = 0.09128;
    } else if (Length < 58.5) {
      L = -0.3833;
      M = 5.3507;
      S = 0.0913;
    } else if (Length < 59) {
      L = -0.3833;
      M = 5.4834;
      S = 0.09132;
    } else if (Length < 59.5) {
      L = -0.3833;
      M = 5.6151;
      S = 0.09134;
    } else if (Length < 60) {
      L = -0.3833;
      M = 5.7454;
      S = 0.09135;
    } else if (Length < 60.5) {
      L = -0.3833;
      M = 5.8742;
      S = 0.09136;
    } else if (Length < 61) {
      L = -0.3833;
      M = 6.0014;
      S = 0.09137;
    } else if (Length < 61.5) {
      L = -0.3833;
      M = 6.127;
      S = 0.09137;
    } else if (Length < 62) {
      L = -0.3833;
      M = 6.2511;
      S = 0.09136;
    } else if (Length < 62.5) {
      L = -0.3833;
      M = 6.3738;
      S = 0.09135;
    } else if (Length < 63) {
      L = -0.3833;
      M = 6.4948;
      S = 0.09133;
    } else if (Length < 63.5) {
      L = -0.3833;
      M = 6.6144;
      S = 0.09131;
    } else if (Length < 64) {
      L = -0.3833;
      M = 6.7328;
      S = 0.09129;
    } else if (Length < 64.5) {
      L = -0.3833;
      M = 6.8501;
      S = 0.09126;
    } else if (Length < 65) {
      L = -0.3833;
      M = 6.9662;
      S = 0.09123;
    } else if (Length < 65.5) {
      L = -0.3833;
      M = 7.0812;
      S = 0.09119;
    } else if (Length < 66) {
      L = -0.3833;
      M = 7.195;
      S = 0.09115;
    } else if (Length < 66.5) {
      L = -0.3833;
      M = 7.3076;
      S = 0.0911;
    } else if (Length < 67) {
      L = -0.3833;
      M = 7.4189;
      S = 0.09106;
    } else if (Length < 67.5) {
      L = -0.3833;
      M = 7.5288;
      S = 0.09101;
    } else if (Length < 68) {
      L = -0.3833;
      M = 7.6375;
      S = 0.09096;
    } else if (Length < 68.5) {
      L = -0.3833;
      M = 7.7448;
      S = 0.0909;
    } else if (Length < 69) {
      L = -0.3833;
      M = 7.8509;
      S = 0.09085;
    } else if (Length < 69.5) {
      L = -0.3833;
      M = 7.9559;
      S = 0.09079;
    } else if (Length < 70) {
      L = -0.3833;
      M = 8.0599;
      S = 0.09074;
    } else if (Length < 70.5) {
      L = -0.3833;
      M = 8.163;
      S = 0.09068;
    } else if (Length < 71) {
      L = -0.3833;
      M = 8.2651;
      S = 0.09062;
    } else if (Length < 71.5) {
      L = -0.3833;
      M = 8.3666;
      S = 0.09056;
    } else if (Length < 72) {
      L = -0.3833;
      M = 8.4676;
      S = 0.0905;
    } else if (Length < 72.5) {
      L = -0.3833;
      M = 8.5679;
      S = 0.09043;
    } else if (Length < 73) {
      L = -0.3833;
      M = 8.6674;
      S = 0.09037;
    } else if (Length < 73.5) {
      L = -0.3833;
      M = 8.7661;
      S = 0.09031;
    } else if (Length < 74) {
      L = -0.3833;
      M = 8.8638;
      S = 0.09025;
    } else if (Length < 74.5) {
      L = -0.3833;
      M = 8.9601;
      S = 0.09018;
    } else if (Length < 75) {
      L = -0.3833;
      M = 9.0552;
      S = 0.09012;
    } else if (Length < 75.5) {
      L = -0.3833;
      M = 9.149;
      S = 0.09005;
    } else if (Length < 76) {
      L = -0.3833;
      M = 9.2418;
      S = 0.08999;
    } else if (Length < 76.5) {
      L = -0.3833;
      M = 9.3337;
      S = 0.08992;
    } else if (Length < 77) {
      L = -0.3833;
      M = 9.4252;
      S = 0.08985;
    } else if (Length < 77.5) {
      L = -0.3833;
      M = 9.5166;
      S = 0.08979;
    } else if (Length < 78) {
      L = -0.3833;
      M = 9.6086;
      S = 0.08972;
    } else if (Length < 78.5) {
      L = -0.3833;
      M = 9.7015;
      S = 0.08965;
    } else if (Length < 79) {
      L = -0.3833;
      M = 9.7957;
      S = 0.08959;
    } else if (Length < 79.5) {
      L = -0.3833;
      M = 9.8915;
      S = 0.08952;
    } else if (Length < 80) {
      L = -0.3833;
      M = 9.9892;
      S = 0.08946;
    } else if (Length < 80.5) {
      L = -0.3833;
      M = 10.0891;
      S = 0.0894;
    } else if (Length < 81) {
      L = -0.3833;
      M = 10.1916;
      S = 0.08934;
    } else if (Length < 81.5) {
      L = -0.3833;
      M = 10.2965;
      S = 0.08928;
    } else if (Length < 82) {
      L = -0.3833;
      M = 10.4041;
      S = 0.08923;
    } else if (Length < 82.5) {
      L = -0.3833;
      M = 10.514;
      S = 0.08918;
    } else if (Length < 83) {
      L = -0.3833;
      M = 10.6263;
      S = 0.08914;
    } else if (Length < 83.5) {
      L = -0.3833;
      M = 10.741;
      S = 0.0891;
    } else if (Length < 84) {
      L = -0.3833;
      M = 10.8578;
      S = 0.08906;
    } else if (Length < 84.5) {
      L = -0.3833;
      M = 10.9767;
      S = 0.08903;
    } else if (Length < 85) {
      L = -0.3833;
      M = 11.0974;
      S = 0.089;
    } else if (Length < 85.5) {
      L = -0.3833;
      M = 11.2198;
      S = 0.08898;
    } else if (Length < 86) {
      L = -0.3833;
      M = 11.3435;
      S = 0.08897;
    } else if (Length < 86.5) {
      L = -0.3833;
      M = 11.4684;
      S = 0.08895;
    } else if (Length < 87) {
      L = -0.3833;
      M = 11.594;
      S = 0.08895;
    } else if (Length < 87.5) {
      L = -0.3833;
      M = 11.7201;
      S = 0.08895;
    } else if (Length < 88) {
      L = -0.3833;
      M = 11.8461;
      S = 0.08895;
    } else if (Length < 88.5) {
      L = -0.3833;
      M = 11.972;
      S = 0.08896;
    } else if (Length < 89) {
      L = -0.3833;
      M = 12.0976;
      S = 0.08898;
    } else if (Length < 89.5) {
      L = -0.3833;
      M = 12.2229;
      S = 0.089;
    } else if (Length < 90) {
      L = -0.3833;
      M = 12.3477;
      S = 0.08903;
    } else if (Length < 90.5) {
      L = -0.3833;
      M = 12.4723;
      S = 0.08906;
    } else if (Length < 91) {
      L = -0.3833;
      M = 12.5965;
      S = 0.08909;
    } else if (Length < 91.5) {
      L = -0.3833;
      M = 12.7205;
      S = 0.08913;
    } else if (Length < 92) {
      L = -0.3833;
      M = 12.8443;
      S = 0.08918;
    } else if (Length < 92.5) {
      L = -0.3833;
      M = 12.9681;
      S = 0.08923;
    } else if (Length < 93) {
      L = -0.3833;
      M = 13.092;
      S = 0.08928;
    } else if (Length < 93.5) {
      L = -0.3833;
      M = 13.2158;
      S = 0.08934;
    } else if (Length < 94) {
      L = -0.3833;
      M = 13.3399;
      S = 0.08941;
    } else if (Length < 94.5) {
      L = -0.3833;
      M = 13.4643;
      S = 0.08948;
    } else if (Length < 95) {
      L = -0.3833;
      M = 13.5892;
      S = 0.08955;
    } else if (Length < 95.5) {
      L = -0.3833;
      M = 13.7146;
      S = 0.08963;
    } else if (Length < 96) {
      L = -0.3833;
      M = 13.8408;
      S = 0.08972;
    } else if (Length < 96.5) {
      L = -0.3833;
      M = 13.9676;
      S = 0.08981;
    } else if (Length < 97) {
      L = -0.3833;
      M = 14.0953;
      S = 0.0899;
    } else if (Length < 97.5) {
      L = -0.3833;
      M = 14.2239;
      S = 0.09;
    } else if (Length < 98) {
      L = -0.3833;
      M = 14.3537;
      S = 0.0901;
    } else if (Length < 98.5) {
      L = -0.3833;
      M = 14.4848;
      S = 0.09021;
    } else if (Length < 99) {
      L = -0.3833;
      M = 14.6174;
      S = 0.09033;
    } else if (Length < 99.5) {
      L = -0.3833;
      M = 14.7519;
      S = 0.09044;
    } else if (Length < 100) {
      L = -0.3833;
      M = 14.8882;
      S = 0.09057;
    } else if (Length < 100.5) {
      L = -0.3833;
      M = 15.0267;
      S = 0.09069;
    } else if (Length < 101) {
      L = -0.3833;
      M = 15.1676;
      S = 0.09083;
    } else if (Length < 101.5) {
      L = -0.3833;
      M = 15.3108;
      S = 0.09096;
    } else if (Length < 102) {
      L = -0.3833;
      M = 15.4564;
      S = 0.0911;
    } else if (Length < 102.5) {
      L = -0.3833;
      M = 15.6046;
      S = 0.09125;
    } else if (Length < 103) {
      L = -0.3833;
      M = 15.7553;
      S = 0.09139;
    } else if (Length < 103.5) {
      L = -0.3833;
      M = 15.9087;
      S = 0.09155;
    } else if (Length < 104) {
      L = -0.3833;
      M = 16.0645;
      S = 0.0917;
    } else if (Length < 104.5) {
      L = -0.3833;
      M = 16.2229;
      S = 0.09186;
    } else if (Length < 105) {
      L = -0.3833;
      M = 16.3837;
      S = 0.09203;
    } else if (Length < 105.5) {
      L = -0.3833;
      M = 16.547;
      S = 0.09219;
    } else if (Length < 106) {
      L = -0.3833;
      M = 16.7129;
      S = 0.09236;
    } else if (Length < 106.5) {
      L = -0.3833;
      M = 16.8814;
      S = 0.09254;
    } else if (Length < 107) {
      L = -0.3833;
      M = 17.0527;
      S = 0.09271;
    } else if (Length < 107.5) {
      L = -0.3833;
      M = 17.2269;
      S = 0.09289;
    } else if (Length < 108) {
      L = -0.3833;
      M = 17.4039;
      S = 0.09307;
    } else if (Length < 108.5) {
      L = -0.3833;
      M = 17.5839;
      S = 0.09326;
    } else if (Length < 109) {
      L = -0.3833;
      M = 17.7668;
      S = 0.09344;
    } else if (Length < 109.5) {
      L = -0.3833;
      M = 17.9526;
      S = 0.09363;
    } else if (Length < 110) {
      L = -0.3833;
      M = 18.1412;
      S = 0.09382;
    } else if (Length < 110.5) {
      L = -0.3833;
      M = 18.3324;
      S = 0.09401;
    }
  }
  if (Sex === 2) {
    L = 0;
    M = 0;
    S = 0;

    if (Length < 45.5) {
      L = -0.3521;
      M = 2.441;
      S = 0.09182;
    } else if (Length < 46) {
      L = -0.3521;
      M = 2.5244;
      S = 0.09153;
    } else if (Length < 46.5) {
      L = -0.3521;
      M = 2.6077;
      S = 0.09124;
    } else if (Length < 47) {
      L = -0.3521;
      M = 2.6913;
      S = 0.09094;
    } else if (Length < 47.5) {
      L = -0.3521;
      M = 2.7755;
      S = 0.09065;
    } else if (Length < 48) {
      L = -0.3521;
      M = 2.8609;
      S = 0.09036;
    } else if (Length < 48.5) {
      L = -0.3521;
      M = 2.948;
      S = 0.09007;
    } else if (Length < 49) {
      L = -0.3521;
      M = 3.0377;
      S = 0.08977;
    } else if (Length < 49.5) {
      L = -0.3521;
      M = 3.1308;
      S = 0.08948;
    } else if (Length < 50) {
      L = -0.3521;
      M = 3.2276;
      S = 0.08919;
    } else if (Length < 50.5) {
      L = -0.3521;
      M = 3.3278;
      S = 0.0889;
    } else if (Length < 51) {
      L = -0.3521;
      M = 3.4311;
      S = 0.08861;
    } else if (Length < 51.5) {
      L = -0.3521;
      M = 3.5376;
      S = 0.08831;
    } else if (Length < 52) {
      L = -0.3521;
      M = 3.6477;
      S = 0.08801;
    } else if (Length < 52.5) {
      L = -0.3521;
      M = 3.762;
      S = 0.08771;
    } else if (Length < 53) {
      L = -0.3521;
      M = 3.8814;
      S = 0.08741;
    } else if (Length < 53.5) {
      L = -0.3521;
      M = 4.006;
      S = 0.08711;
    } else if (Length < 54) {
      L = -0.3521;
      M = 4.1354;
      S = 0.08681;
    } else if (Length < 54.5) {
      L = -0.3521;
      M = 4.2693;
      S = 0.08651;
    } else if (Length < 55) {
      L = -0.3521;
      M = 4.4066;
      S = 0.08621;
    } else if (Length < 55.5) {
      L = -0.3521;
      M = 4.5467;
      S = 0.08592;
    } else if (Length < 56) {
      L = -0.3521;
      M = 4.6892;
      S = 0.08563;
    } else if (Length < 56.5) {
      L = -0.3521;
      M = 4.8338;
      S = 0.08535;
    } else if (Length < 57) {
      L = -0.3521;
      M = 4.9796;
      S = 0.08507;
    } else if (Length < 57.5) {
      L = -0.3521;
      M = 5.1259;
      S = 0.08481;
    } else if (Length < 58) {
      L = -0.3521;
      M = 5.2721;
      S = 0.08455;
    } else if (Length < 58.5) {
      L = -0.3521;
      M = 5.418;
      S = 0.0843;
    } else if (Length < 59) {
      L = -0.3521;
      M = 5.5632;
      S = 0.08406;
    } else if (Length < 59.5) {
      L = -0.3521;
      M = 5.7074;
      S = 0.08383;
    } else if (Length < 60) {
      L = -0.3521;
      M = 5.8501;
      S = 0.08362;
    } else if (Length < 60.5) {
      L = -0.3521;
      M = 5.9907;
      S = 0.08342;
    } else if (Length < 61) {
      L = -0.3521;
      M = 6.1284;
      S = 0.08324;
    } else if (Length < 61.5) {
      L = -0.3521;
      M = 6.2632;
      S = 0.08308;
    } else if (Length < 62) {
      L = -0.3521;
      M = 6.3954;
      S = 0.08292;
    } else if (Length < 62.5) {
      L = -0.3521;
      M = 6.5251;
      S = 0.08279;
    } else if (Length < 63) {
      L = -0.3521;
      M = 6.6527;
      S = 0.08266;
    } else if (Length < 63.5) {
      L = -0.3521;
      M = 6.7786;
      S = 0.08255;
    } else if (Length < 64) {
      L = -0.3521;
      M = 6.9028;
      S = 0.08245;
    } else if (Length < 64.5) {
      L = -0.3521;
      M = 7.0255;
      S = 0.08236;
    } else if (Length < 65) {
      L = -0.3521;
      M = 7.1467;
      S = 0.08229;
    } else if (Length < 65.5) {
      L = -0.3521;
      M = 7.2666;
      S = 0.08223;
    } else if (Length < 66) {
      L = -0.3521;
      M = 7.3854;
      S = 0.08218;
    } else if (Length < 66.5) {
      L = -0.3521;
      M = 7.5034;
      S = 0.08215;
    } else if (Length < 67) {
      L = -0.3521;
      M = 7.6206;
      S = 0.08213;
    } else if (Length < 67.5) {
      L = -0.3521;
      M = 7.737;
      S = 0.08212;
    } else if (Length < 68) {
      L = -0.3521;
      M = 7.8526;
      S = 0.08212;
    } else if (Length < 68.5) {
      L = -0.3521;
      M = 7.9674;
      S = 0.08214;
    } else if (Length < 69) {
      L = -0.3521;
      M = 8.0816;
      S = 0.08216;
    } else if (Length < 69.5) {
      L = -0.3521;
      M = 8.1955;
      S = 0.08219;
    } else if (Length < 70) {
      L = -0.3521;
      M = 8.3092;
      S = 0.08224;
    } else if (Length < 70.5) {
      L = -0.3521;
      M = 8.4227;
      S = 0.08229;
    } else if (Length < 71) {
      L = -0.3521;
      M = 8.5358;
      S = 0.08235;
    } else if (Length < 71.5) {
      L = -0.3521;
      M = 8.648;
      S = 0.08241;
    } else if (Length < 72) {
      L = -0.3521;
      M = 8.7594;
      S = 0.08248;
    } else if (Length < 72.5) {
      L = -0.3521;
      M = 8.8697;
      S = 0.08254;
    } else if (Length < 73) {
      L = -0.3521;
      M = 8.9788;
      S = 0.08262;
    } else if (Length < 73.5) {
      L = -0.3521;
      M = 9.0865;
      S = 0.08269;
    } else if (Length < 74) {
      L = -0.3521;
      M = 9.1927;
      S = 0.08276;
    } else if (Length < 74.5) {
      L = -0.3521;
      M = 9.2974;
      S = 0.08283;
    } else if (Length < 75) {
      L = -0.3521;
      M = 9.401;
      S = 0.08289;
    } else if (Length < 75.5) {
      L = -0.3521;
      M = 9.5032;
      S = 0.08295;
    } else if (Length < 76) {
      L = -0.3521;
      M = 9.6041;
      S = 0.08301;
    } else if (Length < 76.5) {
      L = -0.3521;
      M = 9.7033;
      S = 0.08307;
    } else if (Length < 77) {
      L = -0.3521;
      M = 9.8007;
      S = 0.08311;
    } else if (Length < 77.5) {
      L = -0.3521;
      M = 9.8963;
      S = 0.08314;
    } else if (Length < 78) {
      L = -0.3521;
      M = 9.9902;
      S = 0.08317;
    } else if (Length < 78.5) {
      L = -0.3521;
      M = 10.0827;
      S = 0.08318;
    } else if (Length < 79) {
      L = -0.3521;
      M = 10.1741;
      S = 0.08318;
    } else if (Length < 79.5) {
      L = -0.3521;
      M = 10.2649;
      S = 0.08316;
    } else if (Length < 80) {
      L = -0.3521;
      M = 10.3558;
      S = 0.08313;
    } else if (Length < 80.5) {
      L = -0.3521;
      M = 10.4475;
      S = 0.08308;
    } else if (Length < 81) {
      L = -0.3521;
      M = 10.5405;
      S = 0.08301;
    } else if (Length < 81.5) {
      L = -0.3521;
      M = 10.6352;
      S = 0.08293;
    } else if (Length < 82) {
      L = -0.3521;
      M = 10.7322;
      S = 0.08284;
    } else if (Length < 82.5) {
      L = -0.3521;
      M = 10.8321;
      S = 0.08273;
    } else if (Length < 83) {
      L = -0.3521;
      M = 10.935;
      S = 0.0826;
    } else if (Length < 83.5) {
      L = -0.3521;
      M = 11.0415;
      S = 0.08246;
    } else if (Length < 84) {
      L = -0.3521;
      M = 11.1516;
      S = 0.08231;
    } else if (Length < 84.5) {
      L = -0.3521;
      M = 11.2651;
      S = 0.08215;
    } else if (Length < 85) {
      L = -0.3521;
      M = 11.3817;
      S = 0.08198;
    } else if (Length < 85.5) {
      L = -0.3521;
      M = 11.5007;
      S = 0.08181;
    } else if (Length < 86) {
      L = -0.3521;
      M = 11.6218;
      S = 0.08163;
    } else if (Length < 86.5) {
      L = -0.3521;
      M = 11.7444;
      S = 0.08145;
    } else if (Length < 87) {
      L = -0.3521;
      M = 11.8678;
      S = 0.08128;
    } else if (Length < 87.5) {
      L = -0.3521;
      M = 11.9916;
      S = 0.08111;
    } else if (Length < 88) {
      L = -0.3521;
      M = 12.1152;
      S = 0.08096;
    } else if (Length < 88.5) {
      L = -0.3521;
      M = 12.2382;
      S = 0.08082;
    } else if (Length < 89) {
      L = -0.3521;
      M = 12.3603;
      S = 0.08069;
    } else if (Length < 89.5) {
      L = -0.3521;
      M = 12.4815;
      S = 0.08058;
    } else if (Length < 90) {
      L = -0.3521;
      M = 12.6017;
      S = 0.08048;
    } else if (Length < 90.5) {
      L = -0.3521;
      M = 12.7209;
      S = 0.08041;
    } else if (Length < 91) {
      L = -0.3521;
      M = 12.8392;
      S = 0.08034;
    } else if (Length < 91.5) {
      L = -0.3521;
      M = 12.9569;
      S = 0.0803;
    } else if (Length < 92) {
      L = -0.3521;
      M = 13.0742;
      S = 0.08026;
    } else if (Length < 92.5) {
      L = -0.3521;
      M = 13.191;
      S = 0.08025;
    } else if (Length < 93) {
      L = -0.3521;
      M = 13.3075;
      S = 0.08025;
    } else if (Length < 93.5) {
      L = -0.3521;
      M = 13.4239;
      S = 0.08026;
    } else if (Length < 94) {
      L = -0.3521;
      M = 13.5404;
      S = 0.08029;
    } else if (Length < 94.5) {
      L = -0.3521;
      M = 13.6572;
      S = 0.08034;
    } else if (Length < 95) {
      L = -0.3521;
      M = 13.7746;
      S = 0.0804;
    } else if (Length < 95.5) {
      L = -0.3521;
      M = 13.8928;
      S = 0.08047;
    } else if (Length < 96) {
      L = -0.3521;
      M = 14.012;
      S = 0.08056;
    } else if (Length < 96.5) {
      L = -0.3521;
      M = 14.1325;
      S = 0.08067;
    } else if (Length < 97) {
      L = -0.3521;
      M = 14.2544;
      S = 0.08078;
    } else if (Length < 97.5) {
      L = -0.3521;
      M = 14.3782;
      S = 0.08092;
    } else if (Length < 98) {
      L = -0.3521;
      M = 14.5038;
      S = 0.08106;
    } else if (Length < 98.5) {
      L = -0.3521;
      M = 14.6316;
      S = 0.08122;
    } else if (Length < 99) {
      L = -0.3521;
      M = 14.7614;
      S = 0.08139;
    } else if (Length < 99.5) {
      L = -0.3521;
      M = 14.8934;
      S = 0.08157;
    } else if (Length < 100) {
      L = -0.3521;
      M = 15.0275;
      S = 0.08177;
    } else if (Length < 100.5) {
      L = -0.3521;
      M = 15.1637;
      S = 0.08198;
    } else if (Length < 101) {
      L = -0.3521;
      M = 15.3018;
      S = 0.0822;
    } else if (Length < 101.5) {
      L = -0.3521;
      M = 15.4419;
      S = 0.08243;
    } else if (Length < 102) {
      L = -0.3521;
      M = 15.5838;
      S = 0.08267;
    } else if (Length < 102.5) {
      L = -0.3521;
      M = 15.7276;
      S = 0.08292;
    } else if (Length < 103) {
      L = -0.3521;
      M = 15.8732;
      S = 0.08317;
    } else if (Length < 103.5) {
      L = -0.3521;
      M = 16.0206;
      S = 0.08343;
    } else if (Length < 104) {
      L = -0.3521;
      M = 16.1697;
      S = 0.0837;
    } else if (Length < 104.5) {
      L = -0.3521;
      M = 16.3204;
      S = 0.08397;
    } else if (Length < 105) {
      L = -0.3521;
      M = 16.4728;
      S = 0.08425;
    } else if (Length < 105.5) {
      L = -0.3521;
      M = 16.6268;
      S = 0.08453;
    } else if (Length < 106) {
      L = -0.3521;
      M = 16.7826;
      S = 0.08481;
    } else if (Length < 106.5) {
      L = -0.3521;
      M = 16.9401;
      S = 0.0851;
    } else if (Length < 107) {
      L = -0.3521;
      M = 17.0995;
      S = 0.08539;
    } else if (Length < 107.5) {
      L = -0.3521;
      M = 17.2607;
      S = 0.08568;
    } else if (Length < 108) {
      L = -0.3521;
      M = 17.4237;
      S = 0.08599;
    } else if (Length < 108.5) {
      L = -0.3521;
      M = 17.5885;
      S = 0.08629;
    } else if (Length < 109) {
      L = -0.3521;
      M = 17.7553;
      S = 0.0866;
    } else if (Length < 109.5) {
      L = -0.3521;
      M = 17.9242;
      S = 0.08691;
    } else if (Length < 110) {
      L = -0.3521;
      M = 18.0954;
      S = 0.08723;
    } else if (Length < 110.5) {
      L = -0.3521;
      M = 18.2689;
      S = 0.08755;
    }
  }

  return L === 0 || S === 0 ? 0 : (Math.pow(Weight / M, L) - 1) / (L * S);
}
//Funcion que calcula el Z-Talla en a partir de la altura y la edad(meses)
function getZTalla(Height, Age_Months) {
  var L = 0;
  var M = 0;
  var S = 0;

  if (Age_Months < 25) {
    L = 1.00720807;
    M = 86.86160934;
    S = 0.040395626;
  } else if (Age_Months < 26) {
    L = 0.837251351;
    M = 87.65247282;
    S = 0.040577525;
  } else if (Age_Months < 27) {
    L = 0.681492975;
    M = 88.42326434;
    S = 0.040723122;
  } else if (Age_Months < 28) {
    L = 0.538779654;
    M = 89.17549228;
    S = 0.040833194;
  } else if (Age_Months < 29) {
    L = 0.407697153;
    M = 89.91040853;
    S = 0.040909059;
  } else if (Age_Months < 30) {
    L = 0.286762453;
    M = 90.62907762;
    S = 0.040952433;
  } else if (Age_Months < 31) {
    L = 0.174489485;
    M = 91.33242379;
    S = 0.04096533;
  } else if (Age_Months < 32) {
    L = 0.069444521;
    M = 92.02127167;
    S = 0.040949976;
  } else if (Age_Months < 33) {
    L = -0.029720564;
    M = 92.69637946;
    S = 0.040908737;
  } else if (Age_Months < 34) {
    L = -0.124251789;
    M = 93.35846546;
    S = 0.040844062;
  } else if (Age_Months < 35) {
    L = -0.215288396;
    M = 94.00822923;
    S = 0.040758431;
  } else if (Age_Months < 36) {
    L = -0.30385434;
    M = 94.64636981;
    S = 0.040654312;
  } else if (Age_Months < 37) {
    L = -0.390918369;
    M = 95.27359106;
    S = 0.04053412;
  } else if (Age_Months < 38) {
    L = -0.254801167;
    M = 95.91474929;
    S = 0.040572876;
  } else if (Age_Months < 39) {
    L = -0.125654535;
    M = 96.54734328;
    S = 0.04061691;
  } else if (Age_Months < 40) {
    L = -0.00316735;
    M = 97.17191309;
    S = 0.040666414;
  } else if (Age_Months < 41) {
    L = 0.11291221;
    M = 97.78897727;
    S = 0.040721467;
  } else if (Age_Months < 42) {
    L = 0.222754969;
    M = 98.3990283;
    S = 0.040782045;
  } else if (Age_Months < 43) {
    L = 0.326530126;
    M = 99.00254338;
    S = 0.040848042;
  } else if (Age_Months < 44) {
    L = 0.42436156;
    M = 99.599977;
    S = 0.040919281;
  } else if (Age_Months < 45) {
    L = 0.516353108;
    M = 100.191764;
    S = 0.040995524;
  } else if (Age_Months < 46) {
    L = 0.602595306;
    M = 100.7783198;
    S = 0.041076485;
  } else if (Age_Months < 47) {
    L = 0.683170764;
    M = 101.3600411;
    S = 0.041161838;
  } else if (Age_Months < 48) {
    L = 0.758158406;
    M = 101.9373058;
    S = 0.041251224;
  } else if (Age_Months < 49) {
    L = 0.827636736;
    M = 102.5104735;
    S = 0.041344257;
  } else if (Age_Months < 50) {
    L = 0.891686306;
    M = 103.0798852;
    S = 0.041440534;
  } else if (Age_Months < 51) {
    L = 0.95039153;
    M = 103.645864;
    S = 0.041539635;
  } else if (Age_Months < 52) {
    L = 1.003830006;
    M = 104.208713;
    S = 0.041641136;
  } else if (Age_Months < 53) {
    L = 1.05213569;
    M = 104.7687256;
    S = 0.041744602;
  } else if (Age_Months < 54) {
    L = 1.0953669;
    M = 105.3261638;
    S = 0.041849607;
  } else if (Age_Months < 55) {
    L = 1.133652119;
    M = 105.8812823;
    S = 0.041955723;
  } else if (Age_Months < 56) {
    L = 1.167104213;
    M = 106.4343146;
    S = 0.042062532;
  } else if (Age_Months < 57) {
    L = 1.195845353;
    M = 106.9854769;
    S = 0.042169628;
  } else if (Age_Months < 58) {
    L = 1.220004233;
    M = 107.534968;
    S = 0.042276619;
  } else if (Age_Months < 59) {
    L = 1.239715856;
    M = 108.0829695;
    S = 0.042383129;
  } else if (Age_Months < 60) {
    L = 1.255121285;
    M = 108.6296457;
    S = 0.042488804;
  } else if (Age_Months < 61) {
    L = 1.266367398;
    M = 109.1751441;
    S = 0.042593311;
  } else if (Age_Months < 62) {
    L = 1.273606657;
    M = 109.7195954;
    S = 0.042696342;
  } else if (Age_Months < 63) {
    L = 1.276996893;
    M = 110.2631136;
    S = 0.042797615;
  } else if (Age_Months < 64) {
    L = 1.276701119;
    M = 110.8057967;
    S = 0.042896877;
  } else if (Age_Months < 65) {
    L = 1.272887366;
    M = 111.3477265;
    S = 0.042993904;
  } else if (Age_Months < 66) {
    L = 1.265728536;
    M = 111.8889694;
    S = 0.043088503;
  } else if (Age_Months < 67) {
    L = 1.255402281;
    M = 112.4295761;
    S = 0.043180513;
  } else if (Age_Months < 68) {
    L = 1.242090871;
    M = 112.9695827;
    S = 0.043269806;
  } else if (Age_Months < 69) {
    L = 1.225981067;
    M = 113.5090108;
    S = 0.043356287;
  } else if (Age_Months < 70) {
    L = 1.207263978;
    M = 114.0478678;
    S = 0.043439893;
  } else if (Age_Months < 71) {
    L = 1.186140222;
    M = 114.5861486;
    S = 0.043520597;
  } else if (Age_Months < 72) {
    L = 1.162796198;
    M = 115.1238315;
    S = 0.043598407;
  } else if (Age_Months < 73) {
    L = 1.137442868;
    M = 115.6608862;
    S = 0.043673359;
  } else if (Age_Months < 74) {
    L = 1.110286487;
    M = 116.1972691;
    S = 0.043745523;
  } else if (Age_Months < 75) {
    L = 1.081536236;
    M = 116.732925;
    S = 0.043815003;
  } else if (Age_Months < 76) {
    L = 1.05140374;
    M = 117.2677879;
    S = 0.043881929;
  } else if (Age_Months < 77) {
    L = 1.020102497;
    M = 117.8017819;
    S = 0.043946461;
  } else if (Age_Months < 78) {
    L = 0.987847213;
    M = 118.3348215;
    S = 0.044008785;
  } else if (Age_Months < 79) {
    L = 0.954853043;
    M = 118.8668123;
    S = 0.044069112;
  } else if (Age_Months < 80) {
    L = 0.921334742;
    M = 119.397652;
    S = 0.044127675;
  } else if (Age_Months < 81) {
    L = 0.887505723;
    M = 119.9272309;
    S = 0.044184725;
  } else if (Age_Months < 82) {
    L = 0.85357703;
    M = 120.455433;
    S = 0.044240532;
  } else if (Age_Months < 83) {
    L = 0.819756239;
    M = 120.9821362;
    S = 0.044295379;
  } else if (Age_Months < 84) {
    L = 0.786246296;
    M = 121.5072136;
    S = 0.044349559;
  } else if (Age_Months < 85) {
    L = 0.753244292;
    M = 122.0305342;
    S = 0.044403374;
  } else if (Age_Months < 86) {
    L = 0.720940222;
    M = 122.5519634;
    S = 0.04445713;
  } else if (Age_Months < 87) {
    L = 0.689515708;
    M = 123.0713645;
    S = 0.044511135;
  } else if (Age_Months < 88) {
    L = 0.659142731;
    M = 123.588599;
    S = 0.044565693;
  } else if (Age_Months < 89) {
    L = 0.629997853;
    M = 124.1035312;
    S = 0.044621104;
  } else if (Age_Months < 90) {
    L = 0.602203984;
    M = 124.6160161;
    S = 0.044677662;
  } else if (Age_Months < 91) {
    L = 0.575908038;
    M = 125.1259182;
    S = 0.044735646;
  } else if (Age_Months < 92) {
    L = 0.55123134;
    M = 125.6331012;
    S = 0.044795322;
  } else if (Age_Months < 93) {
    L = 0.528279901;
    M = 126.1374319;
    S = 0.044856941;
  } else if (Age_Months < 94) {
    L = 0.507143576;
    M = 126.6387804;
    S = 0.04492073;
  } else if (Age_Months < 95) {
    L = 0.487895344;
    M = 127.1370217;
    S = 0.044986899;
  } else if (Age_Months < 96) {
    L = 0.470590753;
    M = 127.6320362;
    S = 0.045055632;
  } else if (Age_Months < 97) {
    L = 0.455267507;
    M = 128.1237104;
    S = 0.045127088;
  } else if (Age_Months < 98) {
    L = 0.441945241;
    M = 128.6119383;
    S = 0.045201399;
  } else if (Age_Months < 99) {
    L = 0.430625458;
    M = 129.096622;
    S = 0.045278671;
  } else if (Age_Months < 100) {
    L = 0.421291648;
    M = 129.5776723;
    S = 0.045358979;
  } else if (Age_Months < 101) {
    L = 0.413909588;
    M = 130.0550101;
    S = 0.045442372;
  } else if (Age_Months < 102) {
    L = 0.408427813;
    M = 130.5285669;
    S = 0.045528869;
  } else if (Age_Months < 103) {
    L = 0.404778262;
    M = 130.9982857;
    S = 0.045618459;
  } else if (Age_Months < 104) {
    L = 0.402877077;
    M = 131.4641218;
    S = 0.045711105;
  } else if (Age_Months < 105) {
    L = 0.402625561;
    M = 131.9260439;
    S = 0.045806742;
  } else if (Age_Months < 106) {
    L = 0.40391127;
    M = 132.3840348;
    S = 0.045905281;
  } else if (Age_Months < 107) {
    L = 0.406609232;
    M = 132.838092;
    S = 0.046006604;
  } else if (Age_Months < 108) {
    L = 0.410583274;
    M = 133.2882291;
    S = 0.046110573;
  } else if (Age_Months < 109) {
    L = 0.415687443;
    M = 133.7344759;
    S = 0.046217028;
  } else if (Age_Months < 110) {
    L = 0.421767514;
    M = 134.1768801;
    S = 0.04632579;
  } else if (Age_Months < 111) {
    L = 0.428662551;
    M = 134.6155076;
    S = 0.046436662;
  } else if (Age_Months < 112) {
    L = 0.436206531;
    M = 135.0504433;
    S = 0.04654943;
  } else if (Age_Months < 113) {
    L = 0.44423;
    M = 135.4817925;
    S = 0.046663871;
  } else if (Age_Months < 114) {
    L = 0.45256176;
    M = 135.9096813;
    S = 0.046779748;
  } else if (Age_Months < 115) {
    L = 0.461030578;
    M = 136.3342577;
    S = 0.046896817;
  } else if (Age_Months < 116) {
    L = 0.469466904;
    M = 136.7556923;
    S = 0.047014827;
  } else if (Age_Months < 117) {
    L = 0.477704608;
    M = 137.1741794;
    S = 0.047133525;
  } else if (Age_Months < 118) {
    L = 0.48558272;
    M = 137.5899378;
    S = 0.047252654;
  } else if (Age_Months < 119) {
    L = 0.492947182;
    M = 138.0032114;
    S = 0.047371961;
  } else if (Age_Months < 120) {
    L = 0.499652617;
    M = 138.4142703;
    S = 0.047491194;
  } else if (Age_Months < 121) {
    L = 0.505564115;
    M = 138.8234114;
    S = 0.047610108;
  } else if (Age_Months < 122) {
    L = 0.510559047;
    M = 139.2309592;
    S = 0.047728463;
  } else if (Age_Months < 123) {
    L = 0.514528903;
    M = 139.6372663;
    S = 0.04784603;
  } else if (Age_Months < 124) {
    L = 0.517381177;
    M = 140.042714;
    S = 0.047962592;
  } else if (Age_Months < 125) {
    L = 0.519041285;
    M = 140.4477127;
    S = 0.048077942;
  } else if (Age_Months < 126) {
    L = 0.519454524;
    M = 140.8527022;
    S = 0.048191889;
  } else if (Age_Months < 127) {
    L = 0.518588072;
    M = 141.2581515;
    S = 0.048304259;
  } else if (Age_Months < 128) {
    L = 0.516433004;
    M = 141.6645592;
    S = 0.048414893;
  } else if (Age_Months < 129) {
    L = 0.513006312;
    M = 142.072452;
    S = 0.048523648;
  } else if (Age_Months < 130) {
    L = 0.508352901;
    M = 142.4823852;
    S = 0.048630402;
  } else if (Age_Months < 131) {
    L = 0.502547502;
    M = 142.8949403;
    S = 0.04873505;
  } else if (Age_Months < 132) {
    L = 0.495696454;
    M = 143.3107241;
    S = 0.048837504;
  } else if (Age_Months < 133) {
    L = 0.487939275;
    M = 143.7303663;
    S = 0.048937694;
  } else if (Age_Months < 134) {
    L = 0.479449924;
    M = 144.1545167;
    S = 0.049035564;
  } else if (Age_Months < 135) {
    L = 0.470437652;
    M = 144.5838414;
    S = 0.049131073;
  } else if (Age_Months < 136) {
    L = 0.461147305;
    M = 145.0190192;
    S = 0.049224189;
  } else if (Age_Months < 137) {
    L = 0.451858946;
    M = 145.4607359;
    S = 0.049314887;
  } else if (Age_Months < 138) {
    L = 0.442886661;
    M = 145.9096784;
    S = 0.049403145;
  } else if (Age_Months < 139) {
    L = 0.434576385;
    M = 146.3665278;
    S = 0.049488934;
  } else if (Age_Months < 140) {
    L = 0.427302633;
    M = 146.8319513;
    S = 0.049572216;
  } else if (Age_Months < 141) {
    L = 0.421464027;
    M = 147.3065929;
    S = 0.049652935;
  } else if (Age_Months < 142) {
    L = 0.417477538;
    M = 147.7910635;
    S = 0.049731004;
  } else if (Age_Months < 143) {
    L = 0.415771438;
    M = 148.2859294;
    S = 0.0498063;
  } else if (Age_Months < 144) {
    L = 0.416777012;
    M = 148.7917006;
    S = 0.04987865;
  } else if (Age_Months < 145) {
    L = 0.420919142;
    M = 149.3088178;
    S = 0.049947823;
  } else if (Age_Months < 146) {
    L = 0.428606007;
    M = 149.8376391;
    S = 0.050013518;
  } else if (Age_Months < 147) {
    L = 0.440218167;
    M = 150.3784267;
    S = 0.050075353;
  } else if (Age_Months < 148) {
    L = 0.456097443;
    M = 150.9313331;
    S = 0.050132858;
  } else if (Age_Months < 149) {
    L = 0.476536014;
    M = 151.4963887;
    S = 0.050185471;
  } else if (Age_Months < 150) {
    L = 0.501766234;
    M = 152.0734897;
    S = 0.050232532;
  } else if (Age_Months < 151) {
    L = 0.531951655;
    M = 152.6623878;
    S = 0.050273285;
  } else if (Age_Months < 152) {
    L = 0.567179725;
    M = 153.2626819;
    S = 0.050306885;
  } else if (Age_Months < 153) {
    L = 0.607456565;
    M = 153.8738124;
    S = 0.050332406;
  } else if (Age_Months < 154) {
    L = 0.652704121;
    M = 154.495058;
    S = 0.05034886;
  } else if (Age_Months < 155) {
    L = 0.702759868;
    M = 155.1255365;
    S = 0.050355216;
  } else if (Age_Months < 156) {
    L = 0.757379106;
    M = 155.7642086;
    S = 0.050350423;
  } else if (Age_Months < 157) {
    L = 0.816239713;
    M = 156.4098858;
    S = 0.050333444;
  } else if (Age_Months < 158) {
    L = 0.878947416;
    M = 157.0612415;
    S = 0.050303283;
  } else if (Age_Months < 159) {
    L = 0.945053486;
    M = 157.7168289;
    S = 0.050259018;
  } else if (Age_Months < 160) {
    L = 1.014046108;
    M = 158.3750929;
    S = 0.050199837;
  } else if (Age_Months < 161) {
    L = 1.085383319;
    M = 159.034399;
    S = 0.050125062;
  } else if (Age_Months < 162) {
    L = 1.158487278;
    M = 159.6930501;
    S = 0.05003418;
  } else if (Age_Months < 163) {
    L = 1.232768816;
    M = 160.3493168;
    S = 0.049926861;
  } else if (Age_Months < 164) {
    L = 1.307628899;
    M = 161.0014586;
    S = 0.049802977;
  } else if (Age_Months < 165) {
    L = 1.382473225;
    M = 161.6477515;
    S = 0.04966261;
  } else if (Age_Months < 166) {
    L = 1.456720479;
    M = 162.2865119;
    S = 0.049506051;
  } else if (Age_Months < 167) {
    L = 1.529810247;
    M = 162.9161202;
    S = 0.049333801;
  } else if (Age_Months < 168) {
    L = 1.601219573;
    M = 163.535045;
    S = 0.049146553;
  } else if (Age_Months < 169) {
    L = 1.670433444;
    M = 164.1418486;
    S = 0.04894519;
  } else if (Age_Months < 170) {
    L = 1.736995571;
    M = 164.7352199;
    S = 0.048730749;
  } else if (Age_Months < 171) {
    L = 1.800483802;
    M = 165.3139755;
    S = 0.048504404;
  } else if (Age_Months < 172) {
    L = 1.860518777;
    M = 165.8770715;
    S = 0.048267442;
  } else if (Age_Months < 173) {
    L = 1.916765525;
    M = 166.4236087;
    S = 0.04802123;
  } else if (Age_Months < 174) {
    L = 1.968934444;
    M = 166.9528354;
    S = 0.047767192;
  } else if (Age_Months < 175) {
    L = 2.016781776;
    M = 167.4641466;
    S = 0.047506783;
  } else if (Age_Months < 176) {
    L = 2.060109658;
    M = 167.9570814;
    S = 0.047241456;
  } else if (Age_Months < 177) {
    L = 2.098765817;
    M = 168.4313175;
    S = 0.04697265;
  } else if (Age_Months < 178) {
    L = 2.132642948;
    M = 168.8866644;
    S = 0.046701759;
  } else if (Age_Months < 179) {
    L = 2.16167779;
    M = 169.3230548;
    S = 0.046430122;
  } else if (Age_Months < 180) {
    L = 2.185849904;
    M = 169.7405351;
    S = 0.046159004;
  } else if (Age_Months < 181) {
    L = 2.205180153;
    M = 170.139255;
    S = 0.045889585;
  } else if (Age_Months < 182) {
    L = 2.219728869;
    M = 170.5194567;
    S = 0.045622955;
  } else if (Age_Months < 183) {
    L = 2.2295937;
    M = 170.881464;
    S = 0.045360101;
  } else if (Age_Months < 184) {
    L = 2.234907144;
    M = 171.2256717;
    S = 0.045101913;
  } else if (Age_Months < 185) {
    L = 2.235833767;
    M = 171.5525345;
    S = 0.044849174;
  } else if (Age_Months < 186) {
    L = 2.232567138;
    M = 171.8625576;
    S = 0.044602566;
  } else if (Age_Months < 187) {
    L = 2.2253265;
    M = 172.1562865;
    S = 0.044362674;
  } else if (Age_Months < 188) {
    L = 2.214353232;
    M = 172.4342983;
    S = 0.044129985;
  } else if (Age_Months < 189) {
    L = 2.199905902;
    M = 172.6971935;
    S = 0.043904897;
  } else if (Age_Months < 190) {
    L = 2.182262864;
    M = 172.9455898;
    S = 0.043687723;
  } else if (Age_Months < 191) {
    L = 2.161704969;
    M = 173.180112;
    S = 0.043478698;
  } else if (Age_Months < 192) {
    L = 2.138524662;
    M = 173.4013896;
    S = 0.043277987;
  } else if (Age_Months < 193) {
    L = 2.113023423;
    M = 173.6100518;
    S = 0.043085685;
  } else if (Age_Months < 194) {
    L = 2.085490286;
    M = 173.8067179;
    S = 0.042901835;
  } else if (Age_Months < 195) {
    L = 2.0562195;
    M = 173.9919998;
    S = 0.042726424;
  } else if (Age_Months < 196) {
    L = 2.025496648;
    M = 174.1664951;
    S = 0.042559396;
  } else if (Age_Months < 197) {
    L = 1.993598182;
    M = 174.3307855;
    S = 0.042400652;
  } else if (Age_Months < 198) {
    L = 1.960789092;
    M = 174.4854344;
    S = 0.042250063;
  } else if (Age_Months < 199) {
    L = 1.927320937;
    M = 174.6309856;
    S = 0.042107465;
  } else if (Age_Months < 200) {
    L = 1.89343024;
    M = 174.7679617;
    S = 0.041972676;
  } else if (Age_Months < 201) {
    L = 1.859337259;
    M = 174.8968634;
    S = 0.041845488;
  } else if (Age_Months < 202) {
    L = 1.825245107;
    M = 175.0181691;
    S = 0.041725679;
  } else if (Age_Months < 203) {
    L = 1.791339209;
    M = 175.1323345;
    S = 0.041613015;
  } else if (Age_Months < 204) {
    L = 1.757787065;
    M = 175.2397926;
    S = 0.041507249;
  } else if (Age_Months < 205) {
    L = 1.724738292;
    M = 175.340954;
    S = 0.041408129;
  } else if (Age_Months < 206) {
    L = 1.692324905;
    M = 175.4362071;
    S = 0.041315398;
  } else if (Age_Months < 207) {
    L = 1.660661815;
    M = 175.5259191;
    S = 0.041228796;
  } else if (Age_Months < 208) {
    L = 1.629847495;
    M = 175.6104358;
    S = 0.04114806;
  } else if (Age_Months < 209) {
    L = 1.599964788;
    M = 175.690083;
    S = 0.041072931;
  } else if (Age_Months < 210) {
    L = 1.571081817;
    M = 175.7651671;
    S = 0.04100315;
  } else if (Age_Months < 211) {
    L = 1.543252982;
    M = 175.8359757;
    S = 0.040938463;
  } else if (Age_Months < 212) {
    L = 1.516519998;
    M = 175.9027788;
    S = 0.040878617;
  } else if (Age_Months < 213) {
    L = 1.490912963;
    M = 175.9658293;
    S = 0.040823368;
  } else if (Age_Months < 214) {
    L = 1.466451429;
    M = 176.0253641;
    S = 0.040772475;
  } else if (Age_Months < 215) {
    L = 1.44314546;
    M = 176.081605;
    S = 0.040725706;
  } else if (Age_Months < 216) {
    L = 1.420996665;
    M = 176.1347593;
    S = 0.040682834;
  } else if (Age_Months < 217) {
    L = 1.399999187;
    M = 176.1850208;
    S = 0.04064364;
  } else if (Age_Months < 218) {
    L = 1.380140651;
    M = 176.2325707;
    S = 0.040607913;
  } else if (Age_Months < 219) {
    L = 1.361403047;
    M = 176.2775781;
    S = 0.040575448;
  } else if (Age_Months < 220) {
    L = 1.343763564;
    M = 176.3202008;
    S = 0.040546051;
  } else if (Age_Months < 221) {
    L = 1.327195355;
    M = 176.3605864;
    S = 0.040519532;
  } else if (Age_Months < 222) {
    L = 1.311668242;
    M = 176.3988725;
    S = 0.040495713;
  } else if (Age_Months < 223) {
    L = 1.297149359;
    M = 176.4351874;
    S = 0.040474421;
  } else if (Age_Months < 224) {
    L = 1.283603728;
    M = 176.469651;
    S = 0.040455493;
  } else if (Age_Months < 225) {
    L = 1.270994782;
    M = 176.5023751;
    S = 0.040438773;
  } else if (Age_Months < 226) {
    L = 1.25928483;
    M = 176.533464;
    S = 0.040424111;
  } else if (Age_Months < 227) {
    L = 1.248435461;
    M = 176.5630153;
    S = 0.040411366;
  } else if (Age_Months < 228) {
    L = 1.23840791;
    M = 176.5911197;
    S = 0.040400405;
  } else if (Age_Months < 229) {
    L = 1.229163362;
    M = 176.6178621;
    S = 0.040391101;
  } else if (Age_Months < 230) {
    L = 1.220663228;
    M = 176.6433219;
    S = 0.040383334;
  } else if (Age_Months < 231) {
    L = 1.212869374;
    M = 176.6675729;
    S = 0.04037699;
  } else if (Age_Months < 232) {
    L = 1.20574431;
    M = 176.6906844;
    S = 0.040371962;
  } else if (Age_Months < 233) {
    L = 1.199251356;
    M = 176.712721;
    S = 0.040368149;
  } else if (Age_Months < 234) {
    L = 1.19335477;
    M = 176.733743;
    S = 0.040365456;
  } else if (Age_Months < 235) {
    L = 1.188019859;
    M = 176.753807;
    S = 0.040363795;
  } else if (Age_Months < 236) {
    L = 1.183213059;
    M = 176.7729657;
    S = 0.04036308;
  } else if (Age_Months < 237) {
    L = 1.178901998;
    M = 176.7912687;
    S = 0.040363233;
  } else if (Age_Months < 238) {
    L = 1.175055543;
    M = 176.8087622;
    S = 0.040364179;
  } else if (Age_Months < 239) {
    L = 1.171643828;
    M = 176.8254895;
    S = 0.04036585;
  } else if (Age_Months < 240) {
    L = 1.16863827;
    M = 176.8414914;
    S = 0.04036818;
  }
  return L === 0 || S === 0 ? 0 : (Math.pow(Height / M, L) - 1) / (L * S);
}
//Funcion que calcula el percentilo en a partir de un valor Z dado
function getZPercentilo(z) {
  let n = new Array();

  if (z === 0) return 0;

  n[0] = 50;
  n[1] = 50.399;
  n[2] = 50.798;
  n[3] = 51.197;
  n[4] = 51.595;
  n[5] = 51.994;
  n[6] = 52.392;
  n[7] = 52.79;
  n[8] = 53.188;
  n[9] = 53.586;
  n[10] = 53.983;
  n[11] = 54.38;
  n[12] = 54.776;
  n[13] = 55.172;
  n[14] = 55.567;
  n[15] = 55.962;
  n[16] = 56.356;
  n[17] = 56.749;
  n[18] = 57.142;
  n[19] = 57.535;
  n[20] = 57.926;
  n[21] = 58.317;
  n[22] = 58.706;
  n[23] = 59.095;
  n[24] = 59.483;
  n[25] = 59.871;
  n[26] = 60.257;
  n[27] = 60.642;
  n[28] = 61.026;
  n[29] = 61.409;
  n[30] = 61.791;
  n[31] = 62.172;
  n[32] = 62.552;
  n[33] = 62.93;
  n[34] = 63.307;
  n[35] = 63.683;
  n[36] = 64.058;
  n[37] = 64.431;
  n[38] = 64.803;
  n[39] = 65.173;
  n[40] = 65.542;
  n[41] = 65.91;
  n[42] = 66.276;
  n[43] = 66.64;
  n[44] = 67.003;
  n[45] = 67.364;
  n[46] = 67.724;
  n[47] = 68.082;
  n[48] = 68.439;
  n[49] = 68.793;
  n[50] = 69.146;
  n[51] = 69.497;
  n[52] = 69.847;
  n[53] = 70.194;
  n[54] = 70.54;
  n[55] = 70.884;
  n[56] = 71.226;
  n[57] = 71.566;
  n[58] = 71.904;
  n[59] = 72.24;
  n[60] = 72.575;
  n[61] = 72.907;
  n[62] = 73.237;
  n[63] = 73.565;
  n[64] = 73.891;
  n[65] = 74.215;
  n[66] = 74.537;
  n[67] = 74.857;
  n[68] = 75.175;
  n[69] = 75.49;
  n[70] = 75.804;
  n[71] = 76.115;
  n[72] = 76.424;
  n[73] = 76.73;
  n[74] = 77.035;
  n[75] = 77.337;
  n[76] = 77.637;
  n[77] = 77.935;
  n[78] = 78.23;
  n[79] = 78.524;
  n[80] = 78.814;
  n[81] = 79.103;
  n[82] = 79.389;
  n[83] = 79.673;
  n[84] = 79.955;
  n[85] = 80.234;
  n[86] = 80.511;
  n[87] = 80.785;
  n[88] = 81.057;
  n[89] = 81.327;
  n[90] = 81.594;
  n[91] = 81.859;
  n[92] = 82.121;
  n[93] = 82.381;
  n[94] = 82.639;
  n[95] = 82.894;
  n[96] = 83.147;
  n[97] = 83.398;
  n[98] = 83.646;
  n[99] = 83.891;
  n[100] = 84.134;
  n[101] = 84.375;
  n[102] = 84.614;
  n[103] = 84.849;
  n[104] = 85.083;
  n[105] = 85.314;
  n[106] = 85.543;
  n[107] = 85.769;
  n[108] = 85.993;
  n[109] = 86.214;
  n[110] = 86.433;
  n[111] = 86.65;
  n[112] = 86.864;
  n[113] = 87.076;
  n[114] = 87.286;
  n[115] = 87.493;
  n[116] = 87.698;
  n[117] = 87.9;
  n[118] = 88.1;
  n[119] = 88.298;
  n[120] = 88.493;
  n[121] = 88.686;
  n[122] = 88.877;
  n[123] = 89.065;
  n[124] = 89.251;
  n[125] = 89.435;
  n[126] = 89.617;
  n[127] = 89.796;
  n[128] = 89.973;
  n[129] = 90.147;
  n[130] = 90.32;
  n[131] = 90.49;
  n[132] = 90.658;
  n[133] = 90.824;
  n[134] = 90.988;
  n[135] = 91.149;
  n[136] = 91.308;
  n[137] = 91.466;
  n[138] = 91.621;
  n[139] = 91.774;
  n[140] = 91.924;
  n[141] = 92.073;
  n[142] = 92.22;
  n[143] = 92.364;
  n[144] = 92.507;
  n[145] = 92.647;
  n[146] = 92.785;
  n[147] = 92.922;
  n[148] = 93.056;
  n[149] = 93.189;
  n[150] = 93.319;
  n[151] = 93.448;
  n[152] = 93.574;
  n[153] = 93.699;
  n[154] = 93.822;
  n[155] = 93.943;
  n[156] = 94.062;
  n[157] = 94.179;
  n[158] = 94.295;
  n[159] = 94.408;
  n[160] = 94.52;
  n[161] = 94.63;
  n[162] = 94.738;
  n[163] = 94.845;
  n[164] = 94.95;
  n[165] = 95.053;
  n[166] = 95.154;
  n[167] = 95.254;
  n[168] = 95.352;
  n[169] = 95.449;
  n[170] = 95.543;
  n[171] = 95.637;
  n[172] = 95.728;
  n[173] = 95.818;
  n[174] = 95.907;
  n[175] = 95.994;
  n[176] = 96.08;
  n[177] = 96.164;
  n[178] = 96.246;
  n[179] = 96.327;
  n[180] = 96.407;
  n[181] = 96.485;
  n[182] = 96.562;
  n[183] = 96.638;
  n[184] = 96.712;
  n[185] = 96.784;
  n[186] = 96.856;
  n[187] = 96.926;
  n[188] = 96.995;
  n[189] = 97.062;
  n[190] = 97.128;
  n[191] = 97.193;
  n[192] = 97.257;
  n[193] = 97.32;
  n[194] = 97.381;
  n[195] = 97.441;
  n[196] = 97.5;
  n[197] = 97.558;
  n[198] = 97.615;
  n[199] = 97.67;
  n[200] = 97.725;
  n[201] = 97.778;
  n[202] = 97.831;
  n[203] = 97.882;
  n[204] = 97.932;
  n[205] = 97.982;
  n[206] = 98.03;
  n[207] = 98.077;
  n[208] = 98.124;
  n[209] = 98.169;
  n[210] = 98.214;
  n[211] = 98.257;
  n[212] = 98.3;
  n[213] = 98.341;
  n[214] = 98.382;
  n[215] = 98.422;
  n[216] = 98.461;
  n[217] = 98.5;
  n[218] = 98.537;
  n[219] = 98.574;
  n[220] = 98.61;
  n[221] = 98.645;
  n[222] = 98.679;
  n[223] = 98.713;
  n[224] = 98.745;
  n[225] = 98.778;
  n[226] = 98.809;
  n[227] = 98.84;
  n[228] = 98.87;
  n[229] = 98.899;
  n[230] = 98.928;
  n[231] = 98.956;
  n[232] = 98.983;
  n[233] = 99.01;
  n[234] = 99.036;
  n[235] = 99.061;
  n[236] = 99.086;
  n[237] = 99.111;
  n[238] = 99.134;
  n[239] = 99.158;
  n[240] = 99.18;
  n[241] = 99.202;
  n[242] = 99.224;
  n[243] = 99.245;
  n[244] = 99.266;
  n[245] = 99.286;
  n[246] = 99.305;
  n[247] = 99.324;
  n[248] = 99.343;
  n[249] = 99.361;
  n[250] = 99.379;
  n[251] = 99.396;
  n[252] = 99.413;
  n[253] = 99.43;
  n[254] = 99.446;
  n[255] = 99.461;
  n[256] = 99.477;
  n[257] = 99.492;
  n[258] = 99.506;
  n[259] = 99.52;
  n[260] = 99.534;
  n[261] = 99.547;
  n[262] = 99.56;
  n[263] = 99.573;
  n[264] = 99.585;
  n[265] = 99.598;
  n[266] = 99.609;
  n[267] = 99.621;
  n[268] = 99.632;
  n[269] = 99.643;
  n[270] = 99.653;
  n[271] = 99.664;
  n[272] = 99.674;
  n[273] = 99.683;
  n[274] = 99.693;
  n[275] = 99.702;
  n[276] = 99.711;
  n[277] = 99.72;
  n[278] = 99.728;
  n[279] = 99.736;
  n[280] = 99.744;
  n[281] = 99.752;
  n[282] = 99.76;
  n[283] = 99.767;
  n[284] = 99.774;
  n[285] = 99.781;
  n[286] = 99.788;
  n[287] = 99.795;
  n[288] = 99.801;
  n[289] = 99.807;
  n[290] = 99.813;
  n[291] = 99.819;
  n[292] = 99.825;
  n[293] = 99.831;
  n[294] = 99.836;
  n[295] = 99.841;
  n[296] = 99.846;
  n[297] = 99.851;
  n[298] = 99.856;
  n[299] = 99.861;
  n[300] = 99.865;
  n[301] = 99.869;
  n[302] = 99.874;
  n[303] = 99.878;
  n[304] = 99.882;
  n[305] = 99.886;
  n[306] = 99.889;
  n[307] = 99.893;
  n[308] = 99.896;
  n[309] = 99.9;

  let az = Math.abs(z);
  if (z < -3.09) return 0.1;
  if (z > 3.09) return 99.9;
  let thispercentile = n[Math.round(az * 100)];
  if (z >= 0) {
    return String(thispercentile);
  } else {
    return String(100 - thispercentile);
  }
}

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

function isFutureDate(fecha) {
  var today = moment(new Date(), "YYYY-MM-DD");
  
  return moment.duration(moment(fecha).diff(today)).asDays() > 0;
}

function GetTodayDate() {
  const d = new Date();

  let day = d.getDate()
  let month = d.getMonth()+1
  let year = d.getFullYear().toString()

  let monthStr = month < 10 ? "0"+month.toString() : month.toString();
  let dayStr = day < 10 ? "0"+day.toString() : day.toString();

  return year+"-"+monthStr+"-"+dayStr;
}

//---------------------------------------------------------------------------//
//FORMULARIO
//---------------------------------------------------------------------------//

const FormularioSeguimiento = (props) => {
  const state = useSelector((state) => state.paciente);
  const stateAuth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [mostrarValidacion, setMostrarValidacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [seguimientoCargado, setSeguimientoCargado] = useState(false);

  const [validationFailed, setValidationFailed] = useState(false);


  const { match } = props;
  console.log("🚀 ~ file: FormularioSeguimiento.js ~ line 2852 ~ FormularioSeguimiento ~ match", match)

  useEffect(() => {
    if (state.modificarSeguimiento && !seguimientoCargado) {
      const { id = -1, sid = null } = match.params;

      if (id !== -1 && sid && Object.keys(state.seguimientoPaciente).length === 0) {
        dispatch(obtenerSeguimientoPaciente(id, sid));
      }
    }

    if (Object.keys(state.seguimientoPaciente).length !== 0) {
      setSeguimientoCargado(true);
      if(state.seguimientoPaciente.hasOwnProperty('seccion1') && state.seguimientoPaciente.seccion1.hasOwnProperty('fechaSeguimiento'))
      {
        fechaSeguimiento_inicial = state.seguimientoPaciente.seccion1.fechaSeguimiento;
        fechaSeguimiento_actual = state.seguimientoPaciente.seccion1.fechaSeguimiento;
        console.log("FECHA inicial " + fechaSeguimiento_inicial);
      }
    }
    
    if (state.agregarSeguimiento || !state.modificarSeguimiento) {
      setSeguimientoCargado(true);
    }

    if(state.modificarSeguimiento)
      setFormData(state.seguimientoPaciente);

  }, [state.seguimientoPaciente]);

  useEffect(() => {
    // if (state.error !== null) {
    //   dispatch(setAlert(state.error, "danger"));
    // } else if (state.agregado) {
    //   dispatch(setAlert("Paciente agregado correctamente!", "success"));
    // }

    if (state.seguimientopaciente !== null) {
      console.log(state.paciente);
    }
  }, [state.error, state.agregado, state.paciente]);




  const onSubmit = ({ formData }, e) => {
    if (state.modificarSeguimiento) 
    {
      dispatch(modificarSeguimientoPaciente(state.paciente._id, state.seguimientoPaciente.id, formData));
      setMensajeConfirmacion('Seguimiento modificado correctamente');
      mostrarConfirmacionAgregado();
    }
    else 
    {
      dispatch(agregarSeguimientoPaciente(state.paciente._id, formData, stateAuth.user._id));
      setMensajeConfirmacion('Seguimiento agregado correctamente');
      mostrarConfirmacionAgregado();
    }
  };

  const onChange = ({ formData }) => {
    const newFormData = cloneDeep(formData);

    if(formData.seccion1.hasOwnProperty('fechaSeguimiento'))
    {
      if(isFutureDate(formData.seccion1.fechaSeguimiento))
      {
        error_fechaSeguimiento_futura = true;
      }
      else{
        error_fechaSeguimiento_futura = false;
      }

      if(state.modificarSeguimiento)
      {
        if(String(formData.seccion1.fechaSeguimiento)!==String(fechaSeguimiento_inicial) && String(formData.seccion1.fechaSeguimiento)!==String(fechaSeguimiento_actual))
        {
          fechaSeguimiento_actual = formData.seccion1.fechaSeguimiento;
          existeSeguimiento(state.paciente._id, formData.seccion1.fechaSeguimiento).then( existe => {
            if(existe)
            {
              console.log("Exsite");
              error_fechaSeguimiento = true;
            }
            else
            {
              console.log("No existe");
              error_fechaSeguimiento = false;
            }
          });
        }
      }
      else
      {
        if(String(formData.seccion1.fechaSeguimiento)!==String(fechaSeguimiento_actual))
        {
          fechaSeguimiento_actual = formData.seccion1.fechaSeguimiento;
          existeSeguimiento(state.paciente._id, formData.seccion1.fechaSeguimiento).then( existe => {
            if(existe)
            {
              console.log("Existe");
              error_fechaSeguimiento = true;
            }
            else
            {
              console.log("No existe");
              error_fechaSeguimiento = false;
            }
          });
        }
      }
    }

    if (
      (formData.seccion2.hasOwnProperty("peso") &&
        formData.seccion2.hasOwnProperty("talla")) ||
      formData.seccion1.hasOwnProperty("fechaSeguimiento") //fecha seguimiento para IMC, para Z además peso y talla
    ) {
      //devuelvo el submit en newFormData para actualizar los estados

      if (formData.seccion1.fechaSeguimiento !== undefined) {
        let fechaNacimiento = moment(
          state.paciente.seccion1.fechaNacimiento,
          "YYYY-MM-DD"
        );
        let fechaSeguimiento = moment(
          formData.seccion1.fechaSeguimiento,
          "YYYY-MM-DD"
        );

        newFormData.seccion1.edadSeguimiento = getAge(
          fechaNacimiento,
          fechaSeguimiento
        );

        let imc;
        let zPeso;
        let zTalla;
        let zImc;
        let percentiloPeso;
        let percentiloTalla;
        let percentiloImc;

        let edadSeguimientoMeses = Math.trunc(
          moment.duration(fechaSeguimiento.diff(fechaNacimiento)).asMonths()
        );
        newFormData.seccion2.imc = "";
        newFormData.seccion2.zPeso = "";
        newFormData.seccion2.zTalla = "";
        newFormData.seccion2.zImc = "";
        newFormData.seccion2.percentiloPeso = "";
        newFormData.seccion2.percentiloTalla = "";
        newFormData.seccion2.percentiloImc = "";
        if (
          formData.seccion2.peso !== undefined &&
          formData.seccion2.talla !== undefined &&
          edadSeguimientoMeses > 24 &&
          edadSeguimientoMeses <= 240
        ) {
          imc = getIMC(formData.seccion2.peso, formData.seccion2.talla);
          zPeso = getZPeso(formData.seccion2.peso, formData.seccion2.talla);
          zTalla = getZTalla(edadSeguimientoMeses, formData.seccion2.talla);
          zImc = getIMC(zPeso, zTalla);
          percentiloPeso = getZPercentilo(zPeso);
          percentiloTalla = getZPercentilo(zTalla);
          percentiloImc = getZPercentilo(zImc);
          newFormData.seccion2.zPeso = String(zPeso.toFixed(2));
          newFormData.seccion2.zTalla = String(zTalla.toFixed(2));
          newFormData.seccion2.zImc = String(zImc.toFixed(2));
          newFormData.seccion2.percentiloPeso = String(percentiloPeso);
          newFormData.seccion2.percentiloTalla = String(percentiloTalla);
          newFormData.seccion2.percentiloImc = String(percentiloImc);
          newFormData.seccion2.imc = String(imc.toFixed(2));
        } else {
          if (
            formData.seccion2.peso !== undefined &&
            formData.seccion2.talla !== undefined &&
            edadSeguimientoMeses >= 12
          ) {
            imc = getIMC(formData.seccion2.peso, formData.seccion2.talla);
            zPeso = getZPeso(formData.seccion2.peso, formData.seccion2.talla);
            zTalla = getZTalla(edadSeguimientoMeses, formData.seccion2.talla);
            zImc = getIMC(zPeso, zTalla);
            percentiloImc = getZPercentilo(zImc);
            newFormData.seccion2.percentiloImc = String(percentiloImc);
            newFormData.seccion2.imc = imc.toFixed(2);
          }
        }
      }
    }

    if(formData.seccion6.hasOwnProperty("seccion7") && formData.seccion6.seccion7.hasOwnProperty("institucion"))
    {     
      const newFormDataMod = cloneDeep(newFormData);
      GetResponsableData(formData.seccion6.seccion7.institucion_provincia, formData.seccion6.seccion7.institucion_departamento, formData.seccion6.seccion7.institucion).then(
        responsableDataMod => {
          newFormDataMod.seccion6.seccion7.nombreResponsableFarmacia = responsableDataMod["nombre"];
          newFormDataMod.seccion6.seccion7.apellidoResponsableFarmacia = responsableDataMod["apellido"];
          newFormDataMod.seccion6.seccion7.emailResponsableFarmacia = responsableDataMod["mail"];
          newFormDataMod.seccion6.seccion7.glnResponsableFarmacia = responsableDataMod["gln"];
          setFormData(newFormDataMod);
        }
      )
    }

    if(formData.seccion6.hasOwnProperty("seccion8") && formData.seccion6.seccion8.hasOwnProperty("institucion"))
    {     
      const newFormDataEnz = cloneDeep(newFormData);
      GetResponsableData(formData.seccion6.seccion8.institucion_provincia, formData.seccion6.seccion8.institucion_departamento, formData.seccion6.seccion8.institucion).then(
        responsableDataEnz => {
          newFormDataEnz.seccion6.seccion8.nombreResponsableFarmacia = responsableDataEnz["nombre"];
          newFormDataEnz.seccion6.seccion8.apellidoResponsableFarmacia = responsableDataEnz["apellido"];
          newFormDataEnz.seccion6.seccion8.emailResponsableFarmacia = responsableDataEnz["mail"];
          newFormDataEnz.seccion6.seccion8.glnResponsableFarmacia = responsableDataEnz["gln"];
          setFormData(newFormDataEnz);
        }
      )
    }

    setFormData(newFormData);
  };

  // redirige al usuario al home una vez agregado
  const mostrarConfirmacionAgregado = () => {
    setMostrarValidacion(true);
    setTimeout(() => {
      dispatch({ type: PACIENTES_INIT });
      history.push(`/paciente/${state.paciente._id}`);
    },2000);
  };

  const validate = (formData, errors) => {

    if(formData.seccion1.fallecimiento==="Sí")
    {
      errors = [];
      if(formData.seccion1.fechaFallecimiento==="" || formData.seccion1.fechaFallecimiento===null)
      {
        errors.seccion1.fechaFallecimiento.addError("Es un valor requerido");
      }
      if(formData.seccion1.causaFallecimiento==="" || formData.seccion1.causaFallecimiento===null)
      {
        errors.seccion1.causaFallecimiento.addError("Es un valor requerido");
      }
    }

    error_inst_dep = false;
    error_inst = false;
    error_inst_dep2 = false;
    error_inst2 = false;

    if(error_fechaSeguimiento)
    {
      errors.seccion1.fechaSeguimiento.addError("Seguimiento existente");
    }

    if(error_fechaSeguimiento_futura)
    {
      errors.seccion1.fechaSeguimiento.addError("Fecha de seguimiento futura");
    }

    if (formData.seccion5.scoreBhalla =! undefined && (formData.seccion5.scoreBhalla < 0 || formData.seccion5.scoreBhalla > 25)) {
      errors.seccion5.scoreBhalla.addError(
        "El de Score Bhalla debe estar entre 0 y 25"
      );
    }

    if(document.getElementById('inputFileModulador')!=null)
    {
      const archivo = document.getElementById('inputFileModulador').files;
      //Muestro el error si no se seleccionó ningún archivo y además el formulario no tenía ya un archivo guardado
      if(archivo.length===0 && ((formData.seccion6).hasOwnProperty('seccion7') && !((formData.seccion6.seccion7).hasOwnProperty('recetaid'))))
      {
        if((formData.seccion6).hasOwnProperty('seccion7') && !((formData.seccion6.seccion7).hasOwnProperty('recetaid')))
        {
          errors.seccion6.seccion7.imagenReceta.addError("Se requiere subir imagen de la prescripción");
        }
      }

      //Si el archivo pesa mas de 1MB
      if(archivo.length>0 && archivo[0].size>1000000)
      {
        errors.seccion6.seccion7.imagenReceta.addError("El archivo supera el límite establecido (1MB)")
      }
    }

    return errors;
  };
  

  function onPreRellenarFormulario() {   
    const ultimoSeguimiento = state.paciente.seguimientos[0]
    let newFormData = cloneDeep(ultimoSeguimiento);
    delete newFormData.id;
    delete newFormData.creadoEn;
    delete newFormData.creadoPor;
    newFormData.seccion1.fechaSeguimiento = GetTodayDate();
    newFormData.seccion1.edadSeguimiento = getAge(moment(state.paciente.seccion1.fechaNacimiento), moment(newFormData.seccion1.fechaSeguimiento));

    setFormData(newFormData);
  }

  const onError = (errors) => {
    setValidationFailed(true);
  };

  return (
    <div className="row">
      <div className="col-12">
      { mostrarValidacion &&
          ( <ModalInformativo title={mensajeConfirmacion} /> )
      }
      { seguimientoCargado && !mostrarValidacion && 
        (
          <>
            <h3>{state.modificarSeguimiento ? 'Modificar seguimiento' : 'Agregar seguimiento'}</h3>
            {state.paciente.hasOwnProperty('seguimientos') && state.paciente.seguimientos.length!==0 &&  
                (<button className='btn btn-sm btn-primary' onClick={onPreRellenarFormulario}><FontAwesomeIcon icon={faFile} className="mr-2" />Pre-llenar formulario</button>)}
            <div id="formulario" className={mostrarValidacion ? "d-none" : ""}>
              <JSONSchemaForm
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                fields={fields}
                showErrorList={false}
                onSubmit={onSubmit}
                validate={validate}
                onChange={onChange}
                onError={onError}
                transformErrors={transformErrors}
                noHtml5Validate
              >
                <div className="text-center mt-n3 mb-3">
                  { validationFailed && (<h4 className="text-danger">Se requiere completar todos los campos obligatorios (*)</h4>)}
                  <button className="btn btn-success" type="submit">{state.modificarSeguimiento ? 'Modificar seguimiento' : 'Agregar seguimiento'}</button>
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
export default FormularioSeguimiento;
