import axios from "axios";

/*export const GetResponsableData = (institucion_provincia, institucion_departamento, institucion) => {

    var responsableData = {
        nombre: "",
        apellido: "",
        mail: "",
        gln: ""
    };

    if(institucion_provincia.toLowerCase() == "santa fe") {
        if(institucion==="CEMAFE HEROES DE MALVINAS")
        {
            responsableData["nombre"] = "Marcos";
            responsableData["apellido"] = "Araya";
            responsableData["mail"] = "farmaciacemafe@santafe.gov.ar";
            responsableData["gln"] = "9990509210004";
        }
        else if(institucion==="HOSPITAL DE NIÑOS DR. ORLANDO ALASSIA")
        {
            responsableData["nombre"] = "Natalia";
            responsableData["apellido"] = "Franzini";
            responsableData["mail"] = "farmaciaalassia@gmail.com";
            responsableData["gln"] = "9992031000009";
        }
        else if(institucion==="HOSPITAL DE NIÑOS VILELA")
        {
            responsableData["nombre"] = "Miriam";
            responsableData["apellido"] = "Ferrara";
            responsableData["mail"] = "mferrar2@rosario.gov.ar";
            responsableData["gln"] = "9992011500024";
        }
        else if(institucion==="CENTRO DE ESPECIALIDADES MEDICAS AMBULATORIAS (CEMAR)")
        {
            responsableData["nombre"] = "Mariana";
            responsableData["apellido"] = "Lopez Siboldi";
            responsableData["mail"] = "mlopezs0@rosario.gov.ar";
            responsableData["gln"] = "9992011500017";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "buenos aires") {
        if(institucion==="HOSPITAL ZONAL ESPECIALIZADO AGUDOS Y CRONICOS DR. CETRANGOLO")
        {
            responsableData["nombre"] = "Silvana";
            responsableData["apellido"] = "Correa";
            responsableData["mail"] = "fqadultoscetrangolo@gmail.com";
            responsableData["gln"] = "";
        }
        else if(institucion==="HOSPITAL ZONAL DE AGUDOS ESPECIALIZADO EN PEDIATRIA SOR MARIA LUDOVICA")
        {
            responsableData["nombre"] = "Angélica";
            responsableData["apellido"] = "García";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
        else
        {
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "caba") {
        if(institucion==="HOSPITAL DE PEDIATRIA DR. JUAN P. GARRAHAN")
        {
            responsableData["nombre"] = "Paola";
            responsableData["apellido"] = "Pineda";
            responsableData["mail"] = "farmacia@garrahan.gov.ar";
            responsableData["gln"] = "7798171880004";
        }
        else if(institucion==="HOSPITAL ITALIANO DE BUENOS AIRES")
        {
            responsableData["nombre"] = "Martín";
            responsableData["apellido"] = "Silveira";
            responsableData["mail"] = "martin.silveira@hospitalitaliano.org.ar";
            responsableData["gln"] = "9991277600004";
        }
        else if(institucion==="HOSPITAL GENERAL DE NIÑOS DR. RICARDO GUTIERREZ")
        {
            responsableData["nombre"] = "María Fernanda";
            responsableData["apellido"] = "Colandrea";
            responsableData["mail"] = "gutierrez_farmacia@buenosaires.gob.ar";
            responsableData["gln"] = "9991301000015";
        }
        else if(institucion==="HOSPITAL DE INFECCIOSAS FRANCISCO MUÑIZ")
        {
            responsableData["nombre"] = "Silvia";
            responsableData["apellido"] = "Krugliansky";
            responsableData["mail"] = "munizfarmaciacentral@gmail.com";
            responsableData["gln"] = "9991301000084";
        }
        else if(institucion==="HOSPITAL GENERAL DE NIÑOS PEDRO DE ELIZALDE")
        {
            responsableData["nombre"] = "Rosana";
            responsableData["apellido"] = "Vaccaro";
            responsableData["mail"] = "elizalde_farmacia@buenosaires.gob.ar";
            responsableData["gln"] = "9991301000084";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "córdoba") {
        if(institucion==="HOSPITAL DE NIÑOS DE LA SANTISIMA TRINIDAD")
        {
            responsableData["nombre"] = "Claudia";
            responsableData["apellido"] = "Montivero";
            responsableData["mail"] = "clau_montiv@hotmail.com";
            responsableData["gln"] = "";
        }
        else if(institucion==="HOSPITAL SAN ROQUE")
        {
            responsableData["nombre"] = "María Beatriz";
            responsableData["apellido"] = "Chayep";
            responsableData["mail"] = "farmaciasanroque5@gmail.com";
            responsableData["gln"] = "9990035500006";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "la pampa") {
        if(institucion==="ESTABLECIMIENTO ASISTENCIAL DR. LUCIO MOLAS")
        {
            responsableData["nombre"] = "Rolando";
            responsableData["apellido"] = "Diez";
            responsableData["mail"] = "rolidiez@hotmail.com";
            responsableData["gln"] = "9992004600007";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "la rioja") {
        if(institucion==="HOSPITAL DE LA MADRE Y EL NIÑO (LA RIOJA) - CAPITAL")
        {
            responsableData["nombre"] = "Griselda Elizabeth";
            responsableData["apellido"] = "Molino";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "mendoza") {
        if(institucion==="HOSPITAL HUMBERTO J. NOTTI.-")
        {
            responsableData["nombre"] = "Miranda";
            responsableData["apellido"] = "Faride";
            responsableData["mail"] = "farmacianotti@live.com.ar";
            responsableData["gln"] = "9992027000006";
        }
        else if(institucion==="HOSPITAL LUIS C. LAGOMAGGIORE.-")
        {
            responsableData["nombre"] = "María Elizabeth";
            responsableData["apellido"] = "Pi";
            responsableData["mail"] = "farmacia-lagomaggiore@mendoza.gov.ar";
            responsableData["gln"] = "9992074800000";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "misiones") {
        if(institucion==="HOSPITAL PUBLICO PROVINCIAL DE PEDIATRIA DE AUTOGESTION NIVEL III DR. FERNANDO BARREYRO")
        {
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "dir_farmacia@yahoo.com.ar";
            responsableData["gln"] = "";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "neuquén") {
        if(institucion==="HTAL PROV NEUQUEN - DR EDUARDO CASTRO RENDON")
        {
            responsableData["nombre"] = "Daiana";
            responsableData["apellido"] = "Campo";
            responsableData["mail"] = "medicamentos.nqn@gmail.com";
            responsableData["gln"] = "";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "río negro") {
        if(institucion==="HOSPITAL AREA PROGRAMA CIPOLLETTI DR. PEDRO MOGUILLANSKY")
        {
            responsableData["nombre"] = "Julio";
            responsableData["apellido"] = "Allue";
            responsableData["mail"] = "farmacia@hospital-cipolletti.com.ar";
            responsableData["gln"] = "9980470260009";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "santa cruz") {
        if(institucion==="HOSPITAL REGIONAL RIO GALLEGOS")
        {
            responsableData["nombre"] = "Verónica";
            responsableData["apellido"] = "Álvarez";
            responsableData["mail"] = "vero1alvarez@hotmail.com";
            responsableData["gln"] = "9991277300614";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "tierra del fuego") {
        if(institucion==="HOSPITAL REGIONAL USHUAIA GOBERNADOR ERNESTO M. CAMPOS")
        {
            responsableData["nombre"] = "Juan Pablo";
            responsableData["apellido"] = "González";
            responsableData["mail"] = "jpgonzalez@tierradelfuego.gob.ar";
            responsableData["gln"] = "9992014200006";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else if(institucion_provincia.toLowerCase() == "tucumán") {
        if(institucion==="HOSPITAL DEL NIÑO JESUS")
        {
            responsableData["nombre"] = "Claudia";
            responsableData["apellido"] = "Páez";
            responsableData["mail"] = "farmhnj@gmail.com";
            responsableData["gln"] = "9992043000004";
        }
        else{
            responsableData["nombre"] = "";
            responsableData["apellido"] = "";
            responsableData["mail"] = "";
            responsableData["gln"] = "";
        }
    }
    else {
        responsableData["nombre"] = "";
        responsableData["apellido"] = "";
        responsableData["mail"] = "";
        responsableData["gln"] = "";
    }

    return responsableData;
}
*/

export async function GetResponsableData(institucion_provincia, institucion_departamento, institucion)
{
    var responsableData = {
        nombre: "",
        apellido: "",
        mail: "",
        gln: ""
    };

  try{
    
    const config = { header: { "Content-Type": "application/json" } };

    const res = await axios.get(`/api/responsables/${institucion_provincia}/${institucion_departamento}/${institucion}`, config);
    
    responsableData["nombre"] = res.data.data.nombre;
    responsableData["apellido"] = res.data.data.apellido;
    responsableData["mail"] = res.data.data.mail;
    responsableData["gln"] = res.data.data.gln;

    console.log(responsableData)
    return responsableData;
  }
  catch{
    return responsableData;
  }
}