// Almacenadores
let claveSeleccionada = null; 
let dataTrivia = null; 
let numeroIngresado = null;

// Conductores
const btnIniciarTrivia = document.getElementById('iniciarTrivia');
const triviaContainer = document.getElementById('triviaContainer');
const preguntaActual = document.getElementById('preguntaActual');
const opcionesContainer = document.getElementById('opciones');
const btnEnviar = document.getElementById('btnEnviar');
const contadorPreguntas = document.getElementById('contadorPreguntas');
const puntosObtenidos = document.getElementById('puntosObtenidos');
const resultadoFinal = document.getElementById('resultadoFinal');
const btnCerrarModal = document.getElementById('cerrarModal');
const inputTelefono = document.getElementById('inputTelefono');
const crosselingContainer = document.getElementById('crosselingContainer');
const dataParticipante = document.getElementById('dataParticipante');
const spinnerSubmit = document.querySelector('#spinnerSubmit');
const tituloTrivia = document.getElementById('tituloTrivia');

// Conexiones al backend
import { getTriviaByAni, pushRespuesta } from "./dataTrivia.js";

// Mostrar toast
function mostrarToast(mensaje, tipo) {
  let color = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #ff5f6d, #ffc371)",
    warning: "linear-gradient(to right, #f7b733, #fc4a1a)"
  }; 
  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: "center",
    position: "center",
    style: { background: color[tipo] || "#0072ff" },
    stopOnFocus: true
  }).showToast();
}

// Validar usuario localmente
async function validarUsuario(ani) {
  const data = getTriviaByAni(ani);
  console.log("informacion local:", data);
  if (!data.status) return null;
  return {
    ani: ani,
    triviaActiva: data.result.RESTANTES > 0,
    name: ani,
    puntos: data.result.PUNTOS,
    total: data.result.TOTAL,
    restantes: data.result.RESTANTES,
    pregunta: data.result.PREGUNTA
  };
}

// Mostrar mensaje del usuario
function mensajeUsuario(usuario, numeroIngresado){
  const ingreso = `<section><p>Ani N.º ${usuario.name}!</p></section>`;
  localStorage.setItem("NumeroGuardado", numeroIngresado);

  if(usuario.triviaActiva){
    mostrarToast("✅ Acceso concedido: tenés trivia activa.", "success");
    btnIniciarTrivia.classList.remove('d-none');
    btnIniciarTrivia.disabled = false;
    inputTelefono.classList.add('d-none');
    dataParticipante.classList.remove('d-none');
    dataParticipante.innerHTML = `<span class="close-btn" id="btnCerrarInterno">&times;</span>${ingreso}`;
  } else {
    mostrarToast('✅Acceso concedido: No tenes trivias activas!', 'success');
    inputTelefono.classList.add('d-none');
    dataParticipante.classList.remove('d-none');
    dataParticipante.innerHTML = `
      <span class="close-btn" id="btnCerrarInterno">&times;</span>
      <div class="text-center position-relative">
        ${ingreso}
        <section class="alert alert-danger text-center">
          <p class="mb-2">No se encontraron trivias activas vinculadas a tu usuario, por favor compra un pack</p>
          <a href="/packs" target="_blank" rel="noopener noreferrer">Comprá más preguntas👈</a>
        </section>
      </div>
    `;
  }

  document.getElementById('btnCerrarInterno').addEventListener('click', cerrarTrivia);
}

// Listener para validar teléfono
document.getElementById('validarTelefono').addEventListener('click', async () => {
  numeroIngresado = document.getElementById('telefono').value.trim();
  if(!numeroIngresado){
    mostrarToast('⚠ Ingresá un número de teléfono.', 'warning');
    return;
  }
  try {
    const usuario = await validarUsuario(numeroIngresado);
    if(!usuario){
      mostrarToast('❌ Usuario no registrado.', 'warning');
      inputTelefono.classList.remove('d-none');
      return;
    }
    mensajeUsuario(usuario, numeroIngresado);
    if(usuario.triviaActiva && usuario.pregunta){
      inputTelefono.classList.add('d-none');
      dataParticipante.classList.add('d-none');
      triviaContainer.classList.remove('d-none');
      btnIniciarTrivia.classList.add('d-none');
      dataTrivia = getTriviaByAni(numeroIngresado).result;
      renderPregunta(dataTrivia.PREGUNTA);
    }
  } catch(error) {
    console.error("Error interno en el servior.", error);
    mostrarToast("Fallo interno en el servidor", "error");
  }
});

// Iniciar Trivia
btnIniciarTrivia.addEventListener('click', async () => {
  inputTelefono.classList.add('d-none');
  btnIniciarTrivia.classList.add('d-none');
  dataParticipante.classList.add('d-none');
  triviaContainer.classList.remove('d-none');
  dataTrivia = getTriviaByAni(numeroIngresado).result;
  renderPregunta(dataTrivia.PREGUNTA);
});

