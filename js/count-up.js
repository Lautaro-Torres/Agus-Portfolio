// Cifras que cuentan desde 0 hasta su valor cuando entran en pantalla.
// Respeta el formato argentino de cada cifra: $, puntos de miles, coma decimal, %, ~.
// El lector de pantalla siempre lee la cifra final. Con movimiento reducido no se anima.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const SELECTOR = '.metric__value, .metrics-minor__value, .account__value, .chip-figure, [data-count]';
  const DURATION = 1600;
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);

  // "1234567,8" con 1 decimal → "1.234.567,8"
  const format = (value, decimals, grouped) => {
    const [int, dec] = value.toFixed(decimals).split('.');
    const intFmt = grouped ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : int;
    return dec ? `${intFmt},${dec}` : intFmt;
  };

  const prepare = (el) => {
    // Solo elementos con texto plano: si tiene marcado adentro, se marca la cifra con data-count
    if (el.children.length) return null;
    const text = el.textContent;
    const m = text.match(/^(\D*?)(\d[\d.]*(?:,\d+)?)([\s\S]*)$/);
    if (!m) return null;
    const [, prefix, raw, suffix] = m;
    const decimals = raw.includes(',') ? raw.split(',')[1].length : 0;
    const target = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
    if (!isFinite(target) || target === 0) return null;

    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    const visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');
    const num = document.createElement('span');
    num.className = 'count';
    num.textContent = raw;
    visible.append(prefix, num, suffix);
    el.replaceChildren(sr, visible);

    // Reserva el ancho final para que la cifra no empuje nada mientras crece
    const size = parseFloat(getComputedStyle(num).fontSize) || 16;
    num.style.minWidth = (num.getBoundingClientRect().width / size).toFixed(3) + 'em';
    num.textContent = format(0, decimals, raw.includes('.'));
    return { num, target, decimals, grouped: raw.includes('.') };
  };

  const run = ({ num, target, decimals, grouped }) => {
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      num.textContent = format(target * easeOut(p), decimals, grouped);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const items = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      run(items.get(e.target));
    });
  }, { threshold: 0.6 });

  const init = () => {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      const item = prepare(el);
      if (!item) return;
      items.set(el, item);
      io.observe(el);
    });
  };

  // Espera a las fuentes para medir el ancho final con la tipografía real
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(init);
  else init();
})();
