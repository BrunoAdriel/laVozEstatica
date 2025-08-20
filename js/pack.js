//Objeto 
const dataRecived = {
    pack: [
      {ID_ITEM: 1, ITEM: "50 Preguntas", DESCRIPTION: "50", ITEM_PRICE: 50, ITEM_CANT: 50},
      {ID_ITEM: 2, ITEM: "100 Preguntas", DESCRIPTION: "100", ITEM_PRICE: 100, ITEM_CANT: 100},
      {ID_ITEM: 3, ITEM: "150 Preguntas", DESCRIPTION: "150", ITEM_PRICE: 150, ITEM_CANT: 150},
      {ID_ITEM: 4, ITEM: "200 Preguntas", DESCRIPTION: "200", ITEM_PRICE: 200, ITEM_CANT: 200},
    ],
  carrier : [
  {name : "claro", id : 1},
  {name : "personal", id : 2},
  {name : "movistar", id : 3},
  ],
  plataforma : [
    {name : "Mercado Pago", id : 1, url : "/pack/index.html?flag=success"},
    {name : "Pago360", id : 2, url : "/pack//index.html?flag=success"},
    {name : "Mensaje de Texto", id : 3, url : "/pack//index.html?flag=success"}
  ],
    id_producto: 355,
    id_trivia: 501
}


//Conductores
const cardsContainer =document.getElementById("cardsContainer");
const medioPago = document.getElementById("medioPago");
const seccionCard = document.getElementById('seccionCard');
const seccionPago = document.getElementById('seccionPago');
const seccionFormulario = document.getElementById('seccionFormulario');
const cerrarModalPago = document.getElementById('cerrarModalPago');
const cerrarModalForm = document.getElementById('cerrarModalForm');

//Variables
let packSeleccionado = null;
let plataformaSeleccionada = null;
let idMedioPago = null;
let opcionElegida = "";

/* //Conexiones al backend
const url = "http://localhost:3000";

async function ObtenerPacks(){
  try{
    // Realizar la solicitud al backend
    const res = await  fetch(`${url}/packs`,)
    const data = await res.json();
    if (!data.status) throw new Error('Error en la API');
    
    // Asigno al objeto global
    Object.assign(dataRecived, data.result)
    cargarOperadoras(dataRecived.carrier);
    return data.result.pack;

  }catch(error){
    console.error("Error al obtener los packs de pregunta", error);
    return [] ;
  }
}
 */
