


// ============================================= //
//       Asignacion de variables globales        //
// ============================================ //
let n_preguntas = document.getElementById("n_preguntas");
let pantalla = document.getElementById("pregunta_pantalla")
let respuestaSeleccionada = 0;
let pantalla_preguntas = document.getElementById("preguntas-screen");
// OBJECT o Objeto que alamcena los datos de la pregunta
let pregunta_dates = {
  pregunta: "",
  opciones: [],
  respuesta: 0,
  retroalimentacion: "",
  numero_de_pregunta: null,
};

// arreglo que almacena las preguntas creadas

let memoria_preguntas = [];

let numero_de_pregunta = 1




pantalla.style.opacity = "0"


// funcion que crea el # de opciones para que el usuario establezca el "texto"

function nopciones() {
  let numeroOpciones = parseInt(document.getElementById("numeroOpciones").value)
  let cajas = '';
  let contenderoOpciones = document.getElementById("numeroOpciones");


  // generamos el codigo y html para que aparezca la opcion de elegir la correcta : 



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

  } else if (numeroOpciones == "" || numeroOpciones == 0 || isNaN(numeroOpciones) || numeroOpciones < 0) {

    // si el usuario borra el numero de opciones se eliminan las cajas creadas
    cajas = ''
    document.getElementById("contenedorOpciones").innerHTML = "";
    document.getElementById("contenedor").style.display = "none"
    return


  } else {

    // se le devuelve al usuariro un toast que diga que puso valores exagerados o incorrectos
    // a su vez se eliminan las cajas creadas en dado caso si se crearon

    cajas = ''
    mostrarToast("Caracteres Invalidos o Demasiadas Opciones")
    document.getElementById("numeroOpciones").value = '';
    document.getElementById("contenedorOpciones").innerHTML = "";
    document.getElementById("contenedor").style.display = "none"
    document.getElementById("numeroOpciones").disabled = false
    document.getElementById("numeroOpciones").value = ''
    contenderoOpciones.disabled = true

    console.log(pregunta_dates)

    return


  }
  

  document.getElementById("contenedorOpciones").innerHTML = cajas

  if (cajas == '') {
    document.getElementById("contenedor").style.display = "none"
  } else {
    document.getElementById("contenedor").style.display = "block"
  }

  on_nopciones(numero_de_pregunta)




};











// Funcion para validar o si la respuesta correcta esta entre el numero de opciones //


function max_options() {

  let opcionCorrecta = document.getElementById("opcionCorrecta");
  let numeroOpciones = document.getElementById("numeroOpciones");


  if (opcionCorrecta.value > numeroOpciones.value) {
    document.getElementById("opcionCorrecta").disabled = true

    opcionCorrecta.value = ""
    mostrarToast("Superastes el limite de opciones")
  }


}





// ===================================================== //
//    Funciones para el manejo del toast O CARD FLOTANTE de boostrap     //
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
  let inputs = document.querySelectorAll("input");
  let toast_card = document.getElementById("toastlive");
  toast_card.classList.remove("show");
  inputs.forEach(input => {
    input.disabled = false;
  });



}

// Funcion para tener mas organizado el enviar mensajes en el toast

function ocultar_Card() {

  let card = document.getElementById("card_body");
  card.classList.add("oculto");

}




// FUNCIONES VARIAS - ESTILOS Y DEMAS



function selecionar(n) {

  respuestaSeleccionada = n
  console.log("se seleciono la posicion : " + respuestaSeleccionada + " Como respuesta")

};









// ===================================================== //
//    FUNCIONES PARA GENERAR VARIAS PREGUNTAS     //
// ===================================================== //
  
let boton_generador_preguntas = document.getElementById("boton_generador_preguntas");

function validar_pregunta() {

    boton_generador_preguntas.disabled = true

    if (n_preguntas.value > 20) {
      mostrarToast("Numero maximo de preguntas es 20")
      n_preguntas.value = ''
      n_preguntas.disabled = true
      return
      // si el usuario borra el numero de preguntas se le deniega el acceso al boton, para que no genere errores
    } else if (n_preguntas.value <= 0 || n_preguntas.value == "" || isNaN(n_preguntas.value)) {
        
          boton_generador_preguntas.disabled = true
          //de lo contrario si el usuario si ingresa un numero valido entre 1 y 20 se le habilita el boton para generar las preguntas
      } else {
      n_preguntas.disabled = false
      console.log("Numero de preguntas a generar : " + n_preguntas.value)
      boton_generador_preguntas.disabled = false

      return
    };
}



