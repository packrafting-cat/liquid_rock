const galerias = document.querySelectorAll('.gallery-grid, .taller-gallery');

if (galerias.length && typeof HTMLDialogElement !== 'undefined') {
  const visor = document.createElement('dialog');
  visor.className = 'visor-fotos';
  visor.setAttribute('aria-label', 'Visor de imágenes');
  visor.innerHTML = `
    <div class="visor-controles">
      <button type="button" data-paso="-1" aria-label="Imagen anterior">←</button>
      <button type="button" data-paso="1" aria-label="Imagen siguiente">→</button>
      <button type="button" data-ampliar aria-pressed="false">Ampliar</button>
      <button type="button" data-cerrar autofocus>Cerrar</button>
    </div>
    <div class="visor-imagen" tabindex="0" aria-label="Imagen con desplazamiento cuando está ampliada"><img alt=""></div>
    <p class="visor-contador" aria-live="polite"></p>
  `;
  document.body.append(visor);

  const marco = visor.querySelector('.visor-imagen');
  const imagen = marco.querySelector('img');
  const ampliar = visor.querySelector('[data-ampliar]');
  const contador = visor.querySelector('.visor-contador');
  let enlaces = [];
  let indice = 0;
  let origen;

  function ajustarZoom(activo) {
    marco.classList.toggle('ampliada', activo);
    ampliar.setAttribute('aria-pressed', String(activo));
    ampliar.textContent = activo ? 'Reducir' : 'Ampliar';
    marco.scrollTop = 0;
    marco.scrollLeft = 0;
  }

  function mostrar(paso) {
    indice = (indice + paso + enlaces.length) % enlaces.length;
    const enlace = enlaces[indice];
    imagen.alt = enlace.querySelector('img').alt;
    imagen.src = enlace.href;
    contador.textContent = `${indice + 1} de ${enlaces.length}`;
    ajustarZoom(false);
  }

  for (const galeria of galerias) {
    const grupo = Array.from(galeria.querySelectorAll('a:has(img)'));
    grupo.forEach((enlace, posicion) => {
      enlace.addEventListener('click', evento => {
        if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
        evento.preventDefault();
        origen = enlace;
        enlaces = grupo;
        indice = posicion;
        mostrar(0);
        visor.showModal();
      });
    });
  }

  visor.querySelector('[data-cerrar]').addEventListener('click', () => visor.close());
  ampliar.addEventListener('click', () => ajustarZoom(!marco.classList.contains('ampliada')));
  visor.querySelectorAll('[data-paso]').forEach(boton => {
    boton.addEventListener('click', () => mostrar(Number(boton.dataset.paso)));
  });
  visor.addEventListener('keydown', evento => {
    if (marco.classList.contains('ampliada') || !['ArrowLeft', 'ArrowRight'].includes(evento.key)) return;
    evento.preventDefault();
    mostrar(evento.key === 'ArrowLeft' ? -1 : 1);
  });
  visor.addEventListener('close', () => origen?.focus({ preventScroll: true }));
}
