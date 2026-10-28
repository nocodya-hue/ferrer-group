// Ferrer Group · cabecera que se marca al bajar, apariciones, el «ascensor» que cambia de planta y el formulario a WhatsApp.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const TEL = '34687720667';

  // cabecera con borde al bajar
  const cab = $('.cab');
  const marcar = () => cab.classList.toggle('bajado', scrollY > 8);
  addEventListener('scroll', marcar, { passive: true });
  marcar();

  // apariciones (los hermanos entran escalonados)
  const ver = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto');
    ver.unobserve(e.target);
  }), { rootMargin: '0px 0px -6% 0px' });
  const porPadre = new Map();
  $$('.rv').forEach((el) => {
    const n = porPadre.get(el.parentNode) || 0;
    porPadre.set(el.parentNode, n + 1);
    el.style.setProperty('--i', Math.min(n, 5));
    ver.observe(el);
  });

  // tu edificio, planta a planta: el indicador del ascensor marca la planta que está en el centro de la pantalla
  const ascensor = $('.ascensor'), numero = $('.ascensor__planta');
  const plantas = $$('.planta');
  let actual = 0;
  plantas[0]?.classList.add('activa');
  const ir = (i) => {
    if (i === actual || i < 0) return;
    const baja = i > actual;                       // al bajar por la página, el ascensor baja
    ascensor.classList.toggle('baja', baja);
    ascensor.classList.toggle('sube', !baja);
    plantas.forEach((p, k) => p.classList.toggle('activa', k === i));
    numero.style.setProperty('--d', baja ? '-12px' : '12px');
    numero.classList.add('cambia');
    setTimeout(() => {
      numero.textContent = plantas[i].dataset.planta;
      numero.style.setProperty('--d', baja ? '12px' : '-12px');
      requestAnimationFrame(() => requestAnimationFrame(() => numero.classList.remove('cambia')));
    }, 170);
    actual = i;
  };
  const vigia = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) ir(plantas.indexOf(e.target)); }), { rootMargin: '-45% 0px -45% 0px' });
  plantas.forEach((p) => vigia.observe(p));

  // formulario: abre WhatsApp con el mensaje ya escrito
  $('#formulario')?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(ev.target));
    const texto = [
      'Hola Ferrer Group, quiero pedir presupuesto.',
      `Nombre: ${d.nombre}`,
      `Servicio: ${d.tipo}`,
      d.zona ? `Dirección o zona: ${d.zona}` : '',
      d.mensaje ? `Mensaje: ${d.mensaje}` : '',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${TEL}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  });
})();
