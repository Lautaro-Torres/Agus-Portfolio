// Scroll suave con inercia para mouse y trackpad.
// No corre en pantallas táctiles ni con movimiento reducido: ahí queda el scroll nativo.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!matchMedia('(pointer: fine)').matches) return;

  document.documentElement.style.scrollBehavior = 'auto';

  let target = window.scrollY;
  let cur = window.scrollY;
  let running = false;
  let last = 0;

  const max = () => document.documentElement.scrollHeight - window.innerHeight;

  // El factor se ajusta por tiempo transcurrido, así se siente igual a 60Hz y a 120Hz.
  const loop = (t) => {
    const dt = last ? Math.min(48, t - last) : 16.67;
    last = t;
    const k = 1 - Math.pow(1 - 0.072, dt / 16.67);
    cur += (target - cur) * k;
    if (Math.abs(target - cur) < 0.3) {
      cur = target;
      running = false;
      last = 0;
    }
    window.scrollTo(0, cur);
    if (running) requestAnimationFrame(loop);
  };

  const go = () => {
    if (running) return;
    running = true;
    last = 0;
    requestAnimationFrame(loop);
  };

  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.defaultPrevented) return;
    e.preventDefault();
    if (!running) cur = target = window.scrollY;
    const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
    target = Math.max(0, Math.min(max(), target + d * 1.1));
    go();
  }, { passive: false });

  window.addEventListener('scroll', () => {
    if (!running) cur = target = window.scrollY;
  }, { passive: true });

  // Links internos (#ancla) con el mismo movimiento, frenando antes para que la navbar no tape el título.
  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('a[href*="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    const page = location.pathname.split('/').pop();
    if (href[0] !== '#' && !href.startsWith(page + '#')) return;
    const el = document.getElementById(href.slice(href.indexOf('#') + 1));
    if (!el) return;
    e.preventDefault();
    if (!running) cur = window.scrollY;
    const off = parseFloat(getComputedStyle(el).scrollMarginTop) || 96;
    target = Math.max(0, Math.min(max(), el.getBoundingClientRect().top + window.scrollY - off));
    go();
  });
})();