// Renderizar pregunta y opciones
function renderPregunta(preguntaData) {
  preguntaActual.textContent = preguntaData.PREGUNTA;
  puntosObtenidos.textContent = `Puntos: ${dataTrivia.PUNTOS}`;
  contadorPreguntas.textContent = `Preguntas restantes: ${dataTrivia.RESTANTES}/${dataTrivia.TOTAL}`;
  opcionesContainer.innerHTML = "";
  btnEnviar.classList.add("d-none");
  claveSeleccionada = null;

  preguntaData.RESPUESTAS.forEach(r => {
    const btnResp = document.createElement("button");
    btnResp.className = "btn btn-outline-danger opcion-btn";
    btnResp.innerText = `${r.texto}`;
    btnResp.addEventListener("click", () => {
      claveSeleccionada = r.clave;
      document.querySelectorAll('#opciones button').forEach(b => b.classList.remove('active'));
      btnResp.classList.add('active');
      btnEnviar.classList.remove("d-none");
    });
    opcionesContainer.appendChild(btnResp);
  });
}

// Enviar respuesta
btnEnviar.addEventListener("click", () => {
  if (!claveSeleccionada){
    mostrarToast("Tenés que seleccionar una respuesta", "warning");
    return;
  }
  btnEnviar.disabled = true;
  spinnerSubmit.classList.remove("d-none");
  try {
    const result = pushRespuesta(numeroIngresado, dataTrivia.PREGUNTA.ID_PREGUNTA, claveSeleccionada);
    console.log("Resultado pushRespuesta:", result);
    if(result.status){
      dataTrivia.PUNTOS = result.result.PUNTOS;
      dataTrivia.RESTANTES = result.result.RESTANTES;
      dataTrivia.TOTAL = result.result.TOTAL;
      if (dataTrivia.RESTANTES === 0) {
  finalizarTrivia({
    puntosFinales: dataTrivia.PUNTOS,
    totalRespondido: dataTrivia.TOTAL - dataTrivia.RESTANTES
  });
  return;
      }
      if(result.result.NEXT_PREGUNTA){
        dataTrivia.PREGUNTA = result.result.NEXT_PREGUNTA;
        renderPregunta(dataTrivia.PREGUNTA);
      } else {
        finalizarTrivia({
          puntosFinales: result.result.puntos_finales || dataTrivia.PUNTOS,
          totalRespondido: result.result.restantes_finales || 0
        });
      }
    } else {
      mostrarToast(result.message || "Error al procesar la respuesta", "error");
    }
  } catch(err){
    console.error(err);
    mostrarToast("Error interno", "error");
  } finally {
    spinnerSubmit.classList.add("d-none");
    btnEnviar.disabled = false;
  }
});

// Cerrar trivia/modal
function cerrarTrivia(){
  inputTelefono.classList.remove('d-none');
  triviaContainer.classList.add('d-none');     
  btnIniciarTrivia.classList.add('d-none');
  dataParticipante.classList.add('d-none');  
  crosselingContainer.classList.add('d-none');
  resultadoFinal.classList.add('d-none');
  btnIniciarTrivia.disabled = false;
}
btnCerrarModal.addEventListener('click', cerrarTrivia);

// Finalizar trivia
function finalizarTrivia({puntosFinales=0, totalRespondido=0}= {}){
  triviaContainer.classList.add('d-none');
  tituloTrivia.classList.add('d-none');
  resultadoFinal.classList.remove('d-none');
  resultadoFinal.innerHTML = `
    <h3>Trivia finalizada 🎉</h3>
    <p class='mt-4'>Respondiste <strong> ${totalRespondido} preguntas </strong></p>
    <p>Total de puntos obtenidos: <strong>${puntosFinales}</strong></p>
<button class="btn btn-primary mt-3 btn-principal btn-lg" id="btnReiniciarTrivia">Continuar Respondiendo</button>  `;
  // Agregar el event listener para el botón
  document.getElementById('btnReiniciarTrivia').addEventListener('click', reiniciarTrivia);
}

// Reiniciar trivia
function reiniciarTrivia(){
  btnIniciarTrivia.classList.add('d-none');
  tituloTrivia.classList.remove('d-none');
  resultadoFinal.classList.add('d-none');
  triviaContainer.classList.add('d-none');
  inputTelefono.classList.remove('d-none');
}

// Reanudar progreso
window.addEventListener('DOMContentLoaded', () => {
  inputTelefono.classList.remove('d-none');
  btnIniciarTrivia.disabled = true;
  const numeroGuardado = localStorage.getItem("NumeroGuardado");
  if(numeroGuardado){
    document.getElementById('telefono').value = numeroGuardado;
  }
});

// Crosseling packs
function crosselingPacks(dataCrosseling){
  if(dataCrosseling && dataCrosseling.link && dataCrosseling.mensaje){
    crosselingContainer.classList.remove('d-none');
    crosselingContainer.querySelector('p').innerHTML = `
      ${dataCrosseling.mensaje} 
      <a href="${dataCrosseling.link}" target='_blank'>Comprá más ahora 👈</a>
    `;
  } else {
    crosselingContainer.classList.add('d-none');
  }
}

// Flags URL
const urlParams = new URLSearchParams(window.location.search);
const flag = urlParams.get('flag');
if(flag === 'success') mostrarToast("Operación exitosa", "success");
else if(flag === 'failure' || flag === 'fail') mostrarToast("Ocurrió un error", "error");
else if(flag === 'pendding') mostrarToast("Tu operación está pendiente", "warning");
