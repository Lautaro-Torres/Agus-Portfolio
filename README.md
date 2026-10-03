# Portfolio — Agustina Isasmendi

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni paso de build): la home del portfolio y tres casos de cuenta.

## Verlo

Abrí `index.html` en el navegador. No hace falta instalar nada.

## Estructura

```
index.html               Home: hero, cuentas, método, habilidades, experiencia y contacto
caso-nubicom.html        Caso 01
caso-gomez-roco.html     Caso 02
caso-kenja-motors.html   Caso 03
og-image.png             Imagen para compartir el link (1200×630)
css/styles.css           Sistema compartido: colores, tipografía, grilla, navbar, botones, bloques de los casos
css/portfolio.css        Solo la home
js/smooth-scroll.js      Scroll suave con mouse o trackpad (las 4 páginas)
js/count-up.js           Cifras que cuentan desde 0 al entrar en pantalla (las 4 páginas)
js/portfolio.js          Movimiento de la home: carrusel, apilado de cuentas, método, acordeón, tipeo
assets/                  Foto del hero y logos (SVG a una tinta)
```

Con `prefers-reduced-motion` activado, ninguna animación corre y la página muestra todo en su estado final.

## Publicarlo en GitHub Pages

1. Subí el contenido de esta carpeta a la raíz de un repositorio.
2. En el repositorio: **Settings → Pages → Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. El sitio queda en `https://lautaro-torres.github.io/Agus-Portfolio/`. Las cuatro páginas ya apuntan `og:image` a `https://lautaro-torres.github.io/Agus-Portfolio/og-image.png`: si el repo cambia de nombre o se usa otro dominio, hay que actualizar esa dirección (WhatsApp y LinkedIn no leen rutas relativas).

## Tipografías

Cabinet Grotesk, General Sans y Zodiak se cargan desde Fontshare. Si Fontshare no responde, cada familia cae a su equivalente de Google Fonts: Schibsted Grotesk, Plus Jakarta Sans e Instrument Serif.
