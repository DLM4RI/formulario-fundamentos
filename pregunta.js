/* Logic by viper */
/* ============================================= */
/* Asignacion de variables globales        */
/* ============================================ */
let n_preguntas = document.getElementById("n_preguntas");
let pantalla = document.getElementById("pregunta_pantalla");
let pantalla_preguntas = document.getElementById("preguntas-screen");
let contenedor_mini_cards = document.getElementById("contenedor_mini_cards");

let memoria_preguntas = [];
let numero_de_pregunta = 1;
let modo_edicion_final = false; // Bandera para saber si ya terminamos la carga inicial
let cargando_pantalla = false;

/* ============================================= */
/* Funciones de Inicio y Validación        */
/* ============================================ */
/* Logic by viper */
function validar_pregunta() {
  let btn = document.getElementById("boton_generador_preguntas");
  let val = parseInt(n_preguntas.value);

  if (val > 20) {
    mostrarToast("Maximo 20 preguntas");
    n_preguntas.value = 20;
  } else if (val > 0) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

function almacenar_preguntas() {
  // Ocultar panel numero, mostrar editor
  document.getElementById("card_body_numero").style.display = "none";
  document.getElementById("card_editor").style.display = "block";
  document.getElementById("panel_mini_cards").style.display = "block";
  document.getElementById("panel_final").style.display = "block"; 

  // Inicializar memoria vacía basada en el numero
  for(let i=0; i<parseInt(n_preguntas.value); i++){
      memoria_preguntas.push({
          pregunta: "",
          opciones: [],
          respuesta: "",
          retroalimentacion: "",
          numero_de_pregunta: i + 1
      });
  }
/* Logic by viper */
  generar_preguntas(numero_de_pregunta);
  actualizarBotones();
  renderizarMiniCards(); // Mostrar cards vacias al inicio
  generar_quiz(); // Generar el quiz por primera vez
}

/* ============================================= */
/* Lógica del Editor (Generar HTML)        */
/* ============================================ */

function generar_preguntas(ndp) {

  cargando_pantalla = true;

  // Limpiamos pantalla
  pantalla_preguntas.innerHTML = `
    <div name="pregunta${ndp}">
        <div class="mb-3" style="border-bottom: 2px solid #30363d; padding-bottom: 20px;">
          <h3 class="mt-3"> Pregunta ${ndp} </h3>
          <label>Pregunta?</label>
          <input type="text" class="form-control" id="input_pregunta" placeholder="Ingrese la pregunta" oninput="guardarEnTiempoReal(); validarBotonSiguiente()">
        </div>
        
        <div class="mb-3">
          <label>Numero de Opciones <span>(max 4)</span></label>
          <input type="number" id="numeroOpciones" class="form-control" oninput="nopciones(); validarBotonSiguiente()">
        </div>
        
        <div id="contenedorOpciones" style="   justify-content: center;   display: flex;   align-items: center;   flex-direction: column; "></div>
              
        <div class="mb-3" id="contenedor_respuesta_correcta" style="display:none">
             <label>No. Opcion Correcta</label>
             <input type="number" class="form-control" id="opcionCorrecta" min="1" oninput="guardarEnTiempoReal(); validarBotonSiguiente()">       
        </div>

        <div class="mb-3">
          <label>Retroalimentacion</label>
          <input type="text" class="form-control" id="retroalimentacion" oninput="guardarEnTiempoReal()">
        </div>
    </div>
  `;
    cargarDatosEnInputs(ndp);
    setTimeout(() => {
        validarBotonSiguiente();
        cargando_pantalla = false; // ← ya se puede guardar
    }, 50);
}


// Función que llena los inputs si ya hay info en memoria
function cargarDatosEnInputs(ndp) {
    let datos = memoria_preguntas[ndp - 1];
    if (!datos) return;

    // 1. Cargar Pregunta
    document.getElementById("input_pregunta").value = datos.pregunta || "";
    document.getElementById("retroalimentacion").value = datos.retroalimentacion || "";

    // 2. Cargar # Opciones y generarlas
    if (datos.opciones.length > 0 || datos.numeroOpciones) {
        let numOpciones = datos.numeroOpciones || datos.opciones.length;
        document.getElementById("numeroOpciones").value = numOpciones;
        nopciones(); // Esto genera los inputs de opciones

        // 3. Llenar los textos de las opciones
        setTimeout(() => { // Pequeño delay para asegurar que el DOM existe
            datos.opciones.forEach((texto, i) => {
                let inputOp = document.getElementById(`opcion_${i + 1}`);
                if (inputOp) inputOp.value = texto;
            });
            
            // 4. Cargar respuesta correcta DESPUÉS de generar las opciones
            if (datos.respuesta) {
                let inputRespuesta = document.getElementById("opcionCorrecta");
                if (inputRespuesta) {
                    inputRespuesta.value = datos.respuesta;
                }
            }
            
            validarBotonSiguiente(); // Validar después de cargar opciones
        }, 0);
    }
}

// Función nopciones adaptada para diseño vertical y ancho reducido
function nopciones() {
    let numeroOpciones = document.getElementById("numeroOpciones");
    let contenedor = document.getElementById("contenedorOpciones");
    let val = parseInt(numeroOpciones.value);
    let cajas = '';

    if (val > 4) {
        mostrarToast("Maximo 4 opciones");
        numeroOpciones.value = 4;
        val = 4;
    }

    // Primero guardar valores actuales antes de regenerar
    let valoresActuales = [];
    let respuestaCorrectaActual = "";
    
    for (let i = 1; i <= 4; i++) {
        let input = document.getElementById(`opcion_${i}`);
        if (input) {
            valoresActuales.push(input.value);
        }
    }
    
    // Guardar respuesta correcta actual si existe
    let inputRespuestaActual = document.getElementById("opcionCorrecta");
    if (inputRespuestaActual) {
        respuestaCorrectaActual = inputRespuestaActual.value;
    }

    // Obtener valores de la memoria si existen
    let ndp = numero_de_pregunta;
    let datosMemoria = memoria_preguntas[ndp - 1];

    cajas += '<div class="row">'; 

    if (val > 0) {
        for (let n = 1; n <= val; n++) {
            // Prioridad: 1. Valor actual del input, 2. Valor en memoria, 3. Vacío
            let valorActual = "";
            if (valoresActuales[n - 1] !== undefined && valoresActuales[n - 1] !== "") {
                valorActual = valoresActuales[n - 1];
            } else if (datosMemoria && datosMemoria.opciones[n - 1]) {
                valorActual = datosMemoria.opciones[n - 1];
            }
            
            // col-md-6 reduce el ancho y col-12 asegura apilamiento vertical
            cajas += `
            <div class="mb-3 col-12"> 
                <label>Opcion ${n}</label>
                <input type="text" class="form-control opcion-input" id="opcion_${n}" value="${valorActual}" 
                       oninput="guardarEnTiempoReal(); validarBotonSiguiente()">
            </div> 
            `;
        }
        document.getElementById("contenedor_respuesta_correcta").style.display = "block";
    } else {
        document.getElementById("contenedor_respuesta_correcta").style.display = "none";
    }
    
    cajas += '</div>';

    contenedor.innerHTML = cajas;
    
    // Restaurar la respuesta correcta después de regenerar el DOM
    setTimeout(() => {
        let inputRespuesta = document.getElementById("opcionCorrecta");
        if (inputRespuesta) {
            // Prioridad: valor actual guardado, sino el de memoria
            if (respuestaCorrectaActual) {
                inputRespuesta.value = respuestaCorrectaActual;
            } else if (datosMemoria && datosMemoria.respuesta) {
                inputRespuesta.value = datosMemoria.respuesta;
            }
        }
    }, 0);
    
    guardarEnTiempoReal();
    validarBotonSiguiente(); // Validar inmediatamente después de generar los inputs
}

// Función de Validación
function validarBotonSiguiente() {
    let pregunta = document.getElementById("input_pregunta") ? document.getElementById("input_pregunta").value : "";
    let correcta = document.getElementById("opcionCorrecta") ? document.getElementById("opcionCorrecta").value : "";
    let numOpciones = document.getElementById("numeroOpciones") ? parseInt(document.getElementById("numeroOpciones").value) : 0;
    
    let inputsOpciones = document.querySelectorAll(".opcion-input");
    let opcionesLlenas = true;
    
    // 1. Verificar que todas las opciones requeridas estén llenas
    if (inputsOpciones.length !== numOpciones) {
        opcionesLlenas = false; 
    } else {
        inputsOpciones.forEach(inp => {
            if (inp.value.trim() === "") {
                opcionesLlenas = false;
            }
        });
    }

    // 2. Verificar que la respuesta correcta sea un número válido
    let respuestaValida = (correcta.trim() !== "" && parseInt(correcta) >= 1 && parseInt(correcta) <= numOpciones);
    
    // Toast si la respuesta correcta excede el número de opciones
    if (correcta.trim() !== "" && parseInt(correcta) > numOpciones && numOpciones > 0) {
        mostrarToast("La opcion correcta no puede exceder el numero de opciones");
    }
    
    // 3. Chequeo final
    let todoLleno = pregunta.trim() !== "" && opcionesLlenas && respuestaValida;

    let btnSiguiente = document.getElementById("siguiente");
    let btnFinalizar = document.getElementById("boton_finalizar");
    
    if (btnSiguiente && btnFinalizar) {
        // Deshabilitar/Habilitar botón que esté visible en la navegación
        if (btnSiguiente.style.display !== "none") {
            btnSiguiente.disabled = !todoLleno;
        } else if (btnFinalizar.style.display !== "none") {
            btnFinalizar.disabled = !todoLleno;
        }
    }
}


/* ============================================= */
/* Guardado en Tiempo Real y Mini Cards       */
/* ============================================ */

// Escucha CUALQUIER cambio en el formulario para guardar y actualizar preview
pantalla_preguntas.addEventListener('input', function(e) {
    if (cargando_pantalla) return;  // ← No guardar durante regeneración

    guardarEnTiempoReal();
    validarBotonSiguiente();
});
/* Logic by viper */

function guardarEnTiempoReal() {
    if (cargando_pantalla) return; 
    let ndp = numero_de_pregunta;
    let preguntaTxt = document.getElementById("input_pregunta") ? document.getElementById("input_pregunta").value : "";
    let retro = document.getElementById("retroalimentacion") ? document.getElementById("retroalimentacion").value : "";
    let resp = document.getElementById("opcionCorrecta") ? document.getElementById("opcionCorrecta").value : "";
    let numOpciones = document.getElementById("numeroOpciones") ? document.getElementById("numeroOpciones").value : "";
    
    // Recolectar opciones
    let arrayOpciones = [];
    let inputsOpciones = document.querySelectorAll(".opcion-input");
    inputsOpciones.forEach(inp => arrayOpciones.push(inp.value));

    // Si el array existe (para evitar errores en la carga inicial)
    if(memoria_preguntas[ndp - 1]){
        memoria_preguntas[ndp - 1] = {
            pregunta: preguntaTxt,
            opciones: arrayOpciones,
            respuesta: resp,
            retroalimentacion: retro,
            numero_de_pregunta: ndp,
            numeroOpciones: numOpciones // Guardar también el número de opciones
        };
    }


    renderizarMiniCards();
    generar_quiz(); // Renderiza el quiz en vivo
}

function renderizarMiniCards() {
    let html = "";
    memoria_preguntas.forEach((item, index) => {
        let activeClass = (index + 1 === numero_de_pregunta) ? "border-primary" : "border-secondary";
        // Si estamos en modo edición final, las cards son clickeables
        let clickAction = modo_edicion_final ? `onclick="editarPreguntaEspecifica(${index + 1})"` : "";
        let cursorStyle = modo_edicion_final ? "cursor: pointer;" : "";
        let bgStyle = modo_edicion_final && (index + 1 === numero_de_pregunta) ? "background-color: #21262d;" : "background-color: #161b22;";

        html += `
        <div class="col-6 col-md-3 mb-2">
            <div class="card p-2 ${activeClass}" style="${cursorStyle} ${bgStyle} min-height: 100px;" ${clickAction}>
                <small style="color: #58a6ff; font-weight: bold;">P${index + 1}</small>
                <p style="font-size: 0.8rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${item.pregunta || "Sin pregunta..."}
                </p>
                <small style="color: #8b949e">${item.opciones.length} opciones</small>
            </div>
        </div>`;
    });
    contenedor_mini_cards.innerHTML = html;
}
/* Logic by viper */
/* ============================================= */
/* Navegación (Anterior / Siguiente)       */
/* ============================================ */

function pintar_card_preguntas(accion) {
  if (accion === 'siguiente') {
      numero_de_pregunta++;
  } else {
      numero_de_pregunta--;
  }
  
  generar_preguntas(numero_de_pregunta);
  actualizarBotones();
  renderizarMiniCards(); // Actualizar el borde activo
}

function actualizarBotones() {
  let total = parseInt(n_preguntas.value);
  
  // Boton Anterior
  document.getElementById("anterior").style.display = (numero_de_pregunta === 1) ? "none" : "block";
  
  // Boton Siguiente / Finalizar
  let btnSiguiente = document.getElementById("siguiente");
  let btnFinalizar = document.getElementById("boton_finalizar");

  if (numero_de_pregunta === total) {
      btnSiguiente.style.display = "none";
      btnFinalizar.style.display = "block";
  } else {
      btnSiguiente.style.display = "block";
      btnFinalizar.style.display = "none";
  }
}

/* ============================================= */
/* Fase Final y Generación de Quiz         */
/* ============================================ */

function finalizar_carga() {
    modo_edicion_final = true;
    
    // Ocultar el editor principal
    document.getElementById("card_editor").style.display = "none";
    
    document.getElementById("panel_final").style.display = "block"; 
    
    mostrarToast("Carga finalizada. Haz clic en una tarjeta para editarla.");
    renderizarMiniCards(); 
    generar_quiz(); 
}
/* Logic by viper */
function editarPreguntaEspecifica(ndp) {
    numero_de_pregunta = ndp;
    
    // Crear modal de edición
    crearModalEdicion(ndp);
}

function crearModalEdicion(ndp) {
    // Eliminar modal anterior si existe
    let modalAnterior = document.getElementById("modal_edicion");
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Crear el modal
    let modalHTML = `
    <div id="modal_edicion" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center; overflow-y: auto;">
        <div class="card" style="width: 90%; max-width: 600px; margin: 20px; max-height: 90vh; overflow-y: auto;">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h4><b>Editar Pregunta ${ndp}</b></h4>
                    <button class="btn btn-danger btn-sm" onclick="cerrarModalEdicion()">✕ Cerrar</button>
                </div>
                
                <div id="contenido_modal_edicion"></div>
                
                <button class="btn btn-success w-100 mt-3" onclick="guardarEdicionModal()">Guardar Cambios</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Cargar el contenido del editor en el modal
    let contenidoModal = document.getElementById("contenido_modal_edicion");
    let datos = memoria_preguntas[ndp - 1];

    contenidoModal.innerHTML = `
        <div class="mb-3" style="border-bottom: 2px solid #30363d; padding-bottom: 20px;">
            <label>Pregunta?</label>
            <input type="text" class="form-control" id="modal_input_pregunta" placeholder="Ingrese la pregunta" value="${datos.pregunta || ''}">
        </div>
        
        <div class="mb-3">
            <label>Numero de Opciones <span>(max 4)</span></label>
            <input type="number" id="modal_numeroOpciones" class="form-control" value="${datos.opciones.length || ''}">
        </div>
        
        <div id="modal_contenedorOpciones" style="justify-content: center; display: flex; align-items: center; flex-direction: column;"></div>
              
        <div class="mb-3" id="modal_contenedor_respuesta_correcta" style="display:none">
             <label>No. Opcion Correcta</label>
             <input type="number" class="form-control" id="modal_opcionCorrecta" min="1" value="${datos.respuesta || ''}">       
        </div>

        <div class="mb-3">
            <label>Retroalimentacion</label>
            <input type="text" class="form-control" id="modal_retroalimentacion" value="${datos.retroalimentacion || ''}">
        </div>
    `;

    // Generar las opciones si existen
    if (datos.opciones.length > 0) {
        generarOpcionesModal(datos.opciones);
    }

    // Event listener para el cambio en número de opciones
    document.getElementById("modal_numeroOpciones").addEventListener('input', function() {
        let val = parseInt(this.value);
        if (val > 4) {
            mostrarToast("Maximo 4 opciones");
            this.value = 4;
            val = 4;
        }
        generarOpcionesModalDinamico(val);
    });
}

function generarOpcionesModal(opcionesExistentes) {
    let contenedor = document.getElementById("modal_contenedorOpciones");
    let html = '<div class="row">';

    opcionesExistentes.forEach((texto, i) => {
        html += `
        <div class="mb-3 col-12">
            <label>Opcion ${i + 1}</label>
            <input type="text" class="form-control modal-opcion-input" id="modal_opcion_${i + 1}" value="${texto}">
        </div>
        `;
    });

    html += '</div>';
    contenedor.innerHTML = html;
    document.getElementById("modal_contenedor_respuesta_correcta").style.display = "block";
}

function generarOpcionesModalDinamico(numOpciones) {
    let contenedor = document.getElementById("modal_contenedorOpciones");
    let html = '<div class="row">';

    // Guardar valores actuales antes de regenerar
    let valoresActuales = [];
    for (let i = 1; i <= 4; i++) {
        let input = document.getElementById(`modal_opcion_${i}`);
        if (input) {
            valoresActuales.push(input.value);
        }
    }

    if (numOpciones > 0) {
        for (let n = 1; n <= numOpciones; n++) {
            let valorActual = valoresActuales[n - 1] || "";
            html += `
            <div class="mb-3 col-12">
                <label>Opcion ${n}</label>
                <input type="text" class="form-control modal-opcion-input" id="modal_opcion_${n}" value="${valorActual}">
            </div>
            `;
        }
        document.getElementById("modal_contenedor_respuesta_correcta").style.display = "block";
    } else {
        document.getElementById("modal_contenedor_respuesta_correcta").style.display = "none";
    }

    html += '</div>';
    contenedor.innerHTML = html;
}

function guardarEdicionModal() {
    let ndp = numero_de_pregunta;
    let preguntaTxt = document.getElementById("modal_input_pregunta").value;
    let retro = document.getElementById("modal_retroalimentacion").value;
    let resp = document.getElementById("modal_opcionCorrecta").value;
    
    // Recolectar opciones
    let arrayOpciones = [];
    let inputsOpciones = document.querySelectorAll(".modal-opcion-input");
    inputsOpciones.forEach(inp => arrayOpciones.push(inp.value));

    // Guardar en memoria
    memoria_preguntas[ndp - 1] = {
        pregunta: preguntaTxt,
        opciones: arrayOpciones,
        respuesta: resp,
        retroalimentacion: retro,
        numero_de_pregunta: ndp
    };

    renderizarMiniCards();
    generar_quiz();
    cerrarModalEdicion();
    mostrarToast("Cambios guardados exitosamente");
}

function cerrarModalEdicion() {
    let modal = document.getElementById("modal_edicion");
    if (modal) {
        modal.remove();
    }
}

function generar_quiz() {
  
  let pantalla = document.getElementById("pregunta_pantalla");
  pantalla.style.display = "block"; 
  
  let html = `<h3 class="text-center mb-4">Quiz Interactivo (Preview en Vivo)</h3>`;
  let letras = ["A","B","C","D"];

  memoria_preguntas.forEach((datos, idx) => {
    html += `
      <div class="card mb-4 p-3 quiz-card" data-index="${idx}" style="border: 1px solid #30363d;">
        <h5><b>${datos.numero_de_pregunta}. ${datos.pregunta || "⚠️ PREGUNTA VACÍA (Editar)"}</b></h5>
        <div class="mt-3">
          ${datos.opciones.map((op, i) => 
            `<button class="btn btn-outline-light w-100 mb-2 text-start" 
              onclick="verificarRespuesta(this, ${i+1}, ${datos.respuesta}, 'retro_${idx}')">
              <b>${letras[i]}.</b> ${op || "⚠️ Opción Vacía"}
             </button>`
          ).join('')}
        </div>
        
        <div id="retro_${idx}" 
             style="display:none; margin-top:10px; padding:10px; border-radius:5px; background-color: #2c3034; border: 1px solid #6c757d;">
           <p style="color: #9a4cff; margin: 0;">
               <b>Retroalimentación:</b> ${datos.retroalimentacion || "Sin retroalimentación."}
           </p>
        </div>
      </div>
    `;
  });

  pantalla.innerHTML = html;
}

// Logica del juego en vivo (Validación visual)
function verificarRespuesta(btn, opcionElegida, correcta, idRetro) {
    let quizCard = btn.closest('.quiz-card');
    let buttons = quizCard.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true); // Deshabilita todos los botones de la pregunta

    let retroDiv = document.getElementById(idRetro);
    retroDiv.style.display = "block";
    
    if (opcionElegida == correcta) {
        btn.classList.remove("btn-outline-light");
        btn.classList.add("btn-success");
        retroDiv.style.backgroundColor = "rgba(25, 135, 84, 0.2)";
        retroDiv.style.border = "1px solid #198754";
    } else {
        btn.classList.remove("btn-outline-light");
        btn.classList.add("btn-danger");
        retroDiv.style.backgroundColor = "rgba(220, 53, 69, 0.2)";
        retroDiv.style.border = "1px solid #dc3545";

        // Muestra la respuesta correcta si la incorrecta fue elegida
        buttons.forEach((b, i) => {
            if (i + 1 == correcta) {
                b.classList.remove("btn-outline-light");
                b.classList.add("btn-info"); // Color diferente para la correcta
            }
        });
    }
}

// Utilidad Toast
function mostrarToast(mensaje) {
  let toaster = document.getElementById("salida_toaster");
  toaster.innerHTML = `
   <div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
      <div class="toast show text-white bg-danger border-0">
        <div class="toast-body">${mensaje}</div>
      </div>
    </div>`;
  setTimeout(() => { toaster.innerHTML = ""; }, 3000);
}


/* Logic by viper */