// Logica del servidor
async function CrearCards(){
    try {
    const packs = dataRecived.pack; 
    cardsContainer.innerHTML = "";

    packs.forEach(p=>{
    //Inyecto las cards
    const cardHTMT =`
    <div class="col">
      <div class="card card-custom" id="card-${p.ID_ITEM}">
        <section class="header-custom">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA24Z-JDbwSxxVtbqy07-Sq7nulnXMN5YcgA&s" alt="${p.ITEM}" class="card-img-top"/>
          <h5 class="card-title">${p.ITEM}</h5>
        </section>
        <section class="card-body d-none">
          <p class="card-text">${p.DESCRIPTION}</p>
          <p class="card-text"><small>Valor: $${p.ITEM_PRICE}</small></p>
          <p hidden>${p.ITEM_CANT}</p>
            <section class="card-footer d-flex justify-content-center">
              <button class="btn btn-compra btn-principal btn-outline-primary mt-3" id-data-pack="${p.ID_ITEM}" >Comprar preguntas</button>
            </section>
        </section>
      </div>
    </div>
    `;
    cardsContainer.innerHTML += cardHTMT;
    });


  /* Codigo para que se vea todo el contenido de la CARD */
  document.querySelectorAll(".card-body").forEach(body => {
    body.classList.remove("d-none");
  });

    //Agregar eventos en los btn
    setTimeout(() => {
      document.querySelectorAll(".btn-compra").forEach(btn => {
        btn.addEventListener("click", (e) => {
          seccionCard.classList.add("d-none");
          seccionPago.classList.remove("d-none");

          // Inyectar botones de pago
          const packID = parseInt(e.target.getAttribute('id-data-pack'), 10);
          const item = dataRecived.pack.find(p => p.ID_ITEM=== packID);
          //Capturo los elementos para enviar
            if (item) {
              packSeleccionado = {
                id_ITEM: item.ID_ITEM,
                ITEM_PRICE: item.ITEM_PRICE,
                ITEM_CANT: item.ITEM_CANT 
              };
            }
          crearBtn(dataRecived.plataforma);
        });
      });
    }, 0);

} catch (error) {
    console.error("Error al cargar packs:", error);
    cardsContainer.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los packs.</div>`;
  }
}

CrearCards();

//inyecto los btn de pago
function crearBtn(plataforma) {
  medioPago.innerHTML = plataforma.map(plat => `
    <button class="btn btn-outline-primary option-btn btn-principal m-2" data-option="${plat.name}" data-id="${plat.id_plataforma}">${plat.name}</button>
  `).join('');
  console.log("Plataformas cargadas:", plataforma);

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const opcion = e.target.getAttribute('data-option');
        const id = parseInt(e.target.getAttribute('data-id'), 10);

        if (opcion === "Mensaje de Texto") {
          mostrarToast("Compra con Mensaje de texto exitosa exitosa", "success");
          console.log("Redireccion: /pack/index.html?flag=success");
          // Si quieres mostrar los datos seleccionados, puedes agregar:
          if (packSeleccionado) {
            console.log("Datos seleccionados:", packSeleccionado);
          }
          return;
        }

// Guardar selección
    window.opcionElegida = opcion;
    window.idMedioPago = id;

    // Modificar el contenido del H4 resumen
    const resumenVoto = document.getElementById("resumenVoto");
    if (resumenVoto && packSeleccionado && opcion) {
      resumenVoto.innerText = `Comprar pack de ${packSeleccionado.ITEM_CANT} preguntas con ${opcion}`;
    }

    // Ocultar sección de pago, mostrar formulario
    document.getElementById('seccionPago').classList.add('d-none');
    document.getElementById('seccionFormulario').classList.remove('d-none');
      });
    });
}

//Inyecto las operadoras

function cargarOperadoras(data) {
  const selectOperadora = document.getElementById('operadora');

  // Limpiamos opciones previas
  selectOperadora.innerHTML = '';

  data.carrier.forEach(carrier => {
    const option = document.createElement('option');
    option.value = carrier.id; // Ajuste según tu objeto
    option.textContent = carrier.name.charAt(0).toUpperCase() + carrier.name.slice(1); 
    selectOperadora.appendChild(option);
  });
}

// Llamamos a la función pasando el objeto
cargarOperadoras(dataRecived);


//funcion cerrar modal
function manejarCerrarModal(e) {
  const id = e.target.id;

  if (id === "cerrarModalForm") {
    seccionFormulario.classList.add("d-none");
    seccionPago.classList.remove("d-none");
  } else if (id === "cerrarModalPago") {
    seccionPago.classList.add("d-none");
    seccionCard.classList.remove("d-none");
  }
}
// Listeners
cerrarModalForm.addEventListener("click", manejarCerrarModal);
cerrarModalPago.addEventListener("click", manejarCerrarModal);


//Restricciones de letras y caracteres especiales del imput telefono 
const telefonoInput = document.getElementById('telefono');

telefonoInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^\d]/g, '');
});

// Enviar formulario
const voteForm = document.getElementById('voteForm');
voteForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const telefono = document.getElementById('telefono').value.trim();
  const email = document.getElementById('email').value.trim();
  const operadora = parseInt(document.getElementById('operadora').value, 10);

  const telefonoRegex = /^[0-9]{10,15}$/;
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!telefonoRegex.test(telefono)) {
    document.getElementById('formErrors').innerText = "Número inválido.";
    return;
  }

  if (!emailRegex.test(email)) {
    document.getElementById('formErrors').innerText = "Email inválido.";
    return;
  }

  if (!operadora || operadora === "Seleccioná") {
    document.getElementById('formErrors').innerText = "Elegí una operadora.";
    return;
  }

  //al clickear el btn, se va y aparece el spinner
  document.getElementById('btnEnviar').classList.add('d-none');
  document.getElementById('postSubmit').classList.remove('d-none');
 

  // Datos a enviar
  const datos = { 
    id_plataforma: window.opcionElegida, 
    id_trivia: dataRecived.id_trivia,
    id_item: packSeleccionado.id_ITEM,
    item_cant: packSeleccionado.ITEM_CANT,
    item_price: packSeleccionado.ITEM_PRICE,
    ani: telefono,
    email: email,
    id_carrier: operadora,
    id_producto: dataRecived.id_producto
  };

  // Mostrar mensaje y datos en consola, sin enviar a la API
  mostrarToast("Compra de packs completada correctamente", "success");
  console.log("Datos seleccionados:", datos);
  setTimeout(() => {
    document.getElementById('postSubmit').classList.add('hidden');
    document.getElementById('btnEnviar').classList.remove('d-none');
  }, 1500);
});


//Mostrar el Toast segun el estado
function mostrarToast(mensaje, tipo) {
  let color = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #d32f2f, #ff5252)",
    warning: "linear-gradient(to right, #f7b733, #fc4a1a)"
  }; 

  Toastify({
    text: mensaje,
    style : { background: color[tipo] }|| "linear-gradient(to right, #00c6ff, #0072ff)",
    duration: 3000,
    gravity: "center",
    position: "center",
    close: true
  }).showToast();
};

//Extrae el valor de los parametros de la URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const flag = urlParams.get('flag');

//Selecciona segun la operacion
if (flag === 'success') {
  mostrarToast("Operación exitosa", "success");
} else if (flag === 'failure' || flag === 'fail') {
  mostrarToast("Ocurrió un error", "error");
} else if (flag === 'pendding') {
  mostrarToast("Tu operación está pendiente", "warning");
}


//Funcion para capturar la informacion de la plataforma
function plataformaData(nombre){
  return dataRecived.plataforma.find(p => p.name === nombre)
}; 

// Función para enviar los datos al backend
async function enviarPago(datos, metodoPago) {  
    const plataformaSeleccionada = plataformaData(metodoPago);  

    //Si el metodoPago elegido tiene distinta URL al seleccionado
    if(!plataformaSeleccionada){
    document.getElementById("formErrors").innerText = "Método de pago no válido.";
    return;
  }

  try {
    const response = await fetch(`${url}/packs`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
  });
    const contentType = response.headers.get("Content-Type") || "";
    if (!response.ok) {
      console.log("rta", response)
      console.error("Error HTTP:", response.status);
      const errorText = await response.text(); 
      console.error("Error HTTP:", response.status, errorText);
      document.getElementById("formErrors").innerText = `Error del servidor (${response.status})`;
      mostrarToast("Ocurrió un Error el procesar tu pago", "error");
      return;
    }

    if (contentType.includes("application/json")) {
      const data = await response.json(); 
      console.log("Respuesta JSON:", data);
      console.log("datos enviados:", datos);

      if (data.status && data.result) {
        const redireccion = data.result.init_point || data.result.checkout_url;
        console.log("Redireccion",redireccion)

        mostrarToast("Formulario enviado correctamente", "success");
        console.log("Datos enviados:", data);
        //window.location.href = redireccion; 

      }
    } else {
      const errorText = await response.text();
      document.getElementById("formErrors").innerText = "Respuesta inesperada del servidor.";
      mostrarToast("Respuesta inesperada del servidor", "warning");
    }
  } catch (error) {
    console.error("Error en fetch:", error);
    document.getElementById("formErrors").innerText = "Error de conexión con el servidor.";
    document.getElementById("postSubmit").classList.add("hidden"); 
    mostrarToast("Error en la coneccion del servidor", "error");
  }
}
