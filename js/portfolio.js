// Movimiento de la home: carrusel de marcas, desenfoque del hero, apilado de cuentas,
// paso activo de Método, brillo de tarjetas, acordeón de Experiencia y tipeo del CTA.
// Con prefers-reduced-motion la página cuenta exactamente lo mismo, sin animación.
(function () {
  const reducedMq = matchMedia('(prefers-reduced-motion: reduce)');
  const wideMq = matchMedia('(min-width: 900px)');
  const EASE = 'cubic-bezier(.2,.7,.3,1)';

  /* ---------- Carrusel de marcas: scroll infinito, pausa al pasar el mouse ---------- */

  const marquee = document.querySelector('[data-marquee]');
  const track = document.querySelector('[data-marquee-track]');
  if (marquee && track) {
    // Segunda copia, oculta para lectores de pantalla, para que el loop no tenga corte
    const copy = track.firstElementChild.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);

    let x = 0;
    let paused = false;
    let last = performance.now();
    marquee.addEventListener('mouseenter', () => { paused = true; });
    marquee.addEventListener('mouseleave', () => { paused = false; });

    const tick = (t) => {
      const dt = Math.min(64, t - last);
      last = t;
      if (reducedMq.matches) {
        track.style.transform = 'none';
        x = 0;
      } else {
        if (!paused) {
          x -= dt * 0.04;
          const half = track.scrollWidth / 2;
          if (half && -x >= half) x += half;
        }
        track.style.transform = `translate3d(${x}px,0,0)`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Efectos atados al scroll ---------- */

  const hero = document.getElementById('inicio');
  const steps = [...document.querySelectorAll('[data-step]')];
  const stepIndex = [...document.querySelectorAll('[data-step-index] li')];
  const stacks = [...document.querySelectorAll('[data-stack]')];
  let activeStep = 0;

  // El hero se desenfoca y se apaga de a poco al salir; arranca recién pasado el 20% del scroll.
  const updateHero = () => {
    if (!hero) return;
    if (reducedMq.matches) {
      hero.style.filter = '';
      hero.style.opacity = '';
      hero.style.transform = '';
      return;
    }
    const h = hero.offsetHeight || 1;
    const p = Math.min(1, Math.max(0, (window.scrollY - h * 0.2) / (h * 0.8)));
    const e = p * p * (3 - 2 * p);
    hero.style.filter = e > 0.002 ? `blur(${(e * 6).toFixed(2)}px)` : '';
    hero.style.opacity = String(1 - e * 0.35);
    hero.style.transform = e > 0.002 ? `scale(${(1 - e * 0.02).toFixed(4)})` : '';
  };

  // Paso activo: el que cruza una línea de lectura al 45% de la pantalla, o el más cercano.
  const updateSteps = () => {
    if (!steps.length) return;
    const line = window.innerHeight * 0.45;
    const center = (r) => Math.abs(r.top + r.height / 2 - line);
    let a = 0;
    let best = Infinity;
    steps.forEach((n, i) => {
      const r = n.getBoundingClientRect();
      const d = line < r.top ? r.top - line : line > r.bottom ? line - r.bottom : 0;
      if (d < best || (d === 0 && best === 0 && center(r) < center(steps[a].getBoundingClientRect()))) {
        best = d;
        a = i;
      }
    });
    if (a === activeStep) return;
    activeStep = a;
    steps.forEach((n, i) => n.classList.toggle('is-active', i === a));
    stepIndex.forEach((n, i) => n.classList.toggle('is-active', i === a));
  };

  // Apilado de cuentas: cada tarjeta se fija 16px (12px en mobile) más abajo que la anterior.
  // La que queda tapada pierde opacidad, escala y saturación y se desenfoca según el scroll real.
  const updateStacks = () => {
    const off = reducedMq.matches;
    const base = wideMq.matches ? 96 : 84;
    const step = wideMq.matches ? 16 : 12;
    stacks.forEach((w, i) => {
      const card = w.firstElementChild;
      if (!card) return;
      if (!off) {
        // Si la tarjeta es más alta que la pantalla, recorre todo su contenido antes de fijarse
        const t = base + i * step;
        w.style.top = Math.min(t, window.innerHeight - card.offsetHeight - 16 + i * step) + 'px';
      }
      if (off || i === stacks.length - 1) {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.filter = '';
        return;
      }
      const h = card.offsetHeight || 1;
      const d = stacks[i + 1].getBoundingClientRect().top - card.getBoundingClientRect().top;
      const p = 1 - Math.min(1, Math.max(0, d / h));
      const e = Math.min(1, p * 2.2);
      card.style.opacity = String(1 - e * 0.75);
      card.style.transform = `scale(${1 - p * 0.055})`;
      card.style.filter = p > 0.001 ? `blur(${(e * 20).toFixed(2)}px) saturate(${(1 - e * 0.8).toFixed(2)})` : '';
    });
  };

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      updateHero();
      updateSteps();
      updateStacks();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  reducedMq.addEventListener('change', onScroll);
  wideMq.addEventListener('change', onScroll);
  window.addEventListener('load', onScroll);

  /* ---------- Foto del hero en mobile: empieza debajo del párrafo, nunca detrás del texto ---------- */

  const lead = document.querySelector('.hero__lead');
  const fitPhoto = () => {
    if (!hero || !lead) return;
    if (wideMq.matches) { hero.style.removeProperty('--photo-top'); return; }
    const top = lead.getBoundingClientRect().bottom - hero.getBoundingClientRect().top + 12;
    hero.style.setProperty('--photo-top', Math.round(top) + 'px');
  };
  fitPhoto();
  window.addEventListener('resize', fitPhoto);
  wideMq.addEventListener('change', fitPhoto);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitPhoto);
  onScroll();

  /* ---------- Brillo radial que sigue al cursor dentro de las tarjetas ---------- */

  document.querySelectorAll('[data-glow]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '-999px');
      el.style.setProperty('--my', '-999px');
    });
  });

  /* ---------- Acordeón de Experiencia: se abre y se cierra animado ---------- */

  document.querySelectorAll('[data-job]').forEach((det) => {
    const summary = det.querySelector('summary');
    const body = det.querySelector('[data-job-body]');
    let anim = null;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const opening = !det.open;
      if (anim) anim.cancel();
      // La clase cambia al instante, así el + y el chevron giran en el mismo momento del clic
      det.classList.toggle('is-open', opening);
      if (reducedMq.matches || !body.animate) {
        det.open = opening;
        return;
      }
      if (opening) {
        det.open = true;
        const h = body.scrollHeight;
        anim = body.animate(
          [{ height: '0px', opacity: 0, transform: 'translateY(-8px)' }, { height: h + 'px', opacity: 1, transform: 'none' }],
          { duration: 420, easing: EASE }
        );
        anim.onfinish = () => { anim = null; };
      } else {
        const h = body.scrollHeight;
        const an = body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: EASE, fill: 'forwards' });
        anim = an;
        // Queda en cero hasta que el panel se cierra, sin volver un instante a su altura completa
        an.onfinish = () => { det.open = false; anim = null; requestAnimationFrame(() => an.cancel()); };
      }
    });

    // Si el navegador abre el panel por su cuenta (por ejemplo, al buscar texto), sincroniza la clase
    det.addEventListener('toggle', () => {
      if (!anim) det.classList.toggle('is-open', det.open);
    });
  });

  /* ---------- Tipeo del CTA ---------- */

  const typer = document.querySelector('[data-typer]');
  if (typer) {
    const segs = [{ t: 'Una buena cuenta se sostiene en la ' }, { t: 'confianza.', serif: true }];
    const chars = [];
    segs.forEach((sg) => [...sg.t].forEach((c) => chars.push({ c, serif: !!sg.serif })));

    // Arma las letras agrupadas por palabra, para que una palabra nunca se corte entre líneas
    const out = document.createElement('span');
    out.setAttribute('aria-hidden', 'true');
    const caret = document.createElement('span');
    caret.className = 'tw-caret';
    const els = [];
    let word = null;
    chars.forEach((ch) => {
      if (ch.c === ' ') {
        els.push(out.appendChild(document.createTextNode(' ')));
        word = null;
        return;
      }
      if (!word || word.serif !== ch.serif) {
        word = { serif: ch.serif, el: document.createElement(ch.serif ? 'em' : 'span') };
        word.el.className = ch.serif ? 'tw-word accent' : 'tw-word';
        out.appendChild(word.el);
      }
      const s = document.createElement('span');
      s.className = 'tw-char';
      s.textContent = ch.c;
      els.push(word.el.appendChild(s));
    });
    typer.replaceChildren(out);

    const total = chars.length;
    const show = (n) => {
      for (let i = 0; i < n; i++) if (els[i].classList) els[i].classList.add('is-on');
      // El cursor va justo después de la última letra escrita
      if (n === 0) out.querySelector('.tw-word').prepend(caret);
      else els[n - 1].after(caret);
      caret.classList.toggle('is-done', n >= total);
    };

    if (reducedMq.matches) {
      show(total);
    } else {
      show(0);
      let started = false;
      const step = (i) => {
        show(i);
        if (i >= total) return;
        const c = chars[i].c;
        const d = c === ' ' ? 90 : /[.,]/.test(c) ? 220 : 38 + Math.random() * 42;
        setTimeout(() => step(i + 1), d);
      };
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !started) {
          started = true;
          setTimeout(() => step(1), 350);
          io.disconnect();
        }
      }, { threshold: 0.5 });
      io.observe(typer);
    }
  }
})();
