var nameConvertido ="";
var idConvertido="";
var idDestino="INGRESE AQUI EL ID DEL ARCHIVO GOOGLE_SHEETS QUE SERA ACTUALIZADO"
function procesarDatos(e) {

  var archivoId = e.response.getItemResponses()[0].getResponse();
  var archivo = DriveApp.getFileById(archivoId);
  var name = archivo.getName();
  nameConvertido = name;
  var id = archivo.getId();
  var blob = archivo.getBlob();

  var nvalPrueba = {
    title: "Convertido " + name,
    parents: archivo.getParents().next().getId(),
    mimeType: MimeType.GOOGLE_SHEETS
  }
  console.log(nvalPrueba);
  var hcg = Drive.Files.insert(nvalPrueba,blob,{convert:true});
  console.log(hcg);
  var enlace = hcg.alternateLink;
  var id = hcg.id;
  idConvertido = id;
  console.log(enlace);
  borrarCabecera(id);
  copiarDatos(id);
}

function borrarCabecera(id){  
  var archivo = SpreadsheetApp.openById(id);
  var numHojas = archivo.getSheets().length;
  for (var i = 0; i < numHojas; i++) {
    var hoja = archivo.getSheets()[i];
    hoja.deleteRow(1); 
  }
}

function copiarDatos(idOrigen){
  var destino = SpreadsheetApp.openById(idDestino);
  var origen = SpreadsheetApp.openById(idOrigen);
  var numHojas = destino.getNumSheets();
  for (var i = 0; i < numHojas; i++) {
    var hojaDestino = destino.getSheets()[i];
    var hojaOrigen = origen.getSheets()[i];
    var datos = hojaOrigen.getRange(1, 1, hojaOrigen.getLastRow() - 1, hojaOrigen.getLastColumn()).getValues();
    for (var j = 0; j < datos.length; j++) {
      hojaDestino.appendRow(datos[j]);
    }
  }

}
