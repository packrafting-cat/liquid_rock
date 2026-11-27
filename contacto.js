const formulario = document.querySelector('#formulario');
const modalidad = formulario.elements.actividad;
const detalles = formulario.elements.message;
const boton = formulario.querySelector('button[type="submit"]');
const resultado = document.querySelector('#resultado');
const avisoPendiente = document.querySelector('#consulta-pendiente');
const clave = formulario.elements.access_key.value.trim();
const activo = Boolean(clave);

const consulta = new URLSearchParams(location.search);
const actividad = consulta.get('actividad');
const zona = consulta.get('zona');

if (Array.from(modalidad.options).some(opcion => opcion.value === actividad)) {
  modalidad.value = actividad;
}
if (zona === 'Riglos' || zona === 'Valle de Benasque') {
  detalles.value = 'Zona: ' + zona + '\n';
}

if (activo) {
  boton.disabled = false;
  boton.removeAttribute('aria-describedby');
  avisoPendiente.hidden = true;
}

formulario.addEventListener('submit', async evento => {
  evento.preventDefault();
  if (!activo || boton.disabled) return;

  boton.disabled = true;
  resultado.hidden = false;
  resultado.textContent = 'Enviando consulta…';

  try {
    const respuesta = await fetch(formulario.action, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(formulario))),
      signal: AbortSignal.timeout(15000),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok || datos.success !== true) {
      throw new Error('El servicio no confirmó el envío');
    }
    formulario.reset();
    resultado.textContent = 'Consulta enviada. Gracias por escribir a Liquid Rock.';
  } catch {
    resultado.textContent = 'No se ha podido confirmar el envío. Inténtalo de nuevo o escribe a José por WhatsApp.';
  } finally {
    boton.disabled = false;
  }
});
