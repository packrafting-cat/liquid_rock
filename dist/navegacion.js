const cabecera = document.querySelector('.site-header');
const menu = cabecera.querySelector('.nav-toggle');
const enlaces = document.querySelector('#enlaces-principales');

function cerrarMenu() {
  menu.setAttribute('aria-expanded', 'false');
}

menu.addEventListener('click', () => {
  if (menu.getAttribute('aria-expanded') === 'true') cerrarMenu();
  else menu.setAttribute('aria-expanded', 'true');
});

enlaces.addEventListener('click', evento => {
  if (!evento.target.closest('a') || !menu.offsetWidth) return;
  cerrarMenu();
  menu.focus({ preventScroll: true });
});

document.addEventListener('keydown', evento => {
  if (evento.key !== 'Escape' || menu.getAttribute('aria-expanded') !== 'true') return;
  cerrarMenu();
  if (menu.offsetWidth) menu.focus();
});

document.addEventListener('click', evento => {
  if (!cabecera.contains(evento.target)) cerrarMenu();
});

menu.hidden = false;
