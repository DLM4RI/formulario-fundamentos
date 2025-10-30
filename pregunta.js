
// ============================================= //
//       Asignacion de variables globales        //
// ============================================ //

document.getElementById("guardar").disabled = true


let respuestaSeleccionada = 0;
let pantalla = document.getElementById("pregunta_pantalla")

// OBJECT o Objeto que alamcena los datos de la pregunta

let pregunta_dates = {
  pregunta: "",
  opciones: [],
  respuesta: 0,
  retroalimentacion: ""
}

// se asigna o ocula el contenedor de "numero de opciones"  //

document.getElementById("contenedor").style.display = "none"


// funcion que crea el # de opciones para que el usuario establezca el "texto"

function nopciones() {

  let numeroOpciones = parseInt(document.getElementById("numeroOpciones").value)
  let cajas = '';

  // establececmos un valor maximo de opciones para que no se sature la memoria
  if (numeroOpciones < 5) {



    // ciclo for que crea el # de opciones 
    for (let n = 1; n <= numeroOpciones; n++)
      cajas += `<div class="row mb-2 justify-content-center">
                  <div class="col-6">
                     <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="${n}" placeholder="pregunta${n}">
                     <label for="floatingInput">Opcion ${n}</label>
                  </div>
                  </div>
              </div>`
          
  } else {


    // se le devuelve al usuariro un toast que diga que puso valores exagerados o incorrectos
    // a su vez se eliminan las cajas creadas en dado caso si se crearon


    cajas = ''
    mostrarToast("Caracteres Invalidos o Demasiadas Opciones")
    document.getElementById("numeroOpciones").value = '';
    document.getElementById("contenedorOpciones").innerHTML = "";
    return


  }


  document.getElementById("contenedorOpciones").innerHTML = cajas

  if (cajas == '')
    document.getElementById("contenedor").style.display = "none"
  else
    document.getElementById("contenedor").style.display = "block"


  Validacion_Correcta()

};




function guardar() {


  let numeroOpciones = parseInt(document.getElementById("numeroOpciones").value)
  pregunta_dates.pregunta = document.getElementById("pregunta_input").value;
  pregunta_dates.retroalimentacion = document.getElementById("retroalimentacion").value;
  pregunta_dates.respuesta = (parseInt(document.getElementById("opcionCorrecta").value) - 1);

  console.log("Se asigno la pregunta : " + pregunta_dates.pregunta)
  console.log("Se asigno la respuesta : " + pregunta_dates.respuesta)

  for (let n = 1; n <= numeroOpciones; n++) {
    pregunta_dates.opciones.push(document.getElementById(`${n}`).value)
  }


  ocultar_Card()
  pintar()



};



function Validacion_Correcta() {

  let caja_correcta = document.getElementById("opcionCorrecta").value;
  let caja_retro = document.getElementById("retroalimentacion").value;

 
}



function pintar() {


  pantalla.innerHTML = `<h2 class="text-center" > ${pregunta_dates.pregunta} </h2> 
                        <div class="d-flex flex-row text-center p-2 m-5 justify-content-center gap-2" id="yuca">    
                        
                        </div>`

  let n = 0
  let salida = document.getElementById("yuca");

  for (opcion of pregunta_dates.opciones) {
    salida.innerHTML += ` 
    <button class="opcion boton col-2 text-center" id="${n}" value="${n}" onclick="selecionar(${n})" > ${opcion} </button>  `
    console.log("Opciones : " + " Posicion " + `${n} ` + "Opcion :" + opcion)

    n++

  }


  pantalla.innerHTML += `<input type="submit" class="btn btn-success" onclick="validar()" value="Responder">`


};


function validar() {
  if (respuestaSeleccionada != pregunta_dates.respuesta) {
    mostrarToast(pregunta_dates.retroalimentacion);
  } else {
    mostrarToast("✅ correcto, Felicidades");
  }
}




function selecionar(n) {
  
  respuestaSeleccionada = n
  console.log("se seleciono la posicion : " + respuestaSeleccionada + " Como respuesta")

};





// Funcion para validar o si la respuesta correcta esta entre el numero de opciones //


function max_options() {

  let opcionCorrecta = document.getElementById("opcionCorrecta").value;
  let numeroOpciones = parseInt(document.getElementById("numeroOpciones").value)

  
  if (opcionCorrecta > numeroOpciones) {
    mostrarToast("La respuesta supera el numero de opciones")
  } 


}





// ===================================================== //
//    Funciones para el manejo del toast de boostrap     //
// ===================================================== //




// Funcion para pasar el mensaje al toast dependiendo de la accion

function mostrarToast(mensaje) {

  let toast_card = document.getElementById("toastlive")
  let msg_card = document.getElementById("msg-card")
  msg_card.innerText = mensaje
  toast_card.classList.add("show")

}



// Funcion para cerrar el toast o card


function cerrar() {
  let toast_card = document.getElementById("toastlive");
  toast_card.classList.remove("show");
  document.getElementById("opcionCorrecta").value = "";

}



// Funcion para tener mas organizado el enviar mensajes en el toast

function ocultar_Card() {

  let card = document.getElementById("card_body");
  card.classList.add("oculto");
  
}
