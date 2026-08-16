# Quoph · Landing Page

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni compilación) para la
Tienda Esotérica Quoph y las lecturas de Tarot de Simón Pedro.

```
index.html                 estructura de la página
assets/css/styles.css      diseño
assets/js/data.js          👈 PRECIOS, PRODUCTOS, SERVICIOS Y TELÉFONOS
assets/js/main.js          carrito, filtros, formulario de agenda
assets/img/                fotos
```

## Ver el sitio

Basta con abrir `index.html` en el navegador (doble clic).
Si quieres verlo igual que en producción, levanta un servidor local:

```bash
python3 .claude/serve.py 4321
```

y entra a `http://localhost:4321`.

---

## Lo que hay que revisar antes de publicar

### 1. Precios de los productos ⚠️

Ya son reales, con tus fotos y precios: las **13 figuras de yeso** y los **12
colgantes de cristal** engarzados en alpaca. Siguen siendo **de ejemplo** (nombres,
descripciones y precios inventados como relleno) las categorías **velas, inciensos,
amuletos e insumos rituales**. Reemplázalas por las reales en `assets/js/data.js`,
en la lista `PRODUCTOS`:

```js
{ id:'v1', cat:'velas', nombre:'Vela de miel artesanal', desc:'Endulzamiento y armonía.', precio:3500 },
```

- `id` — cualquier texto único (no lo repitas entre productos).
- `cat` — una de: `velas`, `inciensos`, `cuarzos`, `amuletos`, `figuras`, `rituales`.
- `precio` — número entero en pesos, sin puntos ni signo `$`.
- `img` — *opcional*: `img:'assets/img/productos/mi-foto.jpg'`.
  Si no la pones, se muestra una ilustración de línea según la categoría.

Los valores de **Tarot sí son los tuyos** (3 preguntas $10.000, 6 preguntas $18.000,
sesión completa $30.000). Los otros servicios aparecen como "Valor a consultar":
para fijarles precio, cambia `precio:null` por el monto en `SERVICIOS_OTROS`.

### 2. Fotos que faltan

Ya están cargadas: los dos flyers nuevos, tu foto con la carta de El Loco, el flyer
verde de la tienda y las dos fotos del local.

El logo (`assets/img/logo-quoph.png`) ya está puesto: se recorta en círculo con un
aro dorado en el encabezado, aparece completo en el pie de página y se usa como
ícono de la pestaña (`favicon.png`, generado desde el mismo archivo).

> Si algún día tienes el logo **con fondo transparente**, reemplaza el archivo con
> el mismo nombre y borra la línea `transform:scale(1.45)` de `.brand-logo` en
> `styles.css` — se verá aún más limpio.

Si quieres cambiar la foto del apartado "Simón Pedro" (hoy es la del espejo),
reemplaza `assets/img/simon-selfie.jpg` por otra —por ejemplo la de las buganvilias—
manteniendo el mismo nombre de archivo.

**Fotos de productos.** Las 13 figuras de yeso ya están cargadas en
`assets/img/productos/`: recortadas a vertical 3:4, reducidas a 900 px de ancho y
convertidas a JPEG (pasaron de 18 MB en total a 1,8 MB, que es lo que hace que la
página cargue rápido en el celular).

Los archivos originales quedaron intactos en la carpeta `fotos-originales/`, fuera
de `assets/`. **No los subas al hosting** — están ahí solo como respaldo tuyo;
puedes borrar esa carpeta antes de publicar.

Para agregar más productos con foto: deja la imagen en `assets/img/productos/`
(idealmente vertical 3:4) y suma el campo `img` al producto en `data.js`.

### 3. La historia de la casa

Está escrita directamente en `index.html`, en la sección `<section id="historia">`:
el relato de los 25 años, el linaje de Katryn (Suma Sacerdotisa y fundadora, más de
40 años leyendo el Tarot) y Simón como continuador. Se menciona además en la portada,
en "Sobre Simón" y en "El local". Si quieres cambiar la redacción, edítala ahí — es
texto plano, no depende de ningún archivo de datos.

### 4. Teléfonos

Están al inicio de `assets/js/data.js`:

```js
waTienda: '56947073628',   // pedidos del catálogo
waTarot:  '56935068224',   // agenda de tarot
```

### 5. Horarios

También en `data.js`. `dias` usa 0 = domingo … 6 = sábado.

```js
online:     { dias: [0,1,2,3,4,5,6], desde: 11, hasta: 23 },
presencial: { dias: [1,2,3,4,5],     desde: 11, hasta: 19 }
```

El formulario de agenda bloquea automáticamente los días fuera de rango
(por ejemplo, no deja pedir hora presencial un sábado) y arma la lista de horas
cada 30 minutos.

---

## Cómo funciona el carrito

- Cada "Agregar" guarda el producto en el navegador (`localStorage`), así que el
  carrito no se pierde si la persona recarga la página.
- "Finalizar pedido por WhatsApp" abre un chat al número de la tienda con el
  detalle del pedido y el total ya escritos.
- **No hay pago en línea.** El cierre de la venta lo haces tú por WhatsApp
  (stock, despacho y medio de pago). Si más adelante quieres cobrar en el sitio
  —Webpay, Mercado Pago o Flow— eso requiere agregar una pasarela.

El formulario de agenda funciona igual: no guarda datos en ningún servidor, solo
redacta el mensaje y lo abre en WhatsApp.

## Publicar

Al ser un sitio estático, sirve cualquier hosting gratuito: arrastra la carpeta
completa a [netlify.com/drop](https://app.netlify.com/drop), o súbela a Vercel o
GitHub Pages. También funciona en un hosting tradicional por FTP.