function generar_preguntas (numero_de_pregunta) {



  pantalla_preguntas.innerHTML = `

  <div name="pregunta${numero_de_pregunta}">

      <div class="mb-3" style="border-bottom: 2px solid #30363d; margin-bottom: 20px; padding-bottom: 20px;">
        <h3 style="margin-bottom: 20px; margin-top: 20px;" > Pregunta ${numero_de_pregunta} </h3>
        <label>Pregunta ? </label>
        <input type="text" class="form-control" id="pregunta_${numero_de_pregunta}" placeholder="Ingrese la pregunta">
      </div>
      <div class="mb-3">
        <label for="numeroOpciones" class="form-label">Numero de Opciones <span>(max 4)</span> </label>
        <input type="number" id="numeroOpciones" oninput="nopciones()" class="form-control" aria-valuemax="">
      </div>
      <div id="contenedorOpciones"></div>
            
      <div class="mb-3" id="contenedor">
                  
      </div>

      <div class="mb-3">
        <label for="retroalimentacion" class="form-label">Retroalimentacion</label>
        <input type="text" class="form-control" id="retroalimentacion">
      </div>
  </div>
  
  
  `


}




function almacenar_preguntas() {
  n_preguntas.disabled = true
  boton_generador_preguntas.disabled = true
  memoria_preguntas = [];

  generar_preguntas(numero_de_pregunta) ;

  
  console.log("Estas en la pregunta : " + numero_de_pregunta)

  document.getElementById("siguiente").addEventListener("click", () => {
    pintar_card_preguntas(document.getElementById("siguiente"))
  });

  document.getElementById("anterior").addEventListener("click", () => {
    pintar_card_preguntas(document.getElementById("anterior"))
  });


    


  }



  
function pintar_card_preguntas(boton) {

  if (boton.id == "siguiente"){
    guardar(numero_de_pregunta);
    limpiar_inputs();
    console.log("La pregunta" + numero_de_pregunta + " se guardo correctamente") 
    console.log("Estas en la pregunta : " + numero_de_pregunta)

  } else if (boton.id == "anterior") {

    console.log("Estas en la pregunta : " + numero_de_pregunta)  
  } 

};



function guardar(ndp) {
  

  let numeroOpciones = parseInt(document.getElementById("numeroOpciones").value)

        
  memoria_preguntas.push({
          ...pregunta_dates,
          numero_de_pregunta: ("pregunta_" + ndp), 
          pregunta: `${document.getElementById(`pregunta_${ndp}`).value}`,
          opciones: [],
          respuesta: opcionCorrecta.value,
          retroalimentacion: `${document.getElementById("retroalimentacion").value} `,
          numero_de_pregunta: ndp,
        });
      
  
  
  for (let n = 1; n <= numeroOpciones; n++) {
    memoria_preguntas[ndp-1].opciones.push(document.getElementById(`${n}`).value)
  }
  

  console.log("Pregunta " + ndp + " almacenada con los siguientes datos :")
  console.log(memoria_preguntas)
  console.log(pregunta_dates)
  console.log(memoria_preguntas[ndp-1].opciones)
  
  actualizar(numero_de_pregunta)
  


};



function on_nopciones() {

  let screen_option = document.getElementById("contenedor");

  screen_option.style.display = "block"

  screen_option.innerHTML = `
            <label for="opcionCorrecta" class="form-label">No. Opcion Correcta</label>
            <input type="number" oninput="max_options()" class="form-control" id="opcionCorrecta">
            `
}


let btns_container = document.getElementById("btns_container");
let btn_quiz = document.getElementById("boton_quiz"); 


function actualizar () {

  if (numero_de_pregunta == (n_preguntas.value-1)) {

    numero_de_pregunta++
    document.getElementById("siguiente").style.display = "none"
    btn_quiz.style.display = "block"

  } else {

    if ( numero_de_pregunta >= parseInt(n_preguntas.value) ) {
    console.log("Se han generado todas las preguntas")

    } else {
    numero_de_pregunta++
    generar_preguntas(numero_de_pregunta)

    }

  }

  

}


function limpiar_inputs() {
  document.querySelectorAll("#preguntas-screen input")
    .forEach(input => input.value = "");
}