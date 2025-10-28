
mostratoast()

var respuestaSeleccionada = 0;
let pantalla = document.getElementById("pregunta_pantalla")


let pregunta_dates = {
    pregunta : "",
    opciones : [],
    respuesta : 0,
    retroalimentacion : ""
}

document.getElementById("contenedor").style.display = "none"


function nopciones(){
   let numeroOpciones =  parseInt(document.getElementById("numeroOpciones").value)   
   let cajas = '';

  if(numeroOpciones < 4) {

     for (let n = 1 ; n <= numeroOpciones; n++)
    cajas += `<div class="row mb-2 justify-content-center">
                  <div class="col-6">
                     <div class="form-floating mb-3">
                      <input type="email" class="form-control" id="${n}" placeholder="name@example.com">
                     <label for="floatingInput">Opcion ${n}</label>
                  </div>
                  </div>
              </div>`

  } else {
    cajas = ''
    alert("Error Muchas Opciones");
    document.getElementById("numeroOpciones").value = '';
    document.getElementById("contenedorOpciones").innerHTML = ""
    return
  }
  
 
  document.getElementById("contenedorOpciones").innerHTML = cajas

  if (cajas == '')
    document.getElementById("contenedor").style.display = "none"
  else
    document.getElementById("contenedor").style.display = "block"
};




function guardar () {


  let numeroOpciones =  parseInt(document.getElementById("numeroOpciones").value)

  pregunta_dates.pregunta = document.getElementById("pregunta_input").value; 
  pregunta_dates.retroalimentacion = document.getElementById("retroalimentacion").value;
  pregunta_dates.respuesta = parseInt(document.getElementById("opcionCorrecta").value);
  console.log("Se asigno la pregunta : " + pregunta_dates.pregunta)
  console.log("Se asigno la respuesta : " + pregunta_dates.respuesta)

  for (let n = 1 ; n <= numeroOpciones; n++){
      pregunta_dates.opciones.push(document.getElementById(`${n}`).value)
  }

  
  pintar()


};



function pintar(){
   
  
  pantalla.innerHTML = `<h2 class="text-center" > ${pregunta_dates.pregunta} </h2> 
                        <div class="d-flex flex-row text-center p-2 m-5 justify-content-center gap-2" id="yuca">    
                        
                        </div>`
  
  let n = 0
  let salida = document.getElementById("yuca");

  for ( opcion of pregunta_dates.opciones ) {
    salida.innerHTML +=  ` 
    <button class="opcion col-2 text-center" id="${n}" value="${n}" onclick="selecionar(${n})" > ${opcion} </button>  `
    console.log("Opciones : " + " Posicion "  + `${n} ` + "Opcion :" + opcion)
    
      n++
      
    }
    
    
    pantalla.innerHTML += `<input type="submit" class="btn btn-success" onclick="validar()" value="Responder">` 
    

  };
  
  
function validar() {
  if (respuestaSeleccionada == pregunta_dates.respuesta) {
    mostratoast("✅ ¡Correcto! Muy bien hecho.");
  } else {
    mostratoast("❌ Incorrecto, intenta de nuevo.");
  }
}




  function selecionar(n) {
    console.log("se seleciono la posicion : " + n  + " Como respuesta" )
    respuestaSeleccionada = parseInt(n-1)
  } ;



function mostratoast(mensaje = "Hello, world!") {
  // Seleccionamos el body del toast que ya está en el HTML
  let toastBody = document.getElementById("toastMensaje");
  toastBody.innerText = mensaje;

  // Seleccionamos el toast completo
  const toastEl = document.getElementById("miToast");

  // Creamos o reutilizamos la instancia
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl);

  // Mostramos el toast
  toastBootstrap.show();
}


