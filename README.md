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
og/                      Imágenes para compartir cada página (1200×630): home y los tres casos
favicon.svg, favicon.ico Favicon (monograma); icons/ y site.webmanifest para iPhone y Android
css/styles.css           Sistema compartido: colores, tipografía, grilla, navbar, botones, bloques de los casos
css/portfolio.css        Solo la home
js/smooth-scroll.js      Scroll suave con mouse o trackpad (las 4 páginas)
js/count-up.js           Cifras que cuentan desde 0 al entrar en pantalla (las 4 páginas)
js/portfolio.js          Movimiento de la home: carrusel, apilado de cuentas, método, acordeón, tipeo
assets/                  Foto del hero y logos (SVG a una tinta)
```

Con `prefers-reduced-motion` activado, ninguna animación corre y la página muestra todo en su estado final.

## Publicación

Se publica en Vercel desde la rama `main`: cada push se publica solo. Configuración del proyecto: Framework Preset **Other**, sin Build Command.

Las URLs absolutas (`canonical`, `og:url`, `og:image`, `twitter:image`) usan la dirección pública del sitio. Si cambia el dominio, reemplazala en las cuatro páginas:

```bash
sed -i 's#https://lautaro-torres.github.io/Agus-Portfolio#https://NUEVO-DOMINIO#g' *.html
```

WhatsApp, LinkedIn y X solo leen imágenes con dirección completa, por eso no van rutas relativas.

## Tipografías

Cabinet Grotesk, General Sans y Zodiak se cargan desde Fontshare. Si Fontshare no responde, cada familia cae a su equivalente de Google Fonts: Schibsted Grotesk, Plus Jakarta Sans e Instrument Serif.